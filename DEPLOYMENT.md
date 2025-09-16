# 🚀 Netlify 部署指南

本项目提供两种部署选项到 Netlify：

## 📱 选项1：主应用部署（推荐）

部署 uni-app 的 H5 版本，包含完整的应用功能。

### 部署步骤：

1. **连接 GitHub 仓库**
   - 登录 [Netlify](https://netlify.com)
   - 点击 "New site from Git"
   - 选择你的 GitHub 仓库

2. **配置构建设置**
   ```
   Base directory: Doudou
   Build command: npm run build:h5  
   Publish directory: Doudou/dist/build/h5
   ```

3. **环境变量设置**
   ```
   NODE_VERSION=18
   ```

4. **部署**
   - 点击 "Deploy site"
   - Netlify 会自动使用根目录的 `netlify.toml` 配置

### ✅ 已包含功能：
- 📊 用户信息收集问卷
- 🗺️ 职场成长地图
- 👥 好友系统
- 📚 知识库
- 🤖 AI 聊天与创作
- 📈 成长报告
- 🎯 任务管理

---

## 🖥️ 选项2：演示页面部署

部署静态演示页面，用于项目展示。

### 部署步骤：

1. **手动部署**
   - 登录 Netlify
   - 拖拽 `demo-presentation` 文件夹到 Netlify

2. **或者使用配置文件**
   - 重命名 `netlify-demo.toml` 为 `netlify.toml`
   - 推送到 GitHub 并连接仓库

### ✅ 包含内容：
- 🎨 项目介绍与背景
- 📸 功能截图展示
- 💼 商业模式说明
- 🔧 技术方案介绍

---

## 🔧 部署后配置

### API 配置（主应用）
如果需要连接后端API，在 Netlify 部署后：

1. 进入 Site settings > Environment variables
2. 添加以下环境变量：
   ```
   API_BASE_URL=https://your-api-domain.com/api
   ```

### 自定义域名
1. 在 Netlify 控制台进入 "Domain settings"
2. 添加自定义域名
3. 配置 DNS 记录

### HTTPS 配置
- Netlify 自动提供 Let's Encrypt SSL 证书
- 确保在 "HTTPS" 设置中启用 "Force HTTPS"

---

## 🐛 常见问题

### 构建失败
- 确保 Node.js 版本为 18
- 检查 `package.json` 中的依赖版本
- 查看构建日志中的具体错误信息

### 图片资源未加载
- 检查图片路径是否正确（使用相对路径）
- 确保图片文件在 `src/static` 目录中

### 路由问题
- SPA 应用需要配置重定向（已在 `netlify.toml` 中配置）
- 确保使用 Vue Router 的 history 模式

---

## 📊 性能优化

### 已配置优化：
- ✅ 静态资源缓存（1年）
- ✅ 代码压缩和分割
- ✅ 图片优化
- ✅ 安全头部设置

### 建议优化：
- 🔄 开启 Netlify CDN
- 📦 使用 Netlify Functions 处理后端逻辑
- 🎯 配置预渲染提升 SEO

---

## 📝 更新部署

### 自动部署：
- 推送代码到 GitHub
- Netlify 自动触发构建和部署

### 手动部署：
```bash
# 本地构建
cd Doudou
npm run build:h5

# 上传 dist/build/h5 文件夹到 Netlify
```

---

## 🔗 相关链接

- [Netlify 文档](https://docs.netlify.com/)
- [uni-app 文档](https://uniapp.dcloud.io/)
- [Vue.js 文档](https://vuejs.org/)

---

## 💡 提示

- 首次部署建议使用演示页面测试
- 主应用部署成功后可以考虑配置自定义域名
- 定期检查 Netlify 的使用量避免超出免费额度
