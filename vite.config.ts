import process from 'node:process'
import Uni from '@uni-helper/plugin-uni'
import UniHelperComponents from '@uni-helper/vite-plugin-uni-components'
import { WotResolver } from '@uni-helper/vite-plugin-uni-components/resolvers'
import UniHelperLayouts from '@uni-helper/vite-plugin-uni-layouts'
import UniHelperManifest from '@uni-helper/vite-plugin-uni-manifest'
import UniHelperPages from '@uni-helper/vite-plugin-uni-pages'
import UniKuBundleOptimizer from '@uni-ku/bundle-optimizer'
import UniKuRoot from '@uni-ku/root'

import { visualizer } from 'rollup-plugin-visualizer'
import { UniEcharts } from 'uni-echarts/vite'

import UnoCSS from 'unocss/vite'
import AutoImport from 'unplugin-auto-import/vite'

import { defineConfig } from 'vite'

// https://vitejs.dev/config/
export default defineConfig(async ({ command, mode }) => {
  const { UNI_PLATFORM } = process.env
  const isBuild = process.env.NODE_ENV === 'production'

  console.log('[vite] :>> ', command, mode, process.env.NODE_ENV)

  return {
    base: './',
    optimizeDeps: {
      exclude: isBuild ? [] : ['wot-design-uni', 'uni-echarts'],
    },
    plugins: [
      // https://github.com/uni-helper/vite-plugin-uni-manifest
      UniHelperManifest(),
      // https://github.com/uni-helper/vite-plugin-uni-pages
      UniHelperPages({
        subPackages: ['src/pages-echarts'],
        dts: 'types/_uni-pages.d.ts',
        exclude: ['**/_*/**/*'], // pages文件下 _ 排除的页面
      }),
      // https://github.com/uni-helper/vite-plugin-uni-layouts
      UniHelperLayouts(),
      // https://github.com/uni-helper/vite-plugin-uni-components
      UniHelperComponents({
        dts: 'types/_components.d.ts',
        resolvers: [WotResolver()],
      }),
      // https://github.com/uni-ku/root
      UniKuRoot(),
      // https://uni-echarts.xiaohe.ink
      UniEcharts(),
      // https://uni-helper.cn/plugin-uni
      Uni(),
      /**
       * 分包优化、模块异步跨包调用、组件异步跨包引用
       * @see https://github.com/uni-ku/bundle-optimizer
       */
      UniKuBundleOptimizer({
        enable: {
          'optimization': true,
          'async-import': true,
          'async-component': true,
        },
        dts: {
          'base': 'types',
          'async-import': {
            name: '_async-import.d.ts',
          },
          'async-component': {
            name: '_async-component.d.ts',
          },
        },
        logger: isBuild,
      }),
      // https://github.com/antfu/unplugin-auto-import
      AutoImport({
        imports: [
          'vue',
          'uni-app',
          {
            from: 'alova/client',
            imports: ['usePagination', 'useRequest', 'useWatcher', 'useForm'],
          },
        ],
        dts: 'types/_auto-import.d.ts',
        dirs: ['src/hooks', 'src/api'], // 自动导入 hooks
        vueTemplate: true, // default false
      }),
      // https://github.com/antfu/unocss
      // see unocss.config.ts for config
      UnoCSS(),
      // 打包分析插件，h5 + 生产环境才弹出
      UNI_PLATFORM === 'h5'
      && isBuild
      && visualizer({
        gzipSize: true,
        brotliSize: true,
        emitFile: false,
        open: true,
        filename: './node_modules/.cache/visualizer/stats.html',
      }),
    ],
    css: {
      // css预处理器
      preprocessorOptions: {
        scss: {
          // 引入 mixin.scss 这样就可以在全局中使用 mixin.scss中预定义的变量了
          // 给导入的路径最后加上 ;
          additionalData: '@import "@/styles/utils.scss";',
        },
      },
    },
  }
})
