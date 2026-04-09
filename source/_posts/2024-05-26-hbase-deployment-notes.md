---
title: HBase部署教程
date: 2024-05-26 00:00:00
updated: 2024-05-26 00:00:00
author: Xing Han
categories:
  - 大数据技术
tags:
  - 大数据技术
description: HBase部署问题与解决方案汇总。
home_cover: /medias/featureimages/3.jpg
post_cover: /medias/banner/3.jpg
---
# Bug 1：下载Docker时报错

- 问题描述
在使用 `yum` 下载 Docker 时，显示错误信息：“`docker-buildx-plugin-0.14.0-1.el7.aarch64.rpm` 的公钥尚未安装”。

- 问题原因
这是因为缺少必要的GPG密钥来验证RPM包的签名。

- 解决方法
解决方法是导入Docker官方的GPG公钥，执行以下命令：

```bash
sudo rpm --import https://download.docker.com/linux/centos/gpg
```

然后重新尝试下载。

---

# Bug 2：重启系统后Docker容器断联

- 问题描述
重启系统后，Docker容器断联，无法启动Hadoop服务。

- 问题原因
这是由于缺乏对Docker容器生命周期管理和网络配置的理解。当Docker容器重启时，对 `/etc/hosts` 文件的更改会丢失，因为容器通常是无状态的，除非特别配置以保留状态。

- 解决方法
1. **配置容器生命周期管理**：
   使用 `--restart` 选项启动容器，确保它们在Docker服务启动时自动重启：

   ```bash
   docker run --restart unless-stopped -d master/slave1/slave2/slave3
   ```

2. **持久化配置文件**：
   使用Docker Compose文件定义服务器集群服务，并包含重启策略和卷挂载。在 `docker-compose.yml` 文件中添加以下内容：

   ```yaml
   version: '3.7'
   services:
     master:
       build: .
       hostname: master
       environment:
         - ZOOKEEPER_ID=1
       ports:
         - "2181:2181"
         - "2888:2888"
         - "3888:3888"
       networks:
         - zoo-network

     slave1:
       build: .
       hostname: slave1
       environment:
         - ZOOKEEPER_ID=2
       ports:
         - "2182:2181"
         - "2889:2888"
         - "3889:3888"
       networks:
         - zoo-network

     slave2:
       build: .
       hostname: slave2
       environment:
         - ZOOKEEPER_ID=3
       ports:
         - "2183:2181"
         - "2890:2888"
         - "3890:3888"
       networks:
         - zoo-network

     slave3:
       build: .
       hostname: slave3
       environment:
         - ZOOKEEPER_ID=4
       ports:
         - "2184:2181"
         - "2891:2888"
         - "3891:3888"
       networks:
         - zoo-network

   networks:
     zoo-network:
       driver: bridge
   ```

   通过这种配置，可以避免每次开机都需要手动重启容器并重新配置网络服务的问题。

---

# Bug 3：启动Hadoop时出现ResourceManager已在运行的报错

- 问题描述
在尝试启动ResourceManager时，系统提示ResourceManager已经在运行。

- 问题原因
这通常发生在尝试重启ResourceManager时，而之前的进程尚未正确关闭。

- 解决方法
输入 `stop-all.sh` 关闭Hadoop服务，再重新启动。如果问题依旧，使用 `kill + 进程号` 强制关闭ResourceManager进程，然后重新启动。

---

# Bug 4：启动Zookeeper时，master节点启动失败，而其他节点正常

- 问题描述
启动Zookeeper时，所有节点服务正常启动，但是输入 `zkServer.sh status` 命令查看服务状态时，master节点显示“`Error contacting service. It is probably not running.`”的报错。

- 问题原因
可能的原因包括：
- 服务器防火墙未关闭。
- 安全组没有开放用于主节点选举的通讯端口3555（适用于多台服务器的情况）。
- 服务器启动顺序错误（从大号到小号 `myid` 启动）。
- 初次错误连接时生成了错误的临时文件，影响后续连接。

- 解决方法
- 调整防火墙和安全组设置。
- 按正确顺序启动服务器，从小号 `myid` 启动到大号 `myid`。
- 删除 `/usr/local/zookeeper/tmp` 路径下的 `version-2` 文件夹。

---

# Bug 5：服务器负载过高导致启动服务时内存分配失败

