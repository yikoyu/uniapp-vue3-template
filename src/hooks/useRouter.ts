import qs from 'qs'

/**
 * 路由操作的封装
 *
 * UNIAPP 官方文档 @see https://uniapp.dcloud.net.cn/api/router.html
 */
export default function useRouter() {
  function _url<T extends Recordable = Recordable>(url: NavigateToOptions['url'], query?: T) {
    const hasQuery = Object.keys(query ?? {}).length > 0
    return hasQuery ? `${url}?${qs.stringify(query, { encode: false })}` : url
  }

  /**
   * 保留当前页面，跳转到应用内的某个页面
   */
  function navigate<T extends Recordable = Recordable>(
    url: NavigateToOptions['url'],
    query?: T,
    options?: Omit<UniApp.NavigateToOptions, 'url'>,
  ) {
    uni.navigateTo({ url: _url(url, query), ...options })
  }

  /**
   * 保留当前页面，跳转到应用内的某个页面
   */
  function redirect<T extends Recordable = Recordable>(
    url: NavigateToOptions['url'],
    query?: T,
    options?: Omit<UniApp.RedirectToOptions, 'url'>,
  ) {
    uni.redirectTo({ url: _url(url, query), ...options })
  }

  /**
   * 关闭所有页面，打开到应用内的某个页面
   */
  function reLaunch<T extends Recordable = Recordable>(
    url: NavigateToOptions['url'],
    query?: T,
    options?: Omit<UniApp.ReLaunchOptions, 'url'>,
  ) {
    uni.reLaunch({ url: _url(url, query), ...options })
  }

  /**
   * 跳转到 tabBar 页面，并关闭其他所有非 tabBar 页面
   */
  function switchTab<T extends Recordable = Recordable>(
    url: NavigateToOptions['url'],
    query?: T,
    options?: Omit<UniApp.SwitchTabOptions, 'url'>,
  ) {
    uni.switchTab({ url: _url(url, query), ...options })
  }

  /**
   * 关闭当前页面，返回上一页面或多级页面
   */
  function back(delta?: number, options?: Omit<UniApp.NavigateBackOptions, 'delta'>) {
    uni.navigateBack({ delta, ...options })
  }

  return {
    navigate,
    redirect,
    reLaunch,
    switchTab,
    back,
  }
}
