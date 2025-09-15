# 六边形地图应用

基于 Next.js + React + Tailwind CSS 实现的六边形网格地图组件。

## 功能特性

- 全屏显示六边形网格地图
- 12x10 的六边形网格布局
- 浅灰色背景和灰色边框的六边形
- 主角标记（蓝色圆点 + "我" 文字）
- 目标标记（红色圆点）
- 响应式设计，适配不同屏幕尺寸

## 技术栈

- Next.js 14
- React 18
- TypeScript
- Tailwind CSS

## 快速开始

1. 安装依赖：
```bash
npm install
```

2. 启动开发服务器：
```bash
npm run dev
```

3. 在浏览器中访问 [http://localhost:3000](http://localhost:3000)

## 项目结构

```
hex-map-app/
├── app/
│   ├── HexMap.tsx      # 六边形地图组件
│   ├── page.tsx        # 主页面
│   ├── layout.tsx      # 布局组件
│   └── globals.css     # 全局样式
├── package.json
├── tailwind.config.js
├── tsconfig.json
└── README.md
```

## 组件说明

### HexMap 组件

- 使用 SVG 渲染六边形网格
- 六边形边长：40px
- 网格尺寸：12列 x 10行
- 支持自定义样式类名

### 标记位置

- 主角位置：第3行第4列
- 目标位置：第7行第8列

可以通过修改 `HexMap.tsx` 中的 `playerPosition` 和 `targetPosition` 来调整标记位置。