- 问题描述
服务器负载过高，导致启动服务时内存分配失败，无法运行服务，或者服务器响应过慢。

- 问题原因
最初开通的服务器配置为2核4GB内存，同时运行4个Docker容器并启动Hadoop、Zookeeper、HBase服务时，服务器内存不足，导致内存分配失败。

- 解决方法
重新开通配置更高的服务器（8 vCPUs和16GB内存），然后进行服务器配置和服务运行。

---

# Bug 6：使用传统方法配置时，Zookeeper服务启动失败

- 问题描述
使用传统方法配置时，Zookeeper服务启动失败，显示“FAILED TO START”。

- 问题原因
检查Zookeeper版本后发现下载的是未编译的jar包。从3.5版本开始，Zookeeper的命名方式发生了变化。像 `apache-zookeeper-3.5.5.tar.gz` 这样的命名方式表示未编译的包，而 `apache-zookeeper-3.5.5-bin.tar.gz` 才是已编译的包。未编译的包会导致运行时找不到相应的类。

- 解决方法
重新下载已编译的 `apache-zookeeper-3.5.5-bin.tar.gz` 安装包，重新配置并运行。

---

# Bug 7：检查Zookeeper状态时出现Client SSL: false错误

- 问题描述
成功解决Bug 6后，输入 `zkServer.sh status` 出现“`Client SSL: false`”错误。

- 问题原因
Zookeeper的 `workers` 文件中没有写入工作的服务器名称。

- 解决方法
在Zookeeper的 `workers` 文件中添加以下服务器名称：

```bash
localhost
zzh-2021213165-0002
zzh-2021213165-0003
zzh-2021213165-0004
```

- 衍生问题：为什么不写入本机名称，而是写入 `localhost` 地址？
这涉及到单节点配置和集群配置的区别。如果HBase被配置为单节点模式，那么所有组件（Master、RegionServer等）都运行在同一台机器上，此时可以在 `regionservers` 文件中包含本机地址。但在生产环境中的HBase集群配置中，每个RegionServer通常运行在独立的机器上， `regionservers` 文件应列出所有运行RegionServer的节点地址。

**角色分离**:
在集群配置中，本机可能只运行HBase Master角色，而不运行RegionServer。Master负责管理和协调RegionServer，但不处理数据读写请求。通过不将本机地址写入 `regionservers` 文件，可以明确区分Master和RegionServer的角色，并确保每个节点专注于其特定功能。

---

# Bug 8：运行HBase时出现Java找不到错误

- 问题描述
最主要的问题是找不到Java可执行文件。HBase依赖于Java运行时环境，但配置中的Java路径 `/usr/local/jdk8u40-b06/bin/java` 不存在。

- 问题原因
教学云平台提供的配置代码的Java版本与我们下载的不一致，如果直接加入环境变量中就会导致报错。

- 解决方法
将Java版本改为我们下载的版本即可。

---

# Bug 9：启动HBase后创建表格时出现报错

- 问题描述
启动HBase后，创建表格时出现报错，显示“`Server is not running yet`”。

- 问题原因
默认情况下，HBase可能使用不同的WAL提供者（如asyncfs或filesystem）来处理写日志。在某些情况下，使用默认的WAL提供者可能会导致兼容性或稳定性问题，特别是在特定的环境配置或版本下。

- 解决方法
通过显式设置 `hbase.wal.provider` 为 `filesystem`，指定HBase使用文件系统作为WAL的存储和管理方式。这种配置通常更为稳定和兼容，尤其是在不同版本的Hadoop和HBase之间。修改 `hbase-site.xml` 配置文件，增加如下内容，并重启HBase：

```xml
<property>
  <name>hbase.wal.provider</name>
  <value>filesystem</value>
</property>
```

---

# Bug 10：运行jar包时出现地址错误

- 问题描述
运行jar包时，显示试图访问的文件系统路径与期望的文件系统路径不匹配。具体来说，正在尝试访问 `hdfs://master:802

0`，而期望的文件系统地址是 `hdfs://192.168.0.92:8020`。

- 问题原因
jar包的主类配置文件与Docker容器方法和传统方法不同。Docker容器方法的主节点配置名称为 `master`，而传统方法的主节点名称为第一台服务器的地址。

- 解决方法
在jar包主类配置文件中，将地址改为传统方法的正确地址。

---
