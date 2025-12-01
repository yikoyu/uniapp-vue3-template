import type { Method } from 'alova'
import { useAppStore } from '@/stores/app'
import { uniNav } from '@/utils'

// Custom error class for API errors
export class ApiError extends Error {
  status: number
  data?: any

  constructor(message: string, status: number, data?: any) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.data = data
  }
}

// Define a type for the expected API response structure
interface ApiResponse {
  status: number
  msg?: string
  data?: any
}

export class AlovaHandler {
  /**
   * Handle beforeRequest
   */
  static beforeRequest(method: Method) {
    const app = useAppStore()

    method.config.headers['Content-Type'] = 'application/json'

    // 判断是否需要登录，可根据业务修改
    // 规则：
    // 1. method.config.meta 不存在 → 默认需要登录
    // 2. method.config.meta 存在时，仅当 authRole 为 null 或 'refreshToken' → 不需要登录
    const needLogin = !method.config.meta
      ? true
      : !(method.config.meta.authRole === null || method.config.meta.authRole === 'refreshToken')

    // 携带 token 需要根据业务修改
    if (needLogin && app.accessToken) {
      method.config.headers.Authorization = `Bearer ${app.accessToken}` // 让每个请求携带自定义 token
    }

    console.log(`[Alova Request] ${method.url} :>>`, method)
  }

  /**
   * Handle responded onSuccess
   */
  static respondedSuccess(
    response: UniApp.RequestSuccessCallbackResult | UniApp.UploadFileSuccessCallbackResult | UniApp.DownloadSuccessData,
    method: Method,
  ) {
    // 这里自定义 token 过期和刷新逻辑
    console.log(`[Alova Response] ${method.url} :>>`, response)

    // Extract requestType from method
    const { config } = method
    const { requestType } = config

    // 处理特殊请求类型（上传/下载）
    if (requestType === 'upload' || requestType === 'download') {
      return response
    }

    // Extract status code and data from UniApp response
    const { statusCode, data } = response as UniNamespace.RequestSuccessCallbackResult

    // 处理401/403错误（如果不是在handleAlovaResponse中处理的）
    if (statusCode === 401 || statusCode === 403) {
    // 如果是未授权错误，清除用户信息并跳转到登录页
      uni.showToast({ title: '登录已过期，请重新登录！', duration: 500, icon: 'none' })
      const timer = setTimeout(() => {
        clearTimeout(timer)
        uniNav.reLaunch('/pages/login/login')
      }, 500)

      throw new ApiError('登录已过期，请重新登录！', statusCode, data)
    }

    const json = data as ApiResponse

    // Handle HTTP error status codes
    if (statusCode >= 400) {
      uni.showToast({ title: json.msg || '发生意外错误', icon: 'none' })
      throw new ApiError(`Request failed with status: ${statusCode}`, statusCode, data)
    }

    // 业务代码错误
    if (json.status !== 200) {
      uni.showToast({ title: json.msg || '发生意外错误', icon: 'none' })
      throw new ApiError(json.msg || '发生意外错误', statusCode, data)
    }

    return json
    // return response
  }

  /**
   * Handle responded onError
   */
  static respondedError(error: any, method: Method) {
    // Log error in development
    console.error('[Alova Error]', error, method)

    // 处理401/403错误（如果不是在handleAlovaResponse中处理的）
    if (error instanceof ApiError && (error.status === 401 || error.status === 403)) {
      // 如果是未授权错误，清除用户信息并跳转到登录页
      uni.showToast({ title: '登录已过期，请重新登录！', duration: 500, icon: 'none' })
      const timer = setTimeout(() => {
        clearTimeout(timer)
        uniNav.reLaunch('/pages/login/login')
      }, 500)
      throw new ApiError('登录已过期，请重新登录！', error.status, error.data)
    }

    // Handle different types of errors
    if (error.name === 'NetworkError') {
      uni.showToast({ title: '网络错误，请检查您的网络连接', icon: 'none' })
    }
    else if (error.name === 'TimeoutError') {
      uni.showToast({ title: '请求超时，请重试', icon: 'none' })
    }
    else if (error instanceof ApiError) {
      uni.showToast({ title: error.message || '请求失败', icon: 'none' })
    }
    else {
      uni.showToast({ title: '发生意外错误', icon: 'none' })
    }

    throw error
  }
}

export class AlovaTokenAuthHandler {
  /**
   * Handle refreshTokenOnSuccess.isExpired
   * 响应时触发，可获取到 response 和 method
   * 返回boolean表示token是否过期
   */
  static isExpiredOnSuccess(
    response: UniApp.RequestSuccessCallbackResult | UniApp.UploadFileSuccessCallbackResult | UniApp.DownloadSuccessData,
    method: Method,
  ) {
    // Extract status code and data from UniApp response
    const { statusCode, data } = response as UniNamespace.RequestSuccessCallbackResult

    // 业务过期
    if (
      (data as Recordable).status === 1011008
      || (data as Recordable).status === 1011004) {
      return true
    }

    console.log('[登录过期] :>> ', !useAppStore().isLogin, method.url, response)
    return !useAppStore().isLogin
  }

  /**
   * Handle refreshTokenOnSuccess.handler
   * 刷新token业务处理
   */
  static async handlerOnSuccess(
    response: UniApp.RequestSuccessCallbackResult | UniApp.UploadFileSuccessCallbackResult | UniApp.DownloadSuccessData,
    method: Method,
  ) {
    console.log('[登录过期] 正在刷新token :>> ', method.url)
    try {
      await useAppStore().refreshTokenLogin()
    }
    catch (error) {
      console.log('error :>> ', error)
      if (error instanceof Error) {
        throw error
      }

      throw new Error('[登录过期] 刷新token失败')
    }
  }
}
