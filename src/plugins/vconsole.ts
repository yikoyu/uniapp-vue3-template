import type { App } from 'vue'
import { isH5 } from '@uni-helper/uni-env'

export function createVConsole(app: App) {
  // 仅 Vite 开发环境注入 CDN 版 vConsole
  if (import.meta.env.DEV && isH5) {
    const script = document.createElement('script')
    script.src = 'https://cdn.jsdelivr.net/npm/vconsole@latest/dist/vconsole.min.js'
    script.onload = () => {
      // 初始化
      // eslint-disable-next-line no-new
      new (window as any).VConsole()
    }
    document.body.appendChild(script)
  }
}
