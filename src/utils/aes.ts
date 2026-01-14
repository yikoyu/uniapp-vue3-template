import { AES, enc, mode, pad } from 'crypto-js'

/**
 * AES 加密解密工具类
 * @description 采用 ECB 模式、Pkcs7 填充方式，基于 crypto-js 实现
 * @author 未知
 * @date 未知
 */
export class CryptoAes {
  /**
   * 默认加密解密密钥
   * @description 固定 16 位 UTF-8 字符串，对应 AES-128 加密（16 字节 = 128 位）
   * @private
   * @static
   */
  private static key = 'my-secret-key-16'

  /**
   * AES 加密方法
   * @description 将原始 UTF-8 字符串加密为 crypto-js 格式的密文字符串（Base64 编码）
   * @static
   * @param {string} message - 待加密的原始 UTF-8 字符串
   * @param {string} [pass] - 加密密钥（可选，默认使用类内置的 16 位密钥）
   * @returns {string} 加密后的 AES 密文字符串（Base64 编码）
   */
  static encrypt(message: string, pass: string = this.key): string {
    // 通过密钥获取 128 位的 key
    const _key = enc.Utf8.parse(pass)

    const encryptor = AES.encrypt(message, _key, {
      mode: mode.ECB,
      padding: pad.Pkcs7,
    })

    return encryptor.toString()
  }

  /**
   * AES 解密方法
   * @description 将 crypto-js 加密生成的密文字符串解密为原始 UTF-8 字符串
   * @static
   * @param {string} ciphertext - 待解密的 AES 密文字符串
   * @param {string} [pass] - 解密密钥（可选，默认使用类内置的 16 位密钥）
   * @returns {string} 解密后的原始 UTF-8 字符串
   */
  static decrypt(ciphertext: string, pass: string = this.key): string {
    // 通过密钥获取 128 位的 key
    const _key = enc.Utf8.parse(pass)

    const decryptor = AES.decrypt(ciphertext, _key, {
      mode: mode.ECB,
      padding: pad.Pkcs7,
    })

    return decryptor.toString(enc.Utf8)
  }
}
