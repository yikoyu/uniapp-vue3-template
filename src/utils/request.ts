import Request, { type HttpRequestConfig, type HttpResponse, type HttpError } from 'luch-request'

class RequestInstance {
  instance: Request

  constructor(config: HttpRequestConfig) {
    this.instance = new Request(config)

    this.instance.interceptors.request.use(this.request)

    this.instance.interceptors.response.use(this.response, this.error)
  }

  private error(err: HttpError) {
    console.log('HTTP拦截器报错 :>> ', err)
    const errorTitles: Record<number, string> = {
      11: '无权跨域,请联系管理员!',
      12: '网络出错,请检测当前网络!',
      13: '请求超时,请稍侯再试!',
      14: '解码失败,请联系管理员!',
      19: 'HTTP错误,请联系管理员!',
      20: '请求已被停止/服务端限流!'
    }

    const title = errorTitles[err.statusCode ?? -1]
    title && uni.showToast({ title, icon: 'error' })

    return Promise.reject(err)
  }

  private request(config: HttpRequestConfig) {
    // 携带 token 需要根据业务修改
    // if (config.header && user.token && !isWhiteList(config.url)) {
    //   config.header['token'] = user.token // 让每个请求携带自定义 token
    // }

    return config
  }

  private response(response: HttpResponse) {
    // 这里自定义 token 过期和刷新逻辑

    return response
  }
}

const { instance: request } = new RequestInstance({
  baseURL: import.meta.env.VITE_API_HOST,
  timeout: 30 * 1000,
  method: 'POST',
  dataType: 'json',
  withCredentials: true,
  header: {
    'content-type': 'application/json' // 默认值
  }
})

export { request }
