import type { App } from 'vue'
import { createEruda } from './eruda'
import { createRouter } from './router'

export function createPlugins(app: App) {
  createEruda(app)
  createRouter(app)
}
