# LifeMap 职场成长助手 - API接口文档

## 项目概述
LifeMap 是一个职场成长助手应用，包含用户管理、AI聊天、个性化测评、任务系统、成长地图等功能。

## 接口基础信息
- **基础URL**: `https://api.lifemap.com/v1`
- **认证方式**: Bearer Token
- **数据格式**: JSON
- **编码**: UTF-8

## 通用响应格式
```json
{
  "success": true,
  "message": "操作成功",
  "data": {},
  "code": 200,
  "timestamp": "2024-01-01T00:00:00Z"
}
```

---

## 1. 用户认证模块

### 1.1 用户注册
**接口**: `POST /auth/register`

**请求参数**:
```json
{
  "username": "string, required, 3-20个字符",
  "password": "string, required, 8-20个字符",
  "phone": "string, optional, 11位手机号"
}
```

**响应数据**:
```json
{
  "success": true,
  "message": "注册成功",
  "data": {
    "user": {
      "id": "string",
      "username": "string",
      "phone": "string",
      "createdAt": "string",
      "infoCollected": false
    },
    "token": "string"
  }
}
```

**使用页面**: `pages/register/register.vue`

---

### 1.2 用户登录
**接口**: `POST /auth/login`

**请求参数**:
```json
{
  "username": "string, required, 用户名或手机号",
  "password": "string, required"
}
```

**响应数据**:
```json
{
  "success": true,
  "message": "登录成功",
  "data": {
    "user": {
      "id": "string",
      "username": "string",
      "phone": "string",
      "createdAt": "string",
      "lastLoginAt": "string",
      "infoCollected": "boolean",
      "questionnaireAnswers": "array",
      "aiReport": "object"
    },
    "token": "string"
  }
}
```

**使用页面**: `pages/login/login.vue`

---

### 1.3 用户信息更新
**接口**: `PUT /users/{userId}`

**请求头**: `Authorization: Bearer {token}`

**请求参数**:
```json
{
  "infoCollected": "boolean, optional",
  "questionnaireAnswers": "array, optional",
  "questionnaireCompletedAt": "string, optional",
  "aiReport": "object, optional",
  "aiReportGeneratedAt": "string, optional"
}
```

**响应数据**:
```json
{
  "success": true,
  "message": "更新成功",
  "data": {
    "user": {
      "id": "string",
      "username": "string",
      "phone": "string",
      "infoCollected": "boolean",
      "questionnaireAnswers": "array",
      "aiReport": "object"
    }
  }
}
```

**使用页面**: 
- `pages/user-info-collection/user-info-collection.vue`
- `pages/questionnaire-result/questionnaire-result.vue`

---

### 1.4 获取用户信息
**接口**: `GET /users/{userId}`

**请求头**: `Authorization: Bearer {token}`

