---
title: 从旧静态站切到 Hexo Keep
date: 2023-06-24 20:07:45
author: Xing Han
categories:
  - Notes
tags:
  - Hexo
  - Keep
home_cover: /medias/featureimages/8.jpg
post_cover: /medias/banner/1.jpg
---

这篇文章是新的起点。

之前这个仓库直接保存生成后的静态文件，现在已经切换成真正的 Hexo 源码仓库，并换上了更简洁的 Keep 主题。接下来会继续慢慢把内容、页面和风格都整理得更顺眼一些。

## 现在的工作方式

### 写新文章

```bash
npx hexo new post "My New Post"
```

### 本地预览

```bash
npm run server
```

### 生成静态文件

```bash
npm run build
```

### 发布方式

推送 `main` 分支之后，GitHub Pages 会通过 Actions 自动构建并发布 `public/`。
