export type TCreateBlogData = {
   title: string
   body: string
   snippet: string
}

export type TUpdateBlogData = Partial<TCreateBlogData>

export type TBlogResponse = {
   message: string
   statusCode: number
   status: boolean
   data?: any
   error?: string
}
