# AI Pictionary (你画我猜)

一个基于 AI 的在线绘画猜测游戏。你画 AI 猜！

## 功能特点

- 🎨 **自由绘画** - 支持自由绘制各种图案
- 🤖 **AI 识别** - 使用 Gemini 2.0 Flash 进行智能识别
- 🎉 **互动反馈** - 高置信度时触发彩带庆祝效果
- 📱 **响应式设计** - 支持桌面和移动设备

## 技术栈

- **前端**: Next.js 14, React 18, TypeScript
- **样式**: Tailwind CSS
- **AI**: Gemini 2.0 Flash
- **组件**: lucide-react, react-confetti

## 快速开始

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

打开 [http://localhost:3001](http://localhost:3001) 开始体验。

## 项目结构

```
├── app/
│   ├── api/guess/      # AI 识别 API
│   ├── page.tsx        # 主页面
│   └── layout.tsx      # 布局
├── components/         # React 组件
├── lib/               # 类型定义和工具函数
└── public/            # 静态资源
```

## 使用说明

1. 在画布上绘制你想要表达的内容
2. 点击"提交"按钮
3. AI 会识别你的绘画并给出猜测结果
4. 当置信度 ≥80% 时，触发庆祝彩带效果
