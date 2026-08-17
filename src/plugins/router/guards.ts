import type { Router } from '@wot-ui/router'
import { useAppStore } from '@/stores/app'
import { Modal } from '@/utils/toast'

const LOGIN_PAGE: NavigateToOptions['url'] = '/pages/login/login'

/** 不需要登录的页面白名单 */
const WHITE_LIST: NavigateToOptions['url'][] = [
  '/pages/webview/webview',
  '/pages/login/login',
  '/pages/login/sms',
  '/pages/my/index',
  '/pages/home/home',
]

export function setupRouterGuards(router: Router) {
  router.beforeEach((to, from, next) => {
    const appStore = useAppStore()

    console.log('🚀 beforeEach 守卫触发:', { to, from })

    // 白名单页面直接放行
    if ((WHITE_LIST as string[]).includes(to.path)) {
      next()
      return
    }

    // 未登录跳转登录页
    if (!appStore.accessToken) {
      return new Promise<void>((resolve, reject) => {
        Modal.confirm({
          title: '提示',
          content: '请先登录',
          confirmText: '去登录',
        }).then((confirm) => {
          if (!confirm) {
            console.log('❌ 用户取消访问，阻止导航')
            next(false)
            return reject(new Error('用户取消访问'))
          }

          console.log('✅ 用户确认访问，允许导航')
          next({
            path: LOGIN_PAGE,
            params: {
              redirect: from.path,
            },
          })
          return resolve()
        }).catch((_err) => {
          console.log('❌ 用户取消访问，阻止导航')
          next(false)
          return reject(new Error('用户取消访问'))
        })
      })
    }

    next()
  })
}
