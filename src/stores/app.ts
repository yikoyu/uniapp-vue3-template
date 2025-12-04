import { defineStore } from 'pinia'

import { getTimestamp } from '@/utils/dateUtil'
import { toast } from '@/utils/toast'

interface IState {
  loginTimestamp: number
  accessToken: string
  accessTokenExpire: number
  refreshToken: string
  refreshTokenExpire: number
  isLastLoginWechat: boolean
  user: Recordable
}

export const useAppStore = defineStore('app', {
  persist: {
    key: 'pinia-app',
    pick: [
      'loginTimestamp',
      'accessToken',
      'accessTokenExpire',
      'refreshToken',
      'refreshTokenExpire',
      'isLastLoginWechat',
    ],
  },
  state: (): IState => ({
    loginTimestamp: -1,
    accessToken: '',
    accessTokenExpire: -1,
    refreshToken: '',
    refreshTokenExpire: -1,
    isLastLoginWechat: false,
    user: {},
  }),

  actions: {
    setToken(data: Recordable) {
      this.loginTimestamp = getTimestamp()
      this.accessToken = data.accessToken
      this.accessTokenExpire = data.accessTokenExpire
      this.refreshToken = data.refreshToken
      this.refreshTokenExpire = data.refreshTokenExpire
    },

    resetToken() {
      return new Promise<void>((resolve, reject) => {
        this.loginTimestamp = -1
        this.accessToken = ''
        this.accessTokenExpire = -1
        this.refreshToken = ''
        this.refreshTokenExpire = 1
        this.user = {}
        resolve()
      })
    },

    wechatLogin(phoneCode: string) {
      return new Promise<string | void>((resolve, reject) => {
        toast.loading('登录中...')

        this.resetToken()

        uni.login({
          provider: 'weixin',
          onlyAuthorize: true,
        })
          .then(({ code }) => {
            return Apis.general.wxAuthorizeLoginCodeUsingPOST({
              meta: { authRole: null },
              data: { loginCode: code, phoneCode },
            })
          })
          .then((res) => {
            // 登录成功
            this.setToken(res.data as Recordable)
            this.isLastLoginWechat = true
            toast.hideLoading()
            toast.success('登录成功')
            resolve(this.accessToken)
          })
          .catch((err) => {
            reject(err)
          })
      })
    },

    doWxLogin() {
      return new Promise<string | void>((resolve, reject) => {
        if (this.isLogin) {
          resolve(this.accessToken)
          return
        }

        if (!this.isLastLoginWechat) {
          // eslint-disable-next-line prefer-promise-reject-errors
          reject({ statusCode: -1, msg: '最后一次登录不是微信，请使用微信登录' })
          return
        }

        uni.login({
          provider: 'weixin',
          onlyAuthorize: true,
        })
          .then(({ code }) => {
            return Apis.general.doWxLoginUsingPOST({
              meta: { authRole: null },
              data: { code },
            })
          })
          .then((res) => {
            // 登录成功
            this.setToken(res.data as Recordable)
            this.isLastLoginWechat = true
            toast.hideLoading()
            toast.success('登录成功')
            resolve(this.accessToken)
          })
          .catch((err) => {
            const isToLogin
              = err.statusCode === 497 // 无微信登录信息
                || err.statusCode === 498 // 账号注销中
            if (isToLogin) {
              this.resetToken()
              useRouter().reLaunch('/pages/login/login')
              return reject(new Error('快捷登录失败，请重试'))
            }

            // 登录失败处理
            if (err.data.status !== 200) {
              this.resetToken()
              useRouter().reLaunch('/pages/login/login')
              return reject(new Error(err.data.msg ?? '快捷登录失败，请重试'))
            }

            return reject(err)
          })
      })
    },

    mLogin(phone: string, verificationCode: string) {
      return new Promise<string | void>((resolve, reject) => {
        toast.loading('登录中...')

        Apis.general.mLoginUsingPOST({
          meta: { authRole: null },
          data: {
            phone,
            verificationCode: Number(verificationCode),
          },
        })
          .then((res) => {
            // 登录成功
            this.setToken(res.data as Recordable)
            this.isLastLoginWechat = false
            toast.hideLoading()
            toast.success('登录成功')
            resolve(this.accessToken)
          })
          .catch((err) => {
            reject(err)
          })
      })
    },

    refreshTokenLogin() {
      return new Promise<string | void>((resolve, reject) => {
        Apis.general.refreshTokenUsingPOST({
          meta: { authRole: 'refreshToken' },
          data: { refreshToken: this.refreshToken },
        })
          .then((res) => {
            // 登录成功
            this.setToken(res.data as Recordable)
            resolve(this.accessToken)
          })
          .catch((err) => {
            reject(err)
          })
      })
    },

    logout() {
      return new Promise<void>((resolve, reject) => {
        toast.loading('正在退出...')

        Apis.general.logoutUsingGET({
          meta: { authRole: null },
        })
          .then(() => {
            this.resetToken()
            this.isLastLoginWechat = false
            useRouter().reLaunch('/pages/login/login')
            toast.hideLoading()
            resolve()
          })
          .catch((_err) => {
            this.resetToken()
            this.isLastLoginWechat = false
            useRouter().reLaunch('/pages/login/login')
            toast.hideLoading()
            resolve()
          })
      })
    },

    getLoginUserInfo(regain = false) {
      return new Promise<IState['user'] | null>((resolve, reject) => {
        const hasUserInfo = Object.keys(this.user).length > 0
        if (hasUserInfo && !regain) {
          resolve(this.user)
          return
        }

        Apis.general.getLoginUserUsingGET()
          .then((res) => {
            this.user = (res.data || {}) as Recordable
            resolve(this.user)
          })
          .catch((err) => {
            reject(err)
          })
      })
    },
  },

  getters: {
    isLogin(state) {
      const expireTimestamp = state.loginTimestamp + state.accessTokenExpire
      const now = getTimestamp()
      console.log('expireTimestamp :>> ', expireTimestamp)
      return !!(state.accessToken && expireTimestamp > now)
    },

    hasToken(state) {
      return state.accessToken
    },
  },
})
