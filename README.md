# Fund Overview

一个现代化的基金投资管理工具，帮助投资者追踪和管理他们的基金投资组合。使用 Vue 3 开发，提供直观的数据可视化和智能 AI 助手功能。

## 功能特点

### 📊 投资概览
- 总体投资收益和收益率实时展示
- 投资进度条可视化展示
- 已投入、计划投入和剩余可投金额统计
- 快速查看持仓基金数量、交易次数和月均投入

### 💼 基金管理
- 现代化卡片式布局展示基金信息
- 基金详情页展示完整交易记录
- 支持添加新基金和交易记录
- 自动计算份额和相关数据

### 🤖 AI 助手
- 内置智能投资顾问
- 支持 OpenAI 和 Deepseek
- Markdown 格式回复
- 实时对话历史记录

## 快速开始

### 安装依赖
```bash
npm install
```

### 开发环境运行
```bash
npm run serve
```

### 生产环境构建
```bash
npm run build
```

### 代码检查
```bash
npm run lint
```

## 项目结构
```
src/
├── assets/
│   └── data/          # 基金数据存储
├── components/        # 组件
│   ├── FundAdd.vue    # 添加基金/交易组件
│   ├── FundAI.vue     # AI 助手组件
├── services/         # 服务
│   ├── aiService.js   # AI 服务实现
│   └── aiProviders.js # AI 提供商配置
├── views/            # 页面
│   ├── FundCollection.vue # 基金集合页面
│   └── FundDetail.vue     # 基金详情页面
└── router/           # 路由配置
```

## 环境要求
- Node.js >= 12.0.0
- Vue 3
- 现代浏览器支持

## 主要依赖
```json
{
  "vue": "^3.3.0",
  "vue-router": "^4.5.0",
  "marked": "^15.0.6",
  "openai": "^4.28.0"
}
```

## 配置说明

### AI 服务配置
在使用 AI 助手功能前，需要在 `src/services/aiProviders.js` 中配置 API 密钥：

```javascript
export const AI_PROVIDERS = {
  OPENAI: {
    apiKey: 'your-openai-api-key',
    // ...
  },
  DEEPSEEK: {
    apiKey: 'your-deepseek-api-key',
    // ...
  }
}
```

## 开发计划
- [ ] 添加数据导入/导出功能
- [ ] 支持更多 AI 服务提供商
- [ ] 添加更多数据分析图表
- [ ] 实现数据持久化存储
- [ ] 添加用户认证功能

## 注意事项
1. 请确保在使用前配置正确的 AI 服务 API 密钥
2. 建议使用环境变量存储敏感信息
3. 定期备份基金数据

## 许可证
MIT License

## 贡献
欢迎提交 Issue 和 Pull Request！

1. Fork 项目
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 创建 Pull Request

## 环境配置

1. 复制 `.env.example` 文件并重命名为 `.env`
2. 在 `.env` 文件中填入你的 API 密钥：
```env
VUE_APP_OPENAI_API_KEY=your-openai-api-key
VUE_APP_DEEPSEEK_API_KEY=your-deepseek-api-key
```
