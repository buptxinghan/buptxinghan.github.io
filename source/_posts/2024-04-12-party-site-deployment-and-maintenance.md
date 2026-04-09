---
title: 支部网站部署与维护教程
date: 2024-04-12 00:00:00
updated: 2024-04-12 00:00:00
author: Xing Han
categories:
  - 服务器运维
tags:
  - 服务器运维
description: 在CentOS 7.6上安装Python、Git、配置服务器环境以及使用Gunicorn和Nginx部署并设置智慧党建系统为开机自启动的完整步骤。
home_cover: /medias/featureimages/0.jpg
post_cover: /medias/banner/0.jpg
---
# 一、环境配置：

## (1) 系统要求：
- CentOS 7.6

## (2) 安装Python

1. 检查当前Python版本：
   ```bash
   python --version
   ```

2. 如果需要安装Python 3，可以使用包管理器安装。例如，在CentOS上：
   ```bash
   sudo yum install python3
   ```

3. 安装完成后，检查Python 3版本：
   ```bash
   python3 --version
   ```

## (3) 安装Git

1. 使用包管理器安装Git在CentOS上：
   ```bash
   sudo yum install git
   ```

2. 安装完成后，设置Git的全局配置信息：
   ```bash
   git config --global user.name "用户名"
   ```

   ```bash
   git config --global user.email "邮箱"
   ```

3. 初次使用SSH协议进行代码克隆、推送等操作时，需按下述提示完成SSH配置：
   
   3.1 生成RSA密钥：
   ```bash
   ssh-keygen -t rsa
   ```
   
   3.2 获取RSA公钥内容，并配置到SSH公钥中：
   ```bash
   cat ~/.ssh/id_rsa.pub
   ```

---

# 二、项目拉取

## (1) 文件夹创建
- 在home目录中创建文件夹DJ

```bash
cd home
mkdir DJ
```

## (2) 克隆仓库
- 在DJ文件夹中创建Git仓库，并从gitee中克隆

```bash
cd DJ
git init
git clone git@gitee.com:mindstorm233/intelli-party-affair.git
```

---

# 三、项目配置

- 进入项目目录，下载依赖包，修改IP地址并运行

```bash
pip3 install flask flask_cors python-docx
cd templates/
```

- 不确定如何修改IP地址，最后通过WinSCP软件进行修改。

在项目目录下运行：
```bash
nohup python3 app.py > app.log 2>&1 &
```

---

# 四、修改服务器安全组

- 在服务器安全组中打开5000端口。

---

# 五、gunicorn与nginx配置

- 安装gunicorn：
```bash
pip3 install gunicorn
```

- 安装nginx：
```bash
yum install nginx
```

- 在`/etc/nginx/nginx.conf`文件中修改内容为：

```nginx
# /etc/nginx/nginx.conf

user root;
worker_processes auto;
error_log /var/log/nginx/error.log;
pid /run/nginx.pid;

events {
    worker_connections 1024;
}

http {
    log_format main '$remote_addr - $remote_user [$time_local] "$request" '
                    '$status $body_bytes_sent "$http_referer" '
                    '"$http_user_agent" "$http_x_forwarded_for"';
    access_log /var/log/nginx/access.log main;

    sendfile on;
    tcp_nopush on;
    tcp_nodelay on;
    keepalive_timeout 65;
    types_hash_max_size 4096;

    include /etc/nginx/mime.types;
    default_type application/octet-stream;

    include /etc/nginx/conf.d/*.conf;
}
```

- 在`/etc/nginx/conf.d`目录下新建`DJ.conf`并写入以下内容：

```nginx
server {
    charset utf-8;
    listen 80;
    server_name _;

    location / {
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_pass http://127.0.0.1:5000;
    }

    error_page 404 /404.html;
    location = /404.html {
        root /usr/share/nginx/html;
    }

    error_page 500 502 503 504 /50x.html;
    location = /50x.html {
        root /usr/share/nginx/html;
    }
}
```

- 检查nginx配置文件语法是否正确：
```bash
sudo nginx -t
```

- 重启nginx可以使用命令：
```bash
sudo systemctl restart nginx
```

---

# 六、开启步骤

```bash
cd /home/DJ/intelli-party-affair
nohup gunicorn -w 2 -b :5000 app:app &
sudo systemctl start nginx
```

即可直接通过主机IP访问智慧党建系统。

---

# 七、设置开机自启动

- 编辑`DJapp.service`文件：
```bash
sudo vim /etc/systemd/system/DJapp.service
```

- 添加以下内容到文件中：

```ini
[Unit]
Description=DJ App Service
After=network.target

[Service]
User=root
Group=root
WorkingDirectory=/home/DJ/intelli-party-affair
ExecStart=/usr/local/bin/gunicorn -w 2 -b :5000 app:app
ExecStartPost=/usr/sbin/systemctl start nginx
Restart=always

[Install]
WantedBy=multi-user.target
```

- 保存并执行以下命令：

```bash
sudo systemctl daemon-reload
sudo systemctl start DJapp.service
sudo systemctl enable DJapp.service
```
