# buptxinghan.github.io

这个仓库已经开始迁移为 `Hexo 源码仓库 + GitHub Actions 自动发布`。

## 目录说明

- `source/`: 文章、页面、图片等博客源码
- `themes/hexo-theme-matery/`: 当前默认主题
- `_config.yml`: Hexo 全局配置
- `_config.hexo-theme-matery.yml`: 主题覆盖配置
- `.github/workflows/pages.yml`: GitHub Pages 自动构建发布流程

## 本地开发

先安装 Node.js 20 及以上版本，然后执行：

```bash
npm install
npm run server
```

默认预览地址是 `http://localhost:4000`。

## 常用命令

```bash
npm run server
npm run build
npm run clean
```

## 新增内容

新文章：

```bash
npx hexo new post "文章标题"
```

新页面：

```bash
npx hexo new page "about"
npx hexo new page "friends"
```

## 发布方式

1. GitHub Pages 的 `Source` 选择 `GitHub Actions`
2. 将本仓库的 `main` 分支推到 GitHub
3. GitHub Actions 会自动生成 `public/` 并发布到 Pages

## 主题怎么选

- 想保留现在这种 Material Design 风格：继续用 `Matery`
- 想更简洁、偏技术博客：可以考虑 `NexT`
- 想更花一点、动画和组件更多：可以考虑 `Butterfly`

先把源码仓库稳定下来最重要，之后换主题会比现在容易很多。
