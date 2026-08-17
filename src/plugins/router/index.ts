import type { App } from 'vue'
import { createRouter as createWotRouter } from '@wot-ui/router'
// 从虚拟模块导入自动生成的路由信息
import { pages, subPackages } from 'virtual:uni-pages'
import { setupRouterGuards } from './guards'

function generateRoutes() {
  const routes = pages.map((page: any) => {
    const newPath = `/${page.path}`
    return { ...page, path: newPath }
  })
  if (subPackages && subPackages.length > 0) {
    subPackages.forEach((subPackage: any) => {
      const subRoutes = subPackage.pages.map((page: any) => {
        const newPath = `/${subPackage.root}/${page.path}`
        return { ...page, path: newPath }
      })
      routes.push(...subRoutes)
    })
  }
  return routes
}

export const router = createWotRouter({
  routes: generateRoutes(), // 路由表信息
})

setupRouterGuards(router)

export function createRouter(app: App) {
  app.use(router)
}
