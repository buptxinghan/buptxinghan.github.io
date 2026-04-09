---
title: Hadoop部署教程
date: 2024-04-13 00:00:00
updated: 2024-04-13 00:00:00
author: Xing Han
categories:
  - 大数据技术
tags:
  - 大数据技术
description: Hadoop部署问题与解决方案汇总。
home_cover: /medias/featureimages/1.jpg
post_cover: /medias/banner/1.jpg
---
# I. Bug 1: 无法解压 Hadoop 文件

**问题描述：**
- 无法解压 Hadoop 文件。

**问题原因：**
- 解压 Hadoop 文件需要管理员权限。

**解决方法：**
- 以管理员身份运行 `cmd`，进入 Hadoop 压缩文件所在目录后，执行以下命令解压文件：

  ```bash
  tar zxvf hadoop-3.3.6.tar.gz
  ```

---

# II. Bug 2: 服务器 Java 版本显示不正确

**问题描述：**
- 我们安装的 Java 版本是 `jdk8u402-b06`，但在执行 `java -version` 时，显示的是服务器原来自带的 Java 版本，而不是我们最新安装的版本。实验教程中的版本也显示错误（教程中下载的版本是 `292-b10`，但配置完后显示的是 `232-b09`）。

**解决方法：**
- 除了在 `/etc/profile` 中按教程要求添加以下配置：

  ```bash
  export JAVA_HOME=/usr/lib/jvm/jdk8u402-b06
  ```

  还需额外添加以下三行配置：

  ```bash
  export JRE_HOME=${JAVA_HOME}/jre
  export CLASSPATH=.:${JAVA_HOME}/lib:${JRE_HOME}/lib
  export PATH=${JAVA_HOME}/bin:$PATH
  ```

  然后输入 `java -version`，Java 版本应该显示正确。

---

# III. Bug 3: 无法将 Hadoop 复制到 home 文件夹

**问题描述：**
- 教程要求我们使用以下命令将 Hadoop 文件复制到 `/home/modules` 目录，但执行时出现错误（此处用 `modulestest` 目录作为演示，因为 `modules` 目录已经存在）。

  ```bash
  cp -r Hadoop-3.3.6 /home/modules
  ```

**原因：**
- `/home` 目录下原本没有 `modules` 文件夹，因此需要先创建该文件夹。

**解决方法：**
- 先在 `/home` 目录下输入以下命令创建 `modules` 目录，再使用复制命令：

  ```bash
  mkdir /home/modules
  ```

---

# IV. Bug 4: Hadoop 版本问题

**问题描述：**
- 教程中的 Hadoop 版本与我们下载的版本不同，因此在输入命令、配置服务器、开放安全组端口、网上搜索教程时，需要特别注意 Hadoop 的版本问题。以下是由于 Hadoop 版本错误导致的问题。

**解决方法：**
- 仔细核对 Hadoop 版本，将教程中的版本号替换为自己下载的版本号。

**版本问题导致的端口号变动：**

- 教程使用的是 Hadoop 2.x 版本，而我们使用的是 3.x 版本。由于两种版本的 Hadoop 使用的端口号不同，这也导致了许多问题，如无法登录 Hadoop 的 Web 端口等。

**2.x 与 3.x 版本端口号对比：**

| 2.x 端口 | 3.x 端口 | 名称                          | 描述                                          |
| -------- | -------- | ----------------------------- | --------------------------------------------- |
| 50470    | 9871     | `dfs.namenode.https-address`  | namenode 安全 http 服务器地址和端口。          |
| 50070    | 9870     | `dfs.namenode.http-address`   | namenode Web UI 地址和端口。                   |
| 8020     | 9820     | `fs.defaultFS`                | 指定 HDFS 运行时 nameNode 地址。              |
| 50020    | 9867     | `dfs.datanode.ipc.address`    | datanode IPC 服务器地址和端口。               |
| 50010    | 9866     | `dfs.datanode.address`        | datanode 数据传输服务器地址和端口。           |
| 50475    | 9865     | `dfs.datanode.https-address`  | datanode 安全 http 服务器地址和端口。         |
| 50075    | 9864     | `dfs.datanode.http-address`   | datanode http 服务器地址和端口。              |

---

# V. Bug 5: 安装 Hadoop 后无法启动服务

**问题描述：**
- 使用 `start-all.sh` 命令启动 Hadoop 服务时，显示 "root 用户无权限"、"yarn 用户和 hdfs 用户不存在" 等问题。

**解决方法：**
- 在 `/etc/profile` 中加入以下配置：

  ```bash
  export HDFS_NAMENODE_USER=root
  export HDFS_DATANODE_USER=root
  export HDFS_SECONDARYNAMENODE_USER=root
  export YARN_RESOURCEMANAGER_USER=root
  export YARN_NODEMANAGER_USER=root
  ```

  然后检查日志文件，发现问题并修复，例如将 `core-site.xml` 文件中的主机名改为主机的内网 IP 地址，这样就可以解决服务启动不了的问题。

---

# VI. Bug 6: Hadoop 服务启动后不正常工作

**问题描述：**
- 在解决上一个 Bug 之后，Hadoop 服务显示启动正常，但输入 `jps` 命令时却不显示相关服务，说明相关服务并未正常工作。

**原因：**
- 在从教程上下载的教程中，要求设置服务器的主机名为 `zzh_2021213165` 格式，但该主机名包含了非法字符（如 `.`、`/`、`_`），这在 Hadoop 中是非法的。

