<h1 align="center">
Uni-App 快速启动模版 (Vue3)
</h1>

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
<!-- <a href="https://github.com/yikoyu/uniapp-vue3-template">
  <img src="https://img.shields.io/github/package-json/v/yikoyu/uniapp-vue3-template?style=for-the-badge">
</a> -->
<a href="https://github.com/yikoyu/uniapp-vue3-template">
  <img src="https://img.shields.io/github/license/yikoyu/uniapp-vue3-template?style=for-the-badge" alt="license">
</a>

[![code style](https://antfu.me/badge-code-style.svg)](https://github.com/antfu/eslint-config)

## 特性

- ⚡️ [Vue 3](https://github.com/vuejs/core), [Vite](https://github.com/vitejs/vite), [pnpm](https://pnpm.io/), [esbuild](https://github.com/evanw/esbuild) - 就是快！

- 🔧 [ESM 优先](https://github.com/uni-helper/plugin-uni)

- 🗂 [基于文件的路由](./src/pages)

- 📦 [组件自动化加载](./src/components)

- 📑 [布局系统](./src/layouts)

- 🐂 [Wot UI](https://github.com/wot-ui/wot-ui) - 基于 Vue3 + TypeScript 的 uni-app 组件库，提供 70+ 高质量组件，支持国际化（内置多语言包）、暗黑模式与通过 CSS 变量进行主题定制

- 🌐 [Alova](https://alova.js.org/zh-CN/) - 极致高效的请求工具集，更现代化的 OpenAPI 生成方案

- 🆒 [Uni Ku](https://uni-ku.js.org/) - 非常酷的 uni-app 插件库

- 📊 [Uni Echarts](https://uni-echarts.xiaohe.ink/) - 适用于 uni-app 的 Apache ECharts 组件

- 🎨 [UnoCSS](https://github.com/unocss/unocss) - 高性能且极具灵活性的即时原子化 CSS 引擎

- 😃 [各种图标集为你所用](https://iconify.design/)

- 🔥 使用 [新的 `<script setup>` 语法](https://github.com/vuejs/rfcs/pull/227)

- 📥 [API 自动加载](https://github.com/antfu/unplugin-auto-import) - 直接使用 Composition API 无需引入

- 🦾 [TypeScript](https://www.typescriptlang.org/) & [ESLint](https://eslint.org/) - 保证代码质量

## 🛠️ 使用方法

### 1. 项目启动

推荐使用 `pnpm` 作为包管理工具。

```bash
# 切换到 node 版本，如果使用nvm安装node
nvm use

# 安装依赖
pnpm install

# 启动H5
pnpm h5:dev

# 启动微信小程序
pnpm wx:dev
```

### 2. 项目发布（构建）

```bash
# 构建开发环境 (H5 / 小程序)
pnpm h5:build:dev
pnpm wx:build:dev

# 构建测试环境 (H5 / 小程序)
pnpm h5:build:tst
pnpm wx:build:tst

# 构建生产环境 (H5 / 小程序)
pnpm h5:build:prd
pnpm wx:build:prd
```

### 3. 代码提交规范

本项目集成 `cz-git`，通过交互式命令行提交代码。

```bash
# 引导式代码提交
pnpm commit
```

### 4. 更新 uni-app 版本

使用 UVM (uni-app version manager) 统一管理依赖版本。

```bash
# 更新 uni-app 相关依赖到最新正式版
pnpm uvm
```

### 5. 同步最新代码

1. 在自己的仓库里面新增开源仓库地址
```bash
git remote add upstream https://github.com/yikoyu/uniapp-vue3-template
```

2. 从开源仓库拉取最新代码
```bash
git fetch upstream
```

3. 合并更新，拉取开源项目更新代码
```bash
# 切换到本地 main 分支
git checkout main

# merge 合并更新
git merge upstream/main

# 希望保持线性提交 rebase 合并更新
git rebase upstream/main
```

4. 代码有冲突时，解决冲突，解决完冲突后提交代码即可
