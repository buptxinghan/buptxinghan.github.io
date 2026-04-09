---
title: Spark部署教程
date: 2024-06-02 00:00:00
updated: 2024-06-02 00:00:00
author: Xing Han
categories:
  - 大数据技术
tags:
  - 大数据技术
description: Spark部署问题与解决方案汇总。
home_cover: /medias/featureimages/4.jpg
post_cover: /medias/banner/4.jpg
---
# Bug1：配置Spark环境变量时发现配置文件是空的

**问题描述**  
在配置Spark环境变量时，文档要求我们使用`vim`编辑`root`目录下的`.bash_profile`文件，但打开文件后发现文件是空的，这与我们之前配置环境变量的`/etc/profile`文件不一样。

**问题原因**  
首先，我们应该知道，这个配置文件是在根目录`~`下的，如果在其他路径使用`vim .bash_profile`，当然会是一个新的空文件。此外，这个问题涉及到不同配置文件的区别。Linux系统中的配置文件包括`/etc/profile`、`~/.bash_profile`、`~/.bashrc`、`/etc/bashrc`或`/etc/bash.bashrc`、`~/.profile`、`/etc/environment`、`~/.bash_logout`等。

**解决方法**  
使用`cd`命令进入根目录，再输入`vim .bash_profile`，或者直接使用`vim ~/.bash_profile`。此外，根据配置文件的作用，我们可以选择将环境变量配置在用户的`.bash_profile`文件中，而不是系统全局的`/etc/profile`文件中。

---

# Bug2：运行第一个jar包时报错

**问题描述**  
运行 Spark 提交命令时遇到了错误`Error: Failed to load class org.example.ScalawordCount.`，即在提交任务时未能加载`org.example.ScalawordCount`类，导致任务失败。

**问题原因**  
包中的主类设置错误。在第一次打包时，使用的是助教提供的IDEA工程中的已有jar包设置，可能未将`ScalawordCount`设置为主类。

**解决方法**  
在IDEA中重新配置jar包并将`ScalawordCount`设置为主类。

---

# Bug3：Spark提交任务时，显示未识别的选项

**问题描述**  
Spark提交任务时，由于未识别的选项`--executor-`，导致命令解析失败，无法继续执行任务。

**问题原因**  
从PDF教程上复制的命令有可能出现空格遗漏或多余的情况。经过分析，发现问题出在命令中的`--executor- cores 1`，其中`executor-`后多了一个空格。

**解决方法**  
输入正确的命令：`spark-submit --class org.example.ScalaWordCount --master yarn --num-executors 3 --driver-memory 1g --executor-memory 1g --executor-cores 1 spark-test.jar`。

---

# Bug4：提交 Spark 应用程序到 YARN 时失败

**问题描述**  
提交 Spark 应用程序到 YARN 时失败，具体错误为`root is not a leaf queue`。

**问题原因**  
YARN配置中指定的队列`root`不是叶子队列。只有叶子队列才能接受任务，非叶子队列（通常是父队列）用于组织和管理子队列。

**解决方法**  
修改`capacity-scheduler.xml`和`mapred-site.xml`配置文件。最后，使用`spark-submit --class org.example.ScalaWordCount --master yarn --deploy-mode cluster --queue spa --num-executors 3 --driver-memory 1g --executor-memory 1g --executor-cores 1 spark-test.jar`指定队列进行运行。

---

# Bug5：RDD编程运行后显示错误码 13

**问题描述**  
在RDD编程步骤中，Spark 作业在运行时出现了`Container exited with a non-zero exit code 13. Error file: prelaunch.err`，错误栈中显示与`RDDOperationScope.scala`和`PairRDDFunctions.scala`有关。

**问题原因**  
错误码 13 通常表示某种权限问题或其他系统级别的错误。发现问题是由于我们使用了`local`模式，而我们是使用集群模式构建Spark的。

**解决方法**  
将`ScalaDuplicateRemove`类中的`Local`改为`yarn`。

---

# Bug6：Hadoop输出已存在

**问题描述**  
解决之前的bug后再次运行Spark任务，显示Hadoop输出已存在的报错。

**问题原因**  
之前运行时的输出已经存入了Hadoop文件系统中，再次运行时会显示输出已存在的报错。

**解决方法**  
移除之前的输出文件。使用`hdfs dfs -rm -r /user/root/C`命令删除旧输出文件后，成功运行。

---

# Bug7：MySQL安装问题

## 问题1：MySQL下载命令不同

**问题描述**  
由于教程中使用的是Ubuntu系统，而我们使用的是CentOS系统，下载MySQL时命令不同。

**解决方法**  
在CentOS中使用以下命令安装MySQL：
```bash
sudo yum install -y https://dev.mysql.com/get/mysql80-community-release-el7-3.noarch.rpm
sudo yum install -y mysql-community-server
```

## 问题2：MySQL下载慢

**问题描述**  
MySQL下载速度较慢。

**解决方法**  
更换yum源为国内源，从清华源或阿里源下载MySQL。

## 问题3：MySQL下载密钥不适用

**问题描述**  
下载MySQL时显示密钥不适用。

**解决方法**  
使用命令`sudo rpm --import https://repo.mysql.com/RPM-GPG-KEY-mysql-2023`导入新版密钥，然后重新下载MySQL。

## 问题4：MySQL默认密码问题

**问题描述**  
教程中提到MySQL的默认密码是root，但实际情况并非如此。

**解决方法**  
使用以下命令获取MySQL默认root密码：
```bash
sudo grep 'temporary password' /var/log/mysqld.log
```
使用默认密码登录后，运行`mysql_secure_installation`命令修改root密码。

## 问题5：代码中MySQL密码错误

**问题描述**  
由于默认密码不是root，导致代码中的密码需要更改，否则会报错。

**解决方法**  
将代码中的`password`字段从`root`改为实际设置的密码。

---
