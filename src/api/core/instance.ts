import type { uniappRequestAdapter } from '@alova/adapter-uniapp'
import AdapterUniapp from '@alova/adapter-uniapp'
import { createAlova } from 'alova'
import { createServerTokenAuthentication } from 'alova/client'
import vueHook from 'alova/vue'

import mockAdapter from '../mock/mockAdapter'
import { AlovaHandler, AlovaTokenAuthHandler } from './handlers'

/**
 * 创建请求实例
 */
const { onAuthRequired, onResponseRefreshToken } = createServerTokenAuthentication<
  typeof vueHook,
  typeof uniappRequestAdapter
>({
  refreshTokenOnSuccess: {
    isExpired: AlovaTokenAuthHandler.isExpiredOnSuccess,

    handler: AlovaTokenAuthHandler.handlerOnSuccess,
  },
})

export const alovaInstance = createAlova({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 30 * 1000,
  // 设置为null即可全局关闭全部请求缓存
  cacheFor: null,

  // 使用 uni-app 适配器，支持 Mock 数据
  ...AdapterUniapp({
    mockRequest: mockAdapter,
  }),

  // Vue 3 状态钩子
  statesHook: vueHook,

  // 全局请求拦截器
  beforeRequest: onAuthRequired(AlovaHandler.beforeRequest),

  // 全局响应拦截器
  responded: onResponseRefreshToken({
    onSuccess: AlovaHandler.respondedSuccess,
    onError: AlovaHandler.respondedError,
    onComplete: async () => {
      // Any cleanup or logging can be done here
    },
  }),
})
