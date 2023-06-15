import { createSSRApp } from 'vue'
import App from './App.vue'

import { createPinia, Pinia } from '@/stores/plugins/install'

export function createApp() {
  const app = createSSRApp(App)
  app.use(createPinia)

  return {
    app,
    Pinia
  }
}
