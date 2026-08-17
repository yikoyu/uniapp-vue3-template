<h1 align="center">
Uni-App 快速启动模版 (Vue3)
</h1>

<p align="center">
一个轻量、现代的 uni-app 开发模板，基于 Vue 3 + TypeScript + Vite 构建。
</p>

<p align="center">
  <a href="https://github.com/yikoyu/uniapp-vue3-template">
    <img src="https://img.shields.io/github/stars/yikoyu/uniapp-vue3-template?style=for-the-badge&logo=github" alt="stars">
  </a>
  <a href="https://github.com/yikoyu/uniapp-vue3-template">
    <img src="https://img.shields.io/github/forks/yikoyu/uniapp-vue3-template?style=for-the-badge&logo=github" alt="forks">
  </a>
  <a href="https://github.com/yikoyu/uniapp-vue3-template">
    <img src="https://img.shields.io/badge/dynamic/json?url=https%3A%2F%2Fraw.githubusercontent.com%2Fyikoyu%2Funiapp-vue3-template%2Fmain%2Fpackage.json&query=engines.node&label=node&style=for-the-badge&logo=node.js" alt="nodejs">
  </a>
  <a href="https://github.com/yikoyu/uniapp-vue3-template">
    <img src="https://img.shields.io/github/package-json/packageManager/yikoyu/uniapp-vue3-template?style=for-the-badge&logo=pnpm" alt="pnpm">
  </a>
  <a href="https://github.com/yikoyu/uniapp-vue3-template">
    <img src="https://img.shields.io/github/license/yikoyu/uniapp-vue3-template?style=for-the-badge" alt="license">
  </a>
</p>

<p align="center">
  <a href="https://antfu.me/badge-code-style"><img src="https://antfu.me/badge-code-style.svg" alt="code style"></a>
</p>

---

## 特性

- ⚡️ **Vue 3 + Vite + TypeScript** - 现代化技术栈，极速开发体验
- 🎨 **UnoCSS** - 高性能原子化 CSS 引擎，支持 rpx 自动转换
- 🐂 **WotUI** - 70+ 高质量 uni-app 组件，支持暗黑模式与主题定制
- 🌐 **Alova** - 极致高效的请求库，内置 token 自动刷新
- 📊 **ECharts** - 集成 uni-echarts，支持数据可视化
- 🗂️ **文件路由** - 基于文件的路由系统，自动生成路由配置
- 📦 **智能分包** - 支持跨包异步调用，优化包体积
- 📥 **API 自动生成** - 基于 OpenAPI 规范自动生成接口代码
- 🔧 **ESLint + Stylelint** - 代码规范自动校验
- 🤖 **AI 辅助** - 内置 Claude/MCP 配置，支持 AI 辅助开发

## 技术栈

<p>
  <img src="https://img.shields.io/badge/dynamic/json?url=https%3A%2F%2Fraw.githubusercontent.com%2Fyikoyu%2Funiapp-vue3-template%2Fmain%2Fpackage.json&query=%24.dependencies.vue&label=Vue&style=flat-square&logo=vue.js&color=42b883" alt="vue">
  <img src="https://img.shields.io/badge/dynamic/json?url=https%3A%2F%2Fraw.githubusercontent.com%2Fyikoyu%2Funiapp-vue3-template%2Fmain%2Fpackage.json&query=%24.devDependencies.vite&label=Vite&style=flat-square&logo=vite&color=646cff" alt="vite">
  <img src="https://img.shields.io/badge/dynamic/json?url=https%3A%2F%2Fraw.githubusercontent.com%2Fyikoyu%2Funiapp-vue3-template%2Fmain%2Fpackage.json&query=%24.devDependencies.typescript&label=TypeScript&style=flat-square&logo=typescript&color=3178c6" alt="typescript">
  <img src="https://img.shields.io/badge/dynamic/json?url=https%3A%2F%2Fraw.githubusercontent.com%2Fyikoyu%2Funiapp-vue3-template%2Fmain%2Fpackage.json&query=%24.dependencies.%40wot-ui%2Fui&label=WotUI&style=flat-square&logo=data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCI+PHBhdGggZD0iTTEyIDJMMyA3djEwbDkgNSA5LTVIN0wxMiAyeiIgZmlsbD0iIzQ3NDhkMyIvPjwvc3ZnPg==&color=4748d3" alt="wot-ui">
  <img src="https://img.shields.io/badge/dynamic/json?url=https%3A%2F%2Fraw.githubusercontent.com%2Fyikoyu%2Funiapp-vue3-template%2Fmain%2Fpackage.json&query=%24.dependencies.alova&label=alova&style=flat-square&logo=data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCI+PGNpcmNsZSBjeD0iMTIiIGN5PSIxMiIgcj0iMTAiIGZpbGw9IiMzMzMiLz48L3N2Zz4=&color=333" alt="alova">
  <img src="https://img.shields.io/badge/dynamic/json?url=https%3A%2F%2Fraw.githubusercontent.com%2Fyikoyu%2Funiapp-vue3-template%2Fmain%2Fpackage.json&query=%24.dependencies.pinia&label=Pinia&style=flat-square&logo=pinia&color=ffd859" alt="pinia">
  <img src="https://img.shields.io/badge/dynamic/json?url=https%3A%2F%2Fraw.githubusercontent.com%2Fyikoyu%2Funiapp-vue3-template%2Fmain%2Fpackage.json&query=%24.devDependencies.unocss&label=UnoCSS&style=flat-square&logo=unocss&color=333" alt="unocss">
