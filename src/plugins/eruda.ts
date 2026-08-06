import type { App } from 'vue'
import { isH5 } from '@uni-helper/uni-env'

export function createEruda(app: App) {
  // 仅 H5 且通过环境变量 VITE_ENABLE_H5_ERUDA 显式开启时注入 CDN 版 eruda
  if (import.meta.env.VITE_ENABLE_H5_ERUDA === 'true' && isH5) {
    const script = document.createElement('script')
    script.src = 'https://cdn.jsdelivr.net/npm/eruda'
    script.onload = () => {
      // 初始化
      (window as any).eruda.init()
    }
    document.body.appendChild(script)
  }
}
