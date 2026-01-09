// pages.config.ts
import { defineUniPages } from '@uni-helper/vite-plugin-uni-pages'

export default defineUniPages({
  pages: [],
  globalStyle: {
    navigationBarTextStyle: 'black',
    navigationBarTitleText: 'uni-app',
    navigationBarBackgroundColor: '#FFFFFF',
    backgroundColor: '#F8F8F8',
  },
  preloadRule: {
    'pages/home/home': {
      network: 'all',
      packages: ['packages/sub-static'],
    },
  },
})
