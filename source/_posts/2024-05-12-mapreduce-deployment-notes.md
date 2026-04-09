---
title: MapReduce部署教程
date: 2024-05-12 00:00:00
updated: 2024-05-12 00:00:00
author: Xing Han
categories:
  - 大数据技术
tags:
  - 大数据技术
description: MapReduce部署问题与解决方案汇总。
home_cover: /medias/featureimages/2.jpg
post_cover: /medias/banner/2.jpg
---
# Bug1: 创建Hadoop目录时显示连接失败

- 问题描述
在服务器重启后使用Hadoop时，出现连接失败、主服务器与从服务器集群断联等问题。

- 问题原因
每次重启服务器时，系统会在 `/etc/hosts` 文件中自动添加 `127.0.0.1 主机名 主机名`。如果在启动Hadoop服务前没有启动Hadoop服务，就会出现这种报错。

- 解决方法
每次重启服务器后，手动在 `/etc/hosts` 文件中删除 `127.0.0.1 主机名 主机名` 这一行。这个步骤需要在所有四个节点上执行。删除后重启Hadoop服务即可成功创建Hadoop文件。

---

# Bug2: 服务器重启后 `hosts` 文件自动添加主机名解析

- 问题描述
每次重启服务器时，系统都会在 `/etc/hosts` 文件中自动添加 `127.0.0.1 主机名 主机名` 这一主机名解析，导致每次开机后需要手动删除这一主机名解析，否则会导致集群断联问题。这是第一个Bug的根源。

- 问题原因
`/etc/cloud/cloud.cfg` 中对 `/etc/hosts` 文件的配置如下：
```bash
manage_etc_hosts: localhost
```
此配置会自动生成hostname和本地回环地址的解析，每次开机时自动添加localhost。

- 解决方法
如果不想每次重启服务器都手动删除这一行，可以将上述配置注释掉。

---

# Bug3: 指令错误问题

- 问题描述
按照教程中输入 `hdfs fs` 指令显示命令不正确。

- 解决方法
将 `hdfs fs` 指令改为 `hdfs dfs` 命令即可成功运行。

---

# Bug4: 运行Java程序包 `jar` 时出现类错误

- 问题描述
运行Java程序包 `jar` 中的 `WordCount` 时出现类错误，找不到类。

- 问题原因
可能是因为在编写代码时对类命名时大小写不一致。这里的 `wordcount` 应该与自己的代码命名相同。

- 解决方法
将类名 `wordcount` 改为 `WordCount` 以匹配代码中的类名。

---

# Bug5: 运行Java程序包 `jar` 时出现路径错误

- 问题描述
运行Java程序包 `jar` 中的 `WordCount` 时出现路径错误，显示输入路径不存在。

- 问题原因
路径是Hadoop文件系统中的路径，而不是服务器的本地目录。因此，应该将需要读取的文件放在Hadoop文件系统的对应目录中。

- 解决方法
将 `2021213165-zzh.txt` 文件上传到Hadoop文件系统中的对应目录下即可。

---

# Bug6: 任务提交到YARN的队列时出现报错

- 问题描述
将作业提交到YARN（Yet Another Resource Negotiator）时发生了错误，显示尝试提交到的root队列不是一个叶子队列。

- 问题原因
在Hadoop YARN中，队列有层次结构，其中“叶子队列”是可以接受作业提交的队列。如果尝试将作业提交到一个父队列（非叶子队列），就会收到此错误。此时 `root` 仅为父队列，没有子队列。

如果使用 `root.default` 队列也是一样，虽然没有上面的报错，但无法运行程序并得到结果。默认情况下，Hadoop将作业提交到 `root.default` 队列，但如果集群设定了其他队列来处理作业，提交到 `root.default` 队列的任务将被打回。

- 解决方法

  - 方法一（会造成Bug7，建议使用方法二）
  在 `yarn-site.xml` 中添加以下配置，选择默认容量调度器：
  ```xml
  <property>
      <description>The class to use as the resource scheduler.</description>
      <name>yarn.resourceranager.scheduler.class</name>
      <value>org.apache.hadoop.yarn.server.resourcemanager.scheduler.capacity.CapacityScheduler</value>
  </property>
  ```

  - 方法二
  在 `capacity-scheduler.xml` 配置文件中添加以下指令，新建一个叶子队列 `mpr` 用于Mapreduce的计算，设置容量为10，最大容量为20：
  ```xml
  <property>
      <name>capacity-scheduler.queue.mpr.capacity</name>
      <value>10</value>
  </property>
  <property>
      <name>capacity-scheduler.queue.mpr.maximum-capacity</name>
      <value>20</value>
  </property>
  ```
  此外，在 `mapred-site.xml` 中添加以下声明，使Mapreduce工作在 `mpr` 叶子队列中：
  ```xml
  <property>
      <name>mapreduce.job.queuename</name>
      <value>default,mpr</value>
  </property>
  ```
  即可解决。

---

# Bug7: Hadoop的ResourceManager服务失效

- 问题描述
在使用Bug6的方法一后重启Hadoop服务，输入 `jps` 命令发现ResourceManager服务消失。

- 解决方法
取消使用方法一，将 `yarn-site.xml` 中的 `scheduler.capacity.CapacityScheduler` 配置修改为 `scheduler.fair.FairScheduler`，并使用方法二进行配置。

---

# Bug8: Hadoop处于安全模式

- 问题描述
重启Hadoop服务后立马运行Mapreduce出现报错，HDFS只允许读操作不允许写操作。

- 问题原因
Hadoop刚启动时需要一段时间与子节点同步数据，在这段时间中，Hadoop NameNode处于安全模式。在安全模式下，HDFS只允许读操作，不允许写操作。

- 解决方法
重启Hadoop服务或者直接等待一小会，Hadoop同步完成后会自动退出安全模式。
