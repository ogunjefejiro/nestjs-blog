import * as CryptoJS from "crypto-js"

export const generateVerificationCode = () => {
   //TODO: return random 6 digit code
   return "000000"
}

export const encrypt = (text: string, secretKey: string): [string, string] => {
   if (!text) {
      throw new Error("Text to encrypt is empty")
   }
   const iv = CryptoJS.lib.WordArray.random(16)
   const key = CryptoJS.enc.Utf8.parse(secretKey.padEnd(32, "0").slice(0, 32))
   const encrypted = CryptoJS.AES.encrypt(text, key, {
      iv: iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
   })
   return [encrypted.ciphertext.toString(CryptoJS.enc.Hex), iv.toString(CryptoJS.enc.Hex)]
}

export const decrypt = (ciphertext: string, secretKey: string, ivHex: string): string => {
   const iv = CryptoJS.enc.Hex.parse(ivHex)
   const key = CryptoJS.enc.Utf8.parse(secretKey.padEnd(32, "0").slice(0, 32))
   const cipherParams = CryptoJS.lib.CipherParams.create({
      ciphertext: CryptoJS.enc.Hex.parse(ciphertext),
   })
   const decrypted = CryptoJS.AES.decrypt(cipherParams, key, {
      iv: iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
   })
   return decrypted.toString(CryptoJS.enc.Utf8)
}
