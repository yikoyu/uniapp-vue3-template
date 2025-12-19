import { reactive, ref } from 'vue'

/**
 * 权限引导弹框静态类（补充 Android 专属引导）
 */
class PermissionModal {
  // 1. 系统级蓝牙开关未开启（Android）
  static bluetoothSystemSwitchModal() {
    return new Promise<never>((_, reject) => {
      wx.showModal({
        title: '蓝牙开关未开启',
        content: 'Android 系统蓝牙开关未开启，请前往系统设置开启蓝牙后重试',
        confirmText: '去设置',
        cancelText: '取消',
        success: (res) => {
          if (res.confirm)
            wx.openAppAuthorizeSetting() // 引导到系统设置
          reject(new Error('系统蓝牙开关未开启，无法使用蓝牙功能'))
        },
        fail: err => reject(new Error(`弹框调用失败：${err.errMsg}`)),
      })
    })
  }

  // 2. 系统级定位开关未开启（Android）
  static locationSystemSwitchModal() {
    return new Promise<never>((_, reject) => {
      wx.showModal({
        title: '定位开关未开启',
        content: 'Android 系统定位开关未开启，请前往系统设置开启定位后重试',
        confirmText: '去设置',
        cancelText: '取消',
        success: (res) => {
          if (res.confirm)
            wx.openAppAuthorizeSetting()
          reject(new Error('系统定位开关未开启，无法使用蓝牙功能'))
        },
        fail: err => reject(new Error(`弹框调用失败：${err.errMsg}`)),
      })
    })
  }

  // 3. APP 级蓝牙权限未授权
  static bluetoothAppAuthorizeModal() {
    return new Promise<never>((_, reject) => {
      wx.showModal({
        title: '微信 APP 级蓝牙权限未授权',
        content: '需要授予微信系统级蓝牙权限才能使用相关功能，请前往微信设置开启',
        confirmText: '去设置',
        cancelText: '取消',
        success: (res) => {
          if (res.confirm)
            wx.openAppAuthorizeSetting()
          reject(new Error('微信系统级蓝牙权限未授权，无法使用蓝牙功能'))
        },
        fail: err => reject(new Error(`弹框调用失败：${err.errMsg}`)),
      })
    })
  }

  // 4. APP 级定位权限未授权（Android）
  static locationAppAuthorizeModal() {
    return new Promise<never>((_, reject) => {
      wx.showModal({
        title: '微信 APP 定位权限未授权',
        content: 'Android 系统需要微信定位权限来辅助蓝牙功能，请前往微信权限设置开启',
        confirmText: '去设置',
        cancelText: '取消',
        success: (res) => {
          if (res.confirm)
            wx.openAppAuthorizeSetting()
          reject(new Error('微信 APP 级定位权限未授权，无法使用蓝牙功能'))
        },
        fail: err => reject(new Error(`弹框调用失败：${err.errMsg}`)),
      })
    })
  }

  // 5. 小程序蓝牙权限未授权
  static bluetoothScopeModal(isIOS: boolean) {
    return new Promise<never>((_, reject) => {
      wx.showModal({
        title: '蓝牙权限未授权',
        content: `${isIOS ? 'iOS' : '安卓'}系统需要蓝牙权限才能使用相关功能，请前往小程序设置开启`,
        confirmText: '去设置',
        cancelText: '取消',
        success: (res) => {
          if (res.confirm)
            wx.openSetting()
          reject(new Error('蓝牙权限未授权，无法使用蓝牙功能'))
        },
        fail: err => reject(new Error(`弹框调用失败：${err.errMsg}`)),
      })
    })
  }

  // 6. 小程序定位权限未授权（Android）
  static locationScopeModal() {
    return new Promise<never>((_, reject) => {
      wx.showModal({
        title: '定位权限未授权',
        content: '安卓系统需要定位权限才能使用蓝牙功能，请前往小程序设置开启',
        confirmText: '去设置',
        cancelText: '取消',
        success: (res) => {
          if (res.confirm)
            wx.openSetting()
          reject(new Error('安卓定位权限未授权，无法使用蓝牙功能'))
        },
        fail: err => reject(new Error(`弹框调用失败：${err.errMsg}`)),
      })
    })
  }
}

/**
 * 权限状态类型定义（补充 Android 专属状态）
 */
