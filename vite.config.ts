import type { Plugin } from 'vite'
import path from 'node:path'
import process from 'node:process'
import Uni from '@uni-helper/plugin-uni'
import UniHelperComponents from '@uni-helper/vite-plugin-uni-components'
import { WotV2Resolver } from '@uni-helper/vite-plugin-uni-components/resolvers'
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

export interface UnocssInjectOptions {
  srcDir?: string
  mainEntry?: string
}

function UnocssInject({ srcDir, mainEntry = 'main.ts' }: UnocssInjectOptions = {}): Plugin {
  const sourceRoot = srcDir ?? path.join(process.cwd(), 'src')
  const mainEntryFile = path.normalize(path.join(sourceRoot, mainEntry))

  const CssFileReg = /\.css$/
  const StyleExtMap = new Map(Object.entries({
    'mp-weixin': '.wxss',
    'mp-alipay': '.acss',
  }))

  return {
    name: 'vite-uni-plugin-unocss-inject',
    transform: {
      order: 'post',
      handler(code, id) {
        // 关键：对当前id也normalize再对比，解决win/mac/linux分隔符差异
        if (path.normalize(id) === mainEntryFile) {
          return `\nimport "virtual:uno.css";\n${code}`
        }
      },
    },
    generateBundle: {
      order: 'post',
      handler(_, bundle) {
        Object.keys(bundle).forEach((key) => {
          const { UNI_PLATFORM } = process.env
          const { type, fileName } = bundle[key]

          if (type === 'asset' && CssFileReg.test(fileName)) {
            bundle[key].fileName = fileName.replace(CssFileReg, StyleExtMap.get(UNI_PLATFORM!)!)
          }
        })
      },
    },
  } as Plugin
}

// https://vitejs.dev/config/
export default defineConfig(async ({ command, mode }) => {
  const { UNI_PLATFORM } = process.env
  const isBuild = process.env.NODE_ENV === 'production'

  console.log('[vite] :>> ', command, mode, process.env.NODE_ENV)

  return {
    base: './',
    optimizeDeps: {
      exclude: isBuild ? [] : ['@wot-ui/ui', 'uni-echarts'],
    },
    resolve: {
      alias: {
        // 原有基础别名（保留，不影响其他场景）
        '@/*': path.resolve(__dirname, 'src'),
        '@packages': path.resolve(__dirname, 'src/packages'),
        // 核心优化：直接映射到高频深层目录，跳过sub-xxx中间层级
        '@sub-static': path.resolve(__dirname, 'src/packages/sub-static/_components'), // 直接对应 _components 目录
        '@sub-vendor': path.resolve(__dirname, 'src/packages/sub-vendor/_components'), // 直接对应 _components 目录
      },
    },
    plugins: [
      // https://github.com/uni-helper/vite-plugin-uni-manifest
      UniHelperManifest({ insertFinalNewline: true }),
      // https://github.com/uni-helper/vite-plugin-uni-pages
      UniHelperPages({
        subPackages: [
          'src/packages/sub-static',
          'src/packages/sub-vendor',
        ],
        dts: 'types/_uni-pages.d.ts',
        exclude: [
          '**/_*/**/*', // pages文件下 _ 排除的页面
        ],
      }),
      // https://github.com/uni-helper/vite-plugin-uni-layouts
      UniHelperLayouts(),
      // https://github.com/uni-helper/vite-plugin-uni-components
      UniHelperComponents({
        dts: 'types/_components.d.ts',
        resolvers: [WotV2Resolver()],
      }),
      // https://github.com/uni-ku/root
      UniKuRoot(),
      // https://uni-echarts.xiaohe.ink
      UniEcharts(),
      // 修复 [plugin:unocss:global:build:scan]  [unocss] "virtual:uno.css" is being imported multiple times in different files
      UnocssInject(),
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
          {
            from: '@wot-ui/router',
            imports: ['useRoute'],
          },
          // api 只导出这两个
          {
            from: '@/api/_gen',
            imports: ['Apis'],
          },
          {
            from: '@/api/core/instance',
            imports: ['alovaInstance'],
          },
        ],
        dts: 'types/_auto-import.d.ts',
        dirs: ['src/hooks'], // 自动导入 hooks
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
          additionalData: '@use "@/styles/utils.scss" as *;',
          api: 'modern-compiler',
          silenceDeprecations: ['legacy-js-api'],
        },
      },
    },
  }
})
