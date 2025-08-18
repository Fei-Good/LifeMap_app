# LifeMap 前端对接API文档

**项目名称**: LifeMap 职场成长助手  
**文档版本**: v1.3  
**更新时间**: 2024-12-20  
**基础URL**: `https://byuvzkydmpop.sealosbja.site/api`  

---

## 目录
- [1. 通用说明](#1-通用说明)
- [2. 用户认证模块](#2-用户认证模块)
- [3. 用户信息管理](#3-用户信息管理)
- [4. 问卷系统](#4-问卷系统)
- [5. AI服务](#5-ai服务)
- [6. 任务系统](#6-任务系统)
- [7. 聊天记录](#7-聊天记录)
- [8. 技能系统](#8-技能系统)
- [9. 成就系统](#9-成就系统)
- [10. 系统配置](#10-系统配置)
- [11. 错误码对照表](#11-错误码对照表)

---

## 1. 通用说明

### 1.1 请求格式
```
Content-Type: application/json
Authorization: Bearer {token}  // 需要登录的接口
```

**注意**: 
- 所有接口请求都基于基础URL: `https://byuvzkydmpop.sealosbja.site/api`
- 如果前端与API不在同一域下，需要配置CORS或使用代理
- JavaScript示例中使用相对路径，实际部署时请根据情况调整

### 1.2 统一响应格式
```json
{
  "code": 200,           // 状态码
  "message": "success",  // 响应消息
  "data": {},           // 响应数据(可选)
  "timestamp": "2024-12-20T10:30:00.000Z"  // 时间戳(可选)
}
```

### 1.3 分页参数(通用)
```json
{
  "page": 1,      // 页码，从1开始
  "limit": 20     // 每页数量，默认20，最大50
}
```

---

## 2. 用户认证模块

### 2.1 用户登录
- **接口**: `POST /api/auth/login`
- **说明**: 用户登录验证
- **权限**: 公开

**请求参数:**
```json
{
  "username": "testuser",     // 用户名，必填
  "password": "123456"        // 密码，必填
}
```

**成功响应:**
```json
{
  "code": 200,
  "message": "登录成功",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": 12345,
      "username": "testuser",
      "email": "test@example.com",
      "loginTime": "2024-12-20T10:30:00.000Z",
      "isNewUser": false,
      "infoCollected": true,
      "avatar": "https://example.com/avatar.jpg",
      "profile": {
        "personalityType": "INTJ",
        "completedAssessment": true
      }
    }
  }
}
```

**失败响应:**
```json
{
  "code": 401,
  "message": "用户名或密码错误"
}
```

### 2.2 用户注册
- **接口**: `POST /api/auth/register`
- **说明**: 新用户注册
- **权限**: 公开

**请求参数:**
```json
{
  "username": "newuser",           // 用户名，3-20位字符，必填
  "email": "new@example.com",      // 邮箱，必填
  "password": "123456"             // 密码，至少6位，必填
}
```

**成功响应:**
```json
{
  "code": 200,
  "message": "注册成功",
  "data": {
    "user": {
      "id": 12346,
      "username": "newuser",
      "email": "new@example.com",
      "registerTime": "2024-12-20T10:35:00.000Z",
      "isNewUser": true,
      "avatar": "",
      "profile": {
        "personalityType": "",
        "completedAssessment": false
      }
    }
  }
}
```

### 2.3 检查用户名
- **接口**: `GET /api/auth/check-username?username=testuser`
- **说明**: 检查用户名是否已存在
- **权限**: 公开

**成功响应:**
```json
{
  "code": 200,
  "data": {
    "exists": false  // true=已存在，false=可用
  }
}
```

### 2.4 验证Token
- **接口**: `GET /api/auth/verify`
- **说明**: 验证当前token是否有效
- **权限**: 需要登录

**成功响应:**
```json
{
  "code": 200,
  "message": "Token有效",
  "data": {
    "userId": 12345,
    "username": "testuser"
  }
}
```

### 2.5 刷新Token
- **接口**: `POST /api/auth/refresh`
- **说明**: 刷新用户token
- **权限**: 需要登录

**成功响应:**
```json
{
  "code": 200,
  "message": "Token刷新成功",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### 2.6 用户登出
- **接口**: `POST /api/auth/logout`
- **说明**: 用户登出
- **权限**: 需要登录

**成功响应:**
```json
{
  "code": 200,
  "message": "登出成功"
}
```

---

## 3. 用户信息管理

### 3.1 获取用户资料
- **接口**: `GET /api/user/profile`
- **说明**: 获取当前用户详细信息
- **权限**: 需要登录

**成功响应:**
```json
{
  "code": 200,
  "data": {
    "id": 12345,
    "username": "testuser",
    "email": "test@example.com",
    "isNewUser": false,
    "infoCollected": true,
    "questionnaireAnswers": [...],
    "questionnaireCompletedAt": "2024-12-15T10:00:00.000Z",
    "personalityReport": {...},
    "loginTime": "2024-12-20T10:30:00.000Z",
    "registerTime": "2024-12-01T08:00:00.000Z"
  }
}
```

### 3.2 更新用户资料
- **接口**: `PUT /api/user/profile`
- **说明**: 更新用户基本资料
- **权限**: 需要登录

**请求参数:**
```json
{
  "avatar": "https://example.com/new-avatar.jpg",  // 可选
  "personalityType": "ENFP",                      // 可选
  "infoCollected": true,                          // 可选
  "questionnaireAnswers": [...],                  // 可选
  "questionnaireCompletedAt": "2024-12-20T10:30:00.000Z"  // 可选
}
```

**成功响应:**
```json
{
  "code": 200,
  "message": "资料更新成功",
  "data": {
    // 返回更新后的用户信息
  }
}
```

### 3.3 完成信息收集
- **接口**: `POST /api/user/complete-info`
- **说明**: 标记用户完成初次信息收集
- **权限**: 需要登录

**成功响应:**
```json
{
  "code": 200,
  "message": "信息收集已完成"
}
```

### 3.4 获取用户等级
- **接口**: `GET /api/user/level`
- **说明**: 获取用户等级和经验值信息
- **权限**: 需要登录

**成功响应:**
```json
{
  "code": 200,
  "data": {
    "level": 5,
    "levelTitle": "成长新星",
    "currentExp": 1250,
    "maxExp": 2000,
    "totalExp": 8750
  }
}
```

### 3.5 获取用户统计
- **接口**: `GET /api/user/stats`
- **说明**: 获取用户各项统计数据
- **权限**: 需要登录

**成功响应:**
```json
{
  "code": 200,
  "data": {
    "tasksCompleted": 25,
    "chatMessages": 150,
    "daysActive": 30,
    "badgesEarned": 8,
    "skillsUnlocked": 12
  }
}
```

### 3.6 获取排行榜
- **接口**: `GET /api/user/leaderboard`
- **说明**: 获取用户排行榜
- **权限**: 公开

**成功响应:**
```json
{
  "code": 200,
  "data": [
    {
      "rank": 1,
      "username": "topuser",
      "level": 10,
      "totalExp": 25000,
      "avatar": "https://example.com/avatar1.jpg"
    }
  ]
}
```

### 3.7 搜索用户
- **接口**: `GET /api/user/search?q=keyword&limit=10`
- **说明**: 根据关键词搜索用户
- **权限**: 公开

**请求参数:**
- `q`: 搜索关键词（必填）
- `limit`: 结果数量限制（可选，默认10）

**成功响应:**
```json
{
  "code": 200,
  "data": [
    {
      "id": 12345,
      "username": "searchuser",
      "avatar": "https://example.com/avatar.jpg",
      "level": 3
    }
  ]
}
```

---

## 4. 问卷系统

### 4.1 获取问卷题目
- **接口**: `GET /api/questionnaire/questions`
- **说明**: 获取所有问卷题目
- **权限**: 公开

**成功响应:**
```json
{
  "code": 200,
  "data": [
    {
      "id": 1,
      "question": "你更喜欢在哪种环境下工作？",
      "image": "https://example.com/q1.jpg",
      "type": "objective",
      "options": [
        {
          "label": "安静的个人空间",
          "value": "quiet",
          "description": "专注于独立思考"
        },
        {
          "label": "热闹的团队环境",
          "value": "team",
          "description": "享受团队协作"
        }
      ]
    },
    {
      "id": 2,
      "question": "请描述你理想的工作状态",
      "type": "subjective",
      "placeholder": "请详细描述..."
    }
  ]
}
```

### 4.2 按类型获取题目
- **接口**: `GET /api/questionnaire/questions/{type}`
- **说明**: 根据类型获取问卷题目
- **权限**: 公开

**路径参数:**
- `type`: 题目类型（objective/subjective）

### 4.3 提交问卷答案
- **接口**: `POST /api/questionnaire/submit`
- **说明**: 提交用户的问卷答案
- **权限**: 需要登录

**请求参数:**
```json
{
  "answers": [
    {
      "questionId": 1,
      "question": "你更喜欢在哪种环境下工作？",
      "type": "objective",
      "selectedOption": 0,
      "selectedValue": "quiet",
      "selectedLabel": "安静的个人空间",
      "timestamp": "2024-12-20T10:30:00.000Z"
    },
    {
      "questionId": 2,
      "question": "请描述你理想的工作状态",
      "type": "subjective",
      "answer": "我希望能够在安静的环境中专注工作...",
      "timestamp": "2024-12-20T10:32:00.000Z"
    }
  ]
}
```

**成功响应:**
```json
{
  "code": 200,
  "message": "问卷提交成功",
  "data": {
    "personalityReport": {
      "title": "理性思考者",
      "subtitle": "INTJ - 建筑师型人格",
      "description": "你是一个独立思考的人...",
      "traits": ["理性", "独立", "有条理"],
      "suggestions": [
        {
          "icon": "💡",
          "text": "保持独立思考的习惯"
        }
      ],
      "strengths": ["逻辑思维强", "规划能力好"],
      "developmentAreas": ["团队协作", "表达沟通"],
      "lifeTips": "建议多参与团队活动...",
      "summary": "你具备优秀的独立工作能力...",
      "generatedAt": "2024-12-20T10:35:00.000Z",
      "source": "AI智能分析"
    }
  }
}
```

### 4.4 获取用户答案
- **接口**: `GET /api/questionnaire/answers`
- **说明**: 获取用户的问卷答案历史
- **权限**: 需要登录

**成功响应:**
```json
{
  "code": 200,
  "data": {
    "answers": [...],  // 用户答案数组
    "completedAt": "2024-12-20T10:35:00.000Z"
  }
}
```

### 4.5 获取个性化报告
- **接口**: `GET /api/questionnaire/report`
- **说明**: 获取用户的个性化报告
- **权限**: 需要登录

**成功响应:**
```json
{
  "code": 200,
  "data": {
    "title": "理性思考者",
    "subtitle": "INTJ - 建筑师型人格",
    // ... 完整报告内容
  }
}
```

### 4.6 重新生成报告
- **接口**: `POST /api/questionnaire/regenerate-report`
- **说明**: 基于现有答案重新生成个性化报告
- **权限**: 需要登录

**成功响应:**
```json
{
  "code": 200,
  "message": "报告重新生成成功",
  "data": {
    // 新的报告内容
  }
}
```