import { createSSRApp } from 'vue'

import { createPinia } from '@/stores/plugins/install'
import App from './App.vue'
import { createPlugins } from './plugins'
import 'virtual:uno.css'

export function createApp() {
  const app = createSSRApp(App)
  app.use(createPinia)
  createPlugins(app)

  return {
    app,
  }
}
