// / <reference types="vite/client" />

declare module '*.vue' {
  import type { DefineComponent } from 'vue'

  // eslint-disable-next-line ts/no-empty-object-type
  const component: DefineComponent<{}, {}, any>
  export default component
}

declare module '*.png'
declare module '*.jpg'
declare module '*.svg'

interface ViteEnv {
  /**
   * @description 微信小程序 appid
   * @type {string}
   * @memberof ViteEnv
   */
  readonly VITE_WECHAT_APPID: string

  /**
   * @description 接口地址
   * @type {string}
   * @memberof ViteEnv
   */
  readonly VITE_API_HOST: string

  /**
   * @description 接口 header.clientid
   * @type {string}
   * @memberof ViteEnv
   */
  readonly VITE_API_CLIENT_ID: string

  /**
   * @description 小程序名称
   * @type {string}
   * @memberof ViteEnv
   */
  readonly VITE_APP_NAME: string

  /**
   * @description 用户协议
   * @type {string}
   * @memberof ViteEnv
   */
  readonly VITE_USER_SERVICE_AGREEMENT_LINK: string

  /**
   * @description 隐私条款
   * @type {string}
   * @memberof ViteEnv
   */
  readonly VITE_PRIVACY_AGREEMENT_LINK: string
}

interface ImportMetaEnv extends ViteEnv {}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
