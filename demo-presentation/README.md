# LifeMap 演示发布页

此目录用于制作对外演示的单页站点，采用上下滚动布局：中间为手机模型内嵌 H5 小程序，左右为功能介绍。

## 运行方式

直接用任意静态服务器打开本目录：

- VSCode Live Server / `npx serve` / `python3 -m http.server`
- 也可直接用浏览器打开 `index.html`

## 预览源地址

`index.html` 中的 `<iframe>` 默认指向本地 H5 开发服务：

- `http://localhost:5174/#/pages/life-journey/life-journey`
- `http://localhost:5174/#/pages/friends/friends`
- `http://localhost:5174/#/pages/knowledge/knowledge`

如需部署线上，请将以上地址替换为线上 H5 地址（支持 hash 路由）。

## 结构

- `index.html` 页面骨架与滚动章节
- `styles.css` 样式、手机模型、Reveal 动画
- `main.js` 进入视口 Reveal 控制
- `assets/` 静态资源（如需）

## 自定义

- 新增章节：复制 `.section` 结构，替换两侧文案与 iframe 链接
- 手机尺寸：在 `styles.css` 中调整 `.device` 宽高与圆角
- 动画：调整 `.reveal` 与 `visible` 的过渡效果