interface PermissionState {
  // 基础信息
  isIOS: boolean
  wxVersion: string
  // 核心权限
  bluetoothScopeAuth: boolean // 小程序蓝牙权限
  locationScopeAuth: boolean // 小程序定位权限
  bluetoothSystemAuth: WechatMiniprogram.AppAuthorizeSetting['bluetoothAuthorized'] // 微信系统级蓝牙权限
  // Android 专属状态
  locationAppAuthorized: WechatMiniprogram.AppAuthorizeSetting['locationAuthorized'] // APP 级定位权限
  bluetoothSystemSwitch: boolean // 系统级蓝牙开关（Android）
  locationSystemSwitch: boolean // 系统级定位开关（Android）
}

/**
 * 蓝牙权限检查 Hook
 * 1. 先检查 系统级别 开关：蓝牙开关、定位开关(android)
 * 2. 再检查 APP级别 授权：附近设备授权、定位授权(android)
 * 3. 再检查 小程序级别 权限：蓝牙权限、定位权限(android)
 */
export function useBluetoothPermission() {
  // 响应式状态（补充 Android 专属）
  const permissionState = reactive<PermissionState>({
    isIOS: false,
    wxVersion: '',
    bluetoothScopeAuth: false,
    locationScopeAuth: false,
    bluetoothSystemAuth: 'not determined',
    locationAppAuthorized: 'not determined', // APP 级定位权限
    bluetoothSystemSwitch: false, // 系统蓝牙开关
    locationSystemSwitch: false, // 系统定位开关
  })

  const errorMsg = ref<string>('')

  // 1. 同步初始化系统/微信信息
  const initEnvInfo = () => {
    try {
      const deviceInfo = wx.getDeviceInfo()
      console.log('initEnvInfo [getDeviceInfo] :>> ', deviceInfo)
      permissionState.isIOS = deviceInfo.system?.toLowerCase().includes('ios') || deviceInfo.platform === 'ios'

      const appBaseInfo = wx.getAppBaseInfo()
      console.log('initEnvInfo [getAppBaseInfo] :>> ', appBaseInfo)
      permissionState.wxVersion = appBaseInfo.SDKVersion || ''
    }
    catch (err) {
      const error = new Error(`初始化系统信息失败：${(err as Error).message}`)
      errorMsg.value = error.message
      throw error
    }
  }

  // 2. 系统硬件开关检查
  const checkSystemHardwareSwitches = () => {
    return new Promise<void>((resolve, reject) => {
      if (permissionState.isIOS) {
        resolve()
        return
      }

      try {
        const systemSetting = wx.getSystemSetting()
        // 同步更新两个开关状态
        permissionState.bluetoothSystemSwitch = systemSetting.bluetoothEnabled || false
        permissionState.locationSystemSwitch = systemSetting.locationEnabled || false

        // 统一校验
        const errors: string[] = []
        if (!permissionState.bluetoothSystemSwitch)
          errors.push('系统蓝牙开关未开启')
        if (!permissionState.locationSystemSwitch)
          errors.push('系统定位开关未开启')

        if (errors.length) {
          const err = new Error(errors.join('；'))
          errorMsg.value = err.message
          reject(err)
          return
        }

        resolve()
      }
      catch (err) {
        const error = new Error(`检查系统硬件开关失败：${(err as Error).message}`)
        errorMsg.value = error.message
        reject(error)
      }
    })
  }

  // ========== 合并后的核心方法：检查 APP 级权限（蓝牙+定位） ==========
  /**
   * 检查/刷新微信 APP 级权限（蓝牙+定位）
   * @param needCheck 是否校验权限（true=未授权抛错，false=仅刷新状态不抛错）
   */
  const checkAppSwitches = (needCheck = true) => {
    try {
      // 同步获取微信 APP 级授权设置
      const appAuthorizeSetting = wx.getAppAuthorizeSetting()

      // 1. 更新蓝牙系统级权限（全平台）
      permissionState.bluetoothSystemAuth = appAuthorizeSetting.bluetoothAuthorized

      // 2. 更新定位 APP 级权限（仅 Android）
      if (!permissionState.isIOS) {
        permissionState.locationAppAuthorized = appAuthorizeSetting.locationAuthorized
      }

      // 校验模式：未授权则抛错
      if (needCheck) {
        // 校验蓝牙权限
        if (permissionState.bluetoothSystemAuth !== 'authorized') {
          throw new Error('APP 级蓝牙权限未授权')
        }
        // 校验定位权限（仅 Android）
        if (!permissionState.isIOS && permissionState.locationAppAuthorized !== 'authorized') {
          throw new Error('APP 级定位权限未授权')
        }
      }
    }
    catch (err) {
      const error = new Error(`检查 APP 级权限失败：${(err as Error).message}`)
      errorMsg.value = error.message
      // 仅校验模式下抛错，刷新模式下不抛错
      if (needCheck)
        throw error
    }
  }

  // 3. 刷新小程序内权限（异步）
  const refreshScopePermission = () => {
    return new Promise<void>((resolve, reject) => {
      wx.getSetting({
        success: (res) => {
          permissionState.bluetoothScopeAuth = !!res.authSetting['scope.bluetooth']
          if (!permissionState.isIOS) {
            permissionState.locationScopeAuth = !!res.authSetting['scope.userLocation']
          }
          resolve()
        },
        fail: (err) => {
          const error = new Error(`获取小程序权限失败：${err.errMsg}`)
          errorMsg.value = error.message
          reject(error)
        },
      })
    })
  }

  // 4. 核心权限检查（完整链路：系统开关→APP 权限→系统级权限→小程序权限）
  const checkBluetoothPermission = async () => {
    try {
      initEnvInfo()
      errorMsg.value = ''

      // ========== 第一步：检查 Android 系统级开关 ==========
      await checkSystemHardwareSwitches()
      if (!permissionState.bluetoothSystemSwitch) {
        await PermissionModal.bluetoothSystemSwitchModal()
      }
      if (!permissionState.locationSystemSwitch) {
        await PermissionModal.locationSystemSwitchModal()
      }

      // ========== 第二步：检查 APP 级权限（合并后的方法，校验模式） ==========
      checkAppSwitches(true) // 传入 true 表示需要校验，未授权抛错
      if (permissionState.locationAppAuthorized !== 'authorized') {
        await PermissionModal.locationAppAuthorizeModal()
      }
      if (permissionState.bluetoothSystemAuth !== 'authorized') {
        await PermissionModal.bluetoothAppAuthorizeModal()
      }

      // ========== 第三步：检查小程序内权限 ==========
      await refreshScopePermission()
      // 小程序蓝牙权限
      if (!permissionState.bluetoothScopeAuth) {
        await PermissionModal.bluetoothScopeModal(permissionState.isIOS)
      }
      // 小程序定位权限（Android）
      if (!permissionState.isIOS && !permissionState.locationScopeAuth) {
        await PermissionModal.locationScopeModal()
      }

      return true
    }
    catch (err) {
      const error = err as Error
      errorMsg.value = error.message
      // 针对 Android 专属错误，触发对应弹框
      if (error.message.includes('系统蓝牙开关未开启')) {
        await PermissionModal.bluetoothSystemSwitchModal()
      }
      else if (error.message.includes('系统定位开关未开启')) {
        await PermissionModal.locationSystemSwitchModal()
      }
      else if (error.message.includes('APP 级定位权限未授权')) {
        await PermissionModal.locationAppAuthorizeModal()
      }
      else if (error.message.includes('APP 级蓝牙权限未授权')) {
        await PermissionModal.bluetoothAppAuthorizeModal()
      }
      throw error
    }
  }

  // 5. 刷新所有权限状态（无引导）
  const refreshAllPermission = async () => {
    try {
      initEnvInfo()
      // 刷新 APP 级权限（合并后的方法，仅刷新不校验）
      checkAppSwitches(false) // 传入 false 表示仅刷新状态，不抛错
      await refreshScopePermission()
      // 同步刷新 Android 专属状态
      if (!permissionState.isIOS) {
        // 蓝牙开关、定位开关（异步，catch 不阻断）
        await checkSystemHardwareSwitches().catch(() => {})
      }
      return true
    }
    catch (err) {
      errorMsg.value = (err as Error).message
      throw err
    }
  }

  return {
    permissionState,
    errorMsg,
    checkBluetoothPermission,
    refreshAllPermission,
  }
}
