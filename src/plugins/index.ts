import type { App } from 'vue'
import { createEruda } from './eruda'

export function createPlugins(app: App) {
  createEruda(app)
}
