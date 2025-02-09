export type TCreateCommentData = {
   body: string
   author: string
   blog: string
}

export type TUpdateCommentData = Partial<TCreateCommentData>

export type TCommentResponse = {
   message: string
   statusCode: number
   status: boolean
   data?: any
   error?: string
}
