import { isMpAlipay } from '@uni-helper/uni-env'

export function useAuthorize() {
  /**
   * 向用户发起授权请求 - 蓝牙
   */
  function bluetooth() {
    return new Promise((resolve, reject) => {
      if (isMpAlipay) {
        my.openBluetoothAdapter({
          success: (res) => {
            my.closeBluetoothAdapter()
            resolve(res)
          },
          fail: err => reject(err),
        })
      }
      else {
        uni.authorize({
          scope: 'scope.bluetooth',
          success: res => resolve(res),
          fail: err => reject(err),
        })
      }
    })
  }

  /**
   * 向用户发起授权请求 - 蓝牙
   */
  function location() {
    return new Promise((resolve, reject) => {
      if (isMpAlipay) {
        my.getLocation({
          success: res => resolve(res),
          fail: err => reject(err),
        })
      }
      else {
        uni.authorize({
          scope: 'scope.userLocation',
          success: res => resolve(res),
          fail: err => reject(err),
        })
      }
    })
  }

  return {
    bluetooth,
    location,
  }
}