**响应数据**:
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "string",
      "username": "string",
      "phone": "string",
      "createdAt": "string",
      "lastLoginAt": "string",
      "infoCollected": "boolean",
      "questionnaireAnswers": "array",
      "aiReport": "object"
    }
  }
}
```

**使用页面**: `pages/profile/profile.vue`

---

### 1.5 用户登出
**接口**: `POST /auth/logout`

**请求头**: `Authorization: Bearer {token}`

**响应数据**:
```json
{
  "success": true,
  "message": "登出成功"
}
```

**使用页面**: 
- `pages/profile/profile.vue`
- `pages/index/index.vue`

---

## 2. AI服务模块

### 2.1 AI聊天对话
**接口**: `POST /ai/chat`

**请求头**: `Authorization: Bearer {token}`

**请求参数**:
```json
{
  "message": "string, required, 用户消息内容",
  "conversationId": "string, optional, 会话ID",
  "context": "object, optional, 上下文信息"
}
```

**响应数据**:
```json
{
  "success": true,
  "data": {
    "reply": "string, AI回复内容",
    "conversationId": "string",
    "messageId": "string",
    "timestamp": "string"
  }
}
```

**使用页面**: 
- `pages/chat/chat.vue`
- `pages/map/map.vue` (智能体交流区)

---

### 2.2 生成个性化报告
**接口**: `POST /ai/personality-report`

**请求头**: `Authorization: Bearer {token}`

**请求参数**:
```json
{
  "questionnaireAnswers": [
    {
      "questionId": "number",
      "question": "string",
      "selectedOption": "number",
      "selectedValue": "string",
      "selectedLabel": "string",
      "timestamp": "string"
    }
  ],
  "userInfo": {
    "username": "string",
    "userId": "string"
  }
}
```

**响应数据**:
```json
{
  "success": true,
  "data": {
    "title": "string, 个性类型标题",
    "subtitle": "string, 个性类型副标题",
    "description": "string, 详细个性分析描述",
    "traits": ["string", "特征标签数组"],
    "suggestions": [
      {
        "icon": "string",
        "text": "string"
      }
    ],
    "strengths": ["string", "优势数组"],
    "developmentAreas": ["string", "发展领域数组"],
    "lifeTips": "string, 生活建议",
    "summary": "string, 整体评价总结",
    "generatedAt": "string",
    "source": "string"
  }
}
```

**使用页面**: `pages/questionnaire-result/questionnaire-result.vue`

---

### 2.3 多模态AI接口
**接口**: `POST /ai/multimodal`

**请求头**: `Authorization: Bearer {token}`

**请求参数**:
```json
{
  "text": "string, optional, 文本内容",
  "imageUrl": "string, optional, 图片URL",
  "type": "string, required, 请求类型"
}
```

**响应数据**:
```json
{
  "success": true,
  "data": {
    "content": "string, AI响应内容",
    "messageId": "string",
    "timestamp": "string"
  }
}
```

**使用场景**: 图片识别、多模态交互等

---

## 3. 任务系统模块

### 3.1 获取用户任务
**接口**: `GET /tasks/user/{userId}`

**请求头**: `Authorization: Bearer {token}`

**查询参数**:
- `type`: 任务类型 (daily, challenge, boss)
- `status`: 任务状态 (pending, completed, cancelled)

**响应数据**:
```json
{
  "success": true,
  "data": {
    "dailyTasks": [
      {
        "id": "string",
        "title": "string",
        "description": "string",
        "reward": "number, 经验值奖励",
        "current": "number, 当前进度",
        "total": "number, 总进度",
        "completed": "boolean",
        "createdAt": "string"
      }
    ],
    "challengeTasks": [
      {
        "id": "string",
        "title": "string",
        "description": "string",
        "reward": "number",
        "difficulty": "string",
        "completed": "boolean"
      }
    ],
    "bossTask": {
      "id": "string",
      "title": "string",
      "description": "string",
      "timeLeft": "string",
      "status": "string"
    }
  }
}
```

**使用页面**: `pages/task/task.vue`

---

### 3.2 完成任务
**接口**: `POST /tasks/{taskId}/complete`

**请求头**: `Authorization: Bearer {token}`

**请求参数**:
```json
{
  "completedAt": "string, 完成时间",
  "progress": "number, optional, 进度更新"
}
```

**响应数据**:
```json
{
  "success": true,
  "data": {
    "task": "object, 更新后的任务信息",
    "expGained": "number, 获得的经验值",
    "levelUp": "boolean, 是否升级",
    "newLevel": "number, optional, 新等级"
  }
}
```

**使用页面**: `pages/task/task.vue`

---

### 3.3 获取用户统计
**接口**: `GET /users/{userId}/stats`

**请求头**: `Authorization: Bearer {token}`

**响应数据**:
```json
{
  "success": true,
  "data": {
    "userLevel": "number, 用户等级",
    "levelTitle": "string, 等级称号",
    "currentExp": "number, 当前经验值",
    "maxExp": "number, 升级所需经验值",
    "completedTasks": "number, 已完成任务数",
    "totalExp": "number, 总经验值",
    "pendingTasks": "number, 待完成任务数",
    "badges": [
      {
        "icon": "string",
        "earned": "boolean"
      }
    ]
  }
}
```

**使用页面**: 
- `pages/task/task.vue`
- `pages/map/map.vue`

---

### 3.4 技能系统
**接口**: `GET /skills/user/{userId}`

**请求头**: `Authorization: Bearer {token}`

**响应数据**:
```json
{
  "success": true,
  "data": {
    "skills": [
      {
        "id": "string",
        "name": "string, 技能名称",
        "icon": "string, 图标",
        "bgColor": "string, 背景色",
        "type": "string, 技能类型",
        "level": "number, 技能等级",
        "unlocked": "boolean, 是否解锁"
      }
    ]
  }
}
```

**使用页面**: `pages/task/task.vue`

---

### 3.5 使用技能
**接口**: `POST /skills/{skillId}/use`

**请求头**: `Authorization: Bearer {token}`

**响应数据**:
```json
{
  "success": true,
  "data": {
    "skillUsed": "string, 使用的技能",
    "effect": "string, 技能效果描述",
    "duration": "number, 持续时间(秒)",
    "cooldown": "number, 冷却时间(秒)"
  }
}
```

**使用页面**: `pages/task/task.vue`

---

## 4. 成长地图模块

### 4.1 获取地图数据
**接口**: `GET /map/user/{userId}`

**请求头**: `Authorization: Bearer {token}`

**响应数据**:
```json
{
  "success": true,
  "data": {
    "hexagonGrid": [
      {
        "id": "string",
        "row": "number",
        "col": "number",
        "active": "boolean, 是否激活",
        "accessible": "boolean, 是否可访问",
        "icon": "string, 图标",
        "reward": "object, optional, 奖励信息"
      }
    ],
    "userProgress": {
      "completedAreas": "number",
      "totalAreas": "number",
      "currentPosition": {
        "row": "number",
        "col": "number"
      }
    }
  }
}
```

**使用页面**: `pages/map/map.vue`

---

### 4.2 探索地图区域
**接口**: `POST /map/explore`

**请求头**: `Authorization: Bearer {token}`

**请求参数**:
```json
{
  "hexagonId": "string, 六边形区域ID",
  "userId": "string"
}
```

**响应数据**:
```json
{
  "success": true,
  "data": {
    "explored": "boolean",
    "reward": {
      "type": "string, 奖励类型",
      "amount": "number, 奖励数量",
      "description": "string, 奖励描述"
    },
    "newAreasUnlocked": "array, optional, 新解锁的区域"
  }
}
```

**使用页面**: `pages/map/map.vue`

---

## 5. 徽章系统模块

### 5.1 获取徽章扭蛋
**接口**: `POST /badges/gashapon`

**请求头**: `Authorization: Bearer {token}`

**响应数据**:
```json
{
  "success": true,
  "data": {
    "badge": {
      "icon": "string, 徽章图标",
      "name": "string, 徽章名称",
      "rarity": "string, 稀有度",
      "description": "string, 徽章描述"
    },
    "isNew": "boolean, 是否是新徽章"
  }
}
```

**使用页面**: `pages/task/task.vue`

---

### 5.2 获取用户徽章列表
**接口**: `GET /badges/user/{userId}`

**请求头**: `Authorization: Bearer {token}`

**响应数据**:
```json
{
  "success": true,
  "data": {
    "badges": [
      {
        "id": "string",
        "icon": "string",
        "name": "string",
        "earned": "boolean",
        "earnedAt": "string, optional",
        "rarity": "string"
      }
    ]
  }
}
```

**使用页面**: `pages/task/task.vue`

---

## 6. 错误码说明

| 错误码 | 描述 | 说明 |
|--------|------|------|
| 200 | 成功 | 请求处理成功 |
| 400 | 请求参数错误 | 参数格式不正确或缺少必需参数 |
| 401 | 未授权 | Token无效或已过期 |
| 403 | 禁止访问 | 用户权限不足 |
| 404 | 资源不存在 | 请求的资源未找到 |
| 409 | 冲突 | 用户名已存在、手机号已注册等 |
| 429 | 请求频率限制 | 请求过于频繁 |
| 500 | 服务器内部错误 | 系统异常 |
| 502 | AI服务不可用 | AI接口调用失败 |
| 503 | 服务暂不可用 | 系统维护中 |

---

## 7. 特殊说明

### 7.1 AI接口配置
目前前端使用的是豆包AI服务，配置信息：
- **API地址**: `https://ark.cn-beijing.volces.com/api/v3`
- **模型名称**: `doubao-seed-1-6-250615`
- **最大Token**: 1500
- **温度**: 0.7

