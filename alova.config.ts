import type { Config } from '@alova/wormhole'

export default <Config>{
  generator: [
    {
      // OpenAPI 文档地址（支持本地文件或在线地址）
      input: 'openapi/openapi.json',

      // 文档平台类型
      platform: 'swagger',

      // 生成代码的输出目录
      output: 'src/api/_gen',

      // 响应数据的媒体类型
      responseMediaType: 'application/json',

      // 请求体数据的媒体类型
      bodyMediaType: 'application/json',

      // 生成的 API 版本
      version: 3,

      // 生成代码类型
      type: 'typescript',

      // 全局 API 名称
      global: 'Apis',

      // API 处理函数
      handleApi: (apiDescriptor) => {
        // 过滤掉已废弃的 API
        if (apiDescriptor.deprecated) {
          return undefined
        }
        return apiDescriptor
      },
    },
  ],

  // 自动更新配置
  autoUpdate: {
    // 编辑器启动时更新
    launchEditor: true,
    // 每5分钟检查更新
    interval: 5 * 60 * 1000,
  },
}
