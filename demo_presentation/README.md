# 演示版本 Demo

本演示用于展示 LifeMap 项目关键界面与交互。

- 中间：手机框展示 H5 小程序（通过 iframe 加载）
- 左右：功能介绍与导航按钮

## 启动
1. 启动 H5：在 Doudou 目录运行 `npm run dev:h5`
2. 打开本演示：用浏览器打开 `demo_presentation/index.html`

## 配置 iframe 源
- 默认：`http://localhost:5174/`（vite自动端口）
- 如端口不同，可修改 `index.html` 中 `DEMO_APP_URL`。