后端需要适配或替换为自己的AI服务。

### 7.2 本地存储数据
前端目前使用uni.getStorageSync/setStorageSync进行本地存储，主要存储：
- 用户信息 (`users`)
- 当前用户ID (`currentUserId`)
- 问卷答案
- AI报告

后端接管后，这些数据应该保存到数据库中。

### 7.3 文件上传
如需支持头像上传、图片分享等功能，需要添加文件上传接口：
```
POST /upload/image
POST /upload/avatar
```

### 7.4 实时通信
如需支持实时聊天、实时通知等功能，建议使用WebSocket：
```
WebSocket: wss://api.lifemap.com/ws
```

---

## 8. 部署建议

### 8.1 数据库设计
建议使用MySQL或PostgreSQL，主要表结构：
- users (用户表)
- questionnaire_answers (问卷答案表)
- tasks (任务表)
- user_tasks (用户任务关联表)
- badges (徽章表)
- user_badges (用户徽章关联表)
- chat_conversations (聊天会话表)
- chat_messages (聊天消息表)

### 8.2 缓存策略
建议使用Redis缓存：
- 用户会话信息
- AI聊天上下文
- 任务状态缓存
- 排行榜数据

### 8.3 安全考虑
- JWT Token认证
- API调用频率限制
- 敏感数据加密
- SQL注入防护
- XSS攻击防护

---

## 9. 联系信息
如有接口对接问题，请联系前端开发团队进行确认和调试。
