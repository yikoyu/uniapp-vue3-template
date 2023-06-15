// / <reference types="vite/client" />

declare module '*.vue' {
  import { DefineComponent } from 'vue'
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/ban-types
  const component: DefineComponent<{}, {}, any>
  export default component
}

declare module '*.png'
declare module '*.jpg'
declare module '*.svg'

interface ViteEnv {
  /**
   * @description 接口地址
   * @type {string}
   * @memberof ViteEnv
   */
  readonly VITE_API_HOST: string
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface ImportMetaEnv extends ViteEnv {}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
