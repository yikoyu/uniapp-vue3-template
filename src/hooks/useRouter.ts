import { router } from '@/plugins/router'

/**
 * 获取路由实例
 *
 * 为什么需要这个 hook：
 * Vue 的 `useRouter()` 只能在 `setup()` 内部调用，无法在普通函数、Pinia action、alova 回调等场景使用。
 * 该 hook 直接导出 `@wot-ui/router` 的 router 实例，使其可在任意位置调用。
 *
 * @example
 * ```ts
 * import { useRouter } from '@/hooks/useRouter'
 *
 * // 在 alova 请求拦截器中跳转登录页
 * useRouter().replaceAll('/pages/login/login')
 *
 * // 在 Pinia store 中使用
 * useRouter().push('/pages/home/home')
 * ```
 *
 * @returns router 实例，支持 push / replace / replaceAll / back 等方法
 */
export function useRouter() {
  return router
}
