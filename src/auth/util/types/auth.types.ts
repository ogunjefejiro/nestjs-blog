export type TSignUpData = {
   email: string
   firstName: string
   lastName: string
   verificationCode: string
   password: string
   phone: string
   codeExpiresAt: number
   resetPasswordKey?: string
   isVerified?: boolean
   encryptedData?: string
}

export type TUpdateData = Partial<TSignUpData>

export type TAuthResponse = {
   message: string
   statusCode: number
   status: boolean
   auth_token?: string
   data?: any
   error?: string
}

export type TChangePasswordData = {
   oldPassword: string
   newPassword: string
   id: string
}
