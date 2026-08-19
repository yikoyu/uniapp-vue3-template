import { v4 as uuid } from '@lukeed/uuid'
import { v4 as secureUuid } from '@lukeed/uuid/secure'

/**
 * UUID 生成工具类
 * @description 基于 @lukeed/uuid 实现，提供普通随机与加密安全两种模式
 * @author 未知
 * @date 未知
 */
export class UUID {
  /**
   * 生成 UUID v4
   * @description 使用 Math.random，速度快，非加密安全
   * @static
   * @returns {string} UUID v4 字符串
   */
  static v4(): string {
    return uuid()
  }

  /**
   * 生成加密安全的 UUID v4
   * @description 基于环境 crypto（CSPRNG）生成，加密安全
   * @static
   * @returns {string} UUID v4 字符串
   */
  static secure(): string {
    return secureUuid()
  }
}

export default UUID
