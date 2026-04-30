import type { App } from 'vue'
import { createVConsole } from './vconsole'

export function createPlugins(app: App) {
  createVConsole(app)
}
