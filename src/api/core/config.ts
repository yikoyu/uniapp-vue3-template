import type { AlovaCustomTypes } from 'alova'

/** 后端 JSON 业务对象 */
export type JsonBody = Record<string, any>

/**
 * 响应内核：配置 + 识别逻辑
 * 换新后端时只需改下方案件区
 * 识别仅按配置字段名"读取"，不会改写后端字段
 */
export class ApiResponseConfig {
  // ================= 配置区 =================
  /** 业务成功码集合 */
  static successCodes: number[] = [200]
  /** 响应状态字段名 */
  static statusField = 'status'
  /** 响应消息字段名 */
  static messageField = 'msg'
  /** 响应数据字段名 */
  static dataField = 'data'
  /** HTTP 鉴权失效状态码 */
  static authStatusCodes: number[] = [401, 403]
  /** HTTP 错误阈值（>= 视为错误） */
  static httpErrorThreshold = 400
  /** token 过期业务码集合 */
  static tokenExpiredCodes: number[] = [1011008, 1011004]

  // ================= 识别区 =================
  /** 取业务状态码（仅读取，不改写） */
  static statusOf(json: JsonBody): any {
    return json[ApiResponseConfig.statusField]
  }

  /** 取业务消息（仅用于提示展示，不改写） */
  static messageOf(json: JsonBody): string {
    return json[ApiResponseConfig.messageField] || ''
  }

  /**
   * 判断业务是否成功
   * 优先级：接口 meta.successCode 覆盖 > 全局 ApiResponseConfig.successCodes
   */
  static isSuccess(json: JsonBody, meta?: AlovaCustomTypes['meta']): boolean {
    const status = ApiResponseConfig.statusOf(json)
    const { successCode } = meta || {}
    if (successCode !== undefined) {
      const codes = Array.isArray(successCode) ? successCode : [successCode]
      return codes.includes(status)
    }
    return ApiResponseConfig.successCodes.includes(status)
  }

  /** 判断 HTTP 状态码是否为鉴权失效 */
  static isAuthStatus(statusCode: number): boolean {
    return ApiResponseConfig.authStatusCodes.includes(statusCode)
  }

  /** 判断业务状态码是否为 token 过期 */
  static isTokenExpired(json: JsonBody): boolean {
    return ApiResponseConfig.tokenExpiredCodes.includes(ApiResponseConfig.statusOf(json))
  }
}