</p>

## 快速开始

### 环境要求

- Node.js >= 22
- pnpm >= 10

### 安装

```bash
# 克隆项目
git clone https://github.com/yikoyu/uniapp-vue3-template.git
cd uniapp-vue3-template

# 安装依赖
pnpm install
```

### 开发

```bash
# 启动 H5
pnpm h5:dev

# 启动微信小程序
pnpm wx:dev

# 启动支付宝小程序
pnpm ali:dev:tst
```

### 构建

```bash
# 构建 H5
pnpm h5:build:dev    # 开发环境
pnpm h5:build:tst    # 测试环境
pnpm h5:build:prd    # 生产环境

# 构建微信小程序
pnpm wx:build:dev
pnpm wx:build:tst
pnpm wx:build:prd
```

## 目录结构

```
├── src/
│   ├── api/                    # API 层
│   │   ├── _gen/              # OpenAPI 自动生成的接口
│   │   ├── core/              # 请求核心配置
│   │   └── mock/              # Mock 数据
│   ├── components/            # 公共组件（自动导入）
│   ├── hooks/                 # 组合式函数
│   ├── layouts/               # 页面布局
│   ├── packages/              # 分包
│   │   ├── sub-static/        # 静态资源分包
│   │   └── sub-vendor/        # 第三方库分包
│   ├── pages/                 # 页面目录
│   ├── plugins/               # 插件（路由、调试）
│   ├── stores/                # Pinia 状态管理
│   ├── styles/                # 全局样式
│   └── utils/                 # 工具函数
├── types/                     # TypeScript 类型定义
├── scripts/                   # 构建脚本
├── vite.config.ts             # Vite 配置
├── uno.config.ts              # UnoCSS 配置
├── manifest.config.ts         # uni-app 配置
└── pages.config.mts           # 页面路由配置
```

## 核心功能

### 请求封装

基于 alova 的请求层，内置 token 自动刷新和统一错误处理：

```typescript
// src/api/core/instance.ts
export const alovaInstance = createAlova({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  // ... 配置
})
```

**使用示例：**

```typescript
// 自动生成的 API
const res = await Apis.user.getUserInfo()

// 或直接使用 alovaInstance
const res = await alovaInstance.Get('/api/data')
```

### 状态管理

使用 Pinia + 持久化插件，支持选择性持久化：

```typescript
// src/stores/app.ts
export const useAppStore = defineStore('app', {
  persist: {
    key: 'pinia-app',
    pick: ['accessToken', 'refreshToken'], // 只持久化必要字段
  },
  // ...
})
```

### 文件路由

基于文件自动生成路由配置，支持布局：

```vue
<script lang="ts" setup>
definePage({
  layout: 'tabbar', // 使用 tabbar 布局
  style: {
    navigationBarTitleText: '首页',
  },
})
</script>
```

### API 自动生成

基于 OpenAPI 规范自动生成类型安全的接口代码：

```bash
# 生成 API 代码
pnpm alova-gen
```

## 开发规范

### 代码提交

使用 `cz-git` 进行交互式提交：

```bash
pnpm commit
```

### 代码检查

```bash
pnpm lint          # 检查所有
pnpm lint:js       # 仅检查 JS/Vue
pnpm lint:css      # 仅检查样式
pnpm lint:fix      # 自动修复
pnpm lint:vue      # TypeScript 类型检查
```

### 更新 uni-app

使用 UVM (uni-app version manager) 更新：

```bash
pnpm uvm
```

## 同步更新

```bash
# 添加上游仓库
git remote add upstream https://github.com/yikoyu/uniapp-vue3-template

# 拉取更新
git fetch upstream

# 合并更新
git merge upstream/main

# 或使用 rebase 保持线性提交
git rebase upstream/main
```

## 支持平台

| 平台 | 状态 |
|------|------|
| H5 | ✅ 已测试 |
| 微信小程序 | ✅ 已测试 |
| 支付宝小程序 | ✅ 已测试 |
| 抖音小程序 | ⚠️ 未测试 |
| QQ 小程序 | ⚠️ 未测试 |
| 百度小程序 | ⚠️ 未测试 |
| 快手小程序 | ⚠️ 未测试 |
| 京东小程序 | ⚠️ 未测试 |
| 小红书小程序 | ⚠️ 未测试 |
| 鸿蒙 | ⚠️ 未测试 |
| App (Android/iOS) | ⚠️ 未测试 |

## License

[MIT](LICENSE)