**解决方法：**
- 重新配置服务器，将主机名设置为合法名称，例如 `zzh-2021213165`。

---

# VII. Bug 7: slaves 文件不存在

**问题描述：**
- 在重新配置服务器过程中，教程要求我们配置 `slaves` 文件，但输入 `vim` 命令后，显示文件为空（没有末尾的 `~`），说明该文件在 Hadoop 文件中不存在。通过 WinSCP 查看服务器文件，确实找不到 `slaves` 文件。

**原因：**
- 出于西方国家的政治正确原因，Hadoop 3.x 版本中将 `slaves` 文件名称改为了更加中性的 `workers`，这类似于 GitHub 将 `master` 分支改为 `main` 分支，为广大技术人员造成了许多不必要的困扰。

**解决方法：**
- 将命令改为 `vim /home/modules/Hadoop-3.3.6/etc/Hadoop/workers` 即可解决。在修复完上述 Bug 后，终于成功运行了 Hadoop 服务。

---

# VIII. Bug 8: 修改 8020 监听地址失败

**问题描述：**
- 注释掉 `hosts` 文件中所有以 127 开头的 IP 地址并添加所有服务器的 IP 后，使用 `netstat -ltpn` 命令依然显示 127 开头的地址。

**解决方法：**
- 将主节点中的 `core-site.xml` 文件中的 `fs.defaultFS` 改成节点私网 IP:8020，即可解决问题。

---

# IX. Bug 9: 浏览器无法打开服务器 Web 端口且电脑无法 ping 通服务器

**问题描述：**
- 浏览器无法打开服务器 Web 端口，且电脑无法 ping 通服务器。

**原因：**
- Hadoop 3.x 版本对应的工作端口在服务器安全组中未开放，或服务器/本地防火墙未关闭。

**解决方法：**
- 关闭服务器和本地防火墙，在服务器安全组中加入以下 TCP 协议端口：9871、9870、9820、9867、9866、9865、9864，并将优先级设置为 1 即可。

---

# X. Bug 10: Hadoop 主机域名配置和解析问题

**问题描述：**
- 教程中要求配置服务器 `hosts` 文件和本地 `hosts` 文件时，指导内容含糊不清，容易混淆，导致许多报错。

**解决方法：**
- `hosts` 文件的格式为 `ip + 主机名 + 别名`，因此只需将四台服务器的 `IP + 主机名 + 别名`写入每个服务器（填写服务器的内网 IP）和本地主机（填写服务器的公网 IP）的 `hosts` 文件中。

---

# XI. Bug 11: 多次使用 `hdfs namenode -format` 命令导致报错

**问题描述：**
- 在配置 Hadoop 服务时，`hdfs namenode -format` 命令只需运行一次，多次运行会导致 `namenode` 的 `clusterID` 重新生成，而 `datanode` 的 `clusterID` 保持不变，从而产生问题。

**解决方法：**
- 需要重新运行 `hdfs namenode -format` 命令时，需删除每个服务器中的 Hadoop 文件中的 `tmp` 文件夹内的所有内容，这是一个缓存文件。删除缓存后，重新生成即可同步四个服务器的 `clusterID`。

---

# XII. Bug 12: 运行 Java 代码时产生报错

**问题描述：**
- 运行java时出现报错
`org.apache.hadoop.ipc.RemoteException(java.io.IOException): File /upload_2021213165.txt could only be written to 0 of the 1 minReplication nodes. There are 3 datanode(s) running and 3 node(s) are excluded in this operation.`

**问题分析：**
- 这个报错在我们组内复现率很高，它可能由于多种原因导致，首先应该检查是否能正常访问hadoop 的`WEB`端并查看能否在web端上传或者下载文件，如果不能，那有可能是hosts文件配置错误或者`core-site.xml`、`hdfs-site.xml`或`yarm-site.xml`文件配置错误或防火墙没关闭或者对应端口没打开。如果网页端能正常上传下载文件，那么说明`WEB`端口可以正常使用，有可能是`Namenode`和`Datanode`的通信端口没打开。

**解决方法：**
1. `hosts`文件的撰写格式为`ip + 主机名 + 别名`，因此我们只需要把四台服务器的`ip + 主机名 + 别名`写入每个服务器（写服务器的内网ip）和本地主机（写服务器的公网ip）的`hosts`文件即可。
2. 关闭服务器和本机防火墙（可用ping检查是否能连接）
3. 检查hadoop的几个配置文件。
4. 在服务器安全组中打开`TCP:9866、9867`端口并把优先级设置为`1`。

---

# XIII. Bug13 重启服务器后运行hadoop时出现集群断连问题

**问题描述：**
- 重启服务器后运行hadoop时主节点和从节点通信出现问题，运行java代码也会出现报错。
`java.net.ConnectException: Call From REVERLUTION/10.29.250.30 to zzh-2021213165-0001:8020 failed on connection exception: java.net.ConnectException: Connection refused: no further information; For more details see:  http://wiki.apache.org/hadoop/ConnectionRefused  at java.base/jdk.internal.reflect.DirectConstructorHandleAccessor.newInstance(DirectConstructorHandleAccessor.java:67)`

**问题原因：**
- 出现问题的原因是每次重启服务器，系统都会在`hosts`文件中自动加入`127.0.0.1 + 主机名 + 主机名`。

**解决方法：**
- 我们每次重启服务器都需要手动在`hosts`文件中删除`127.0.0.1 + 主机名 + 主机名`这一行，四个节点都需要进行此步骤。删除后重启hadoop服务即可。
