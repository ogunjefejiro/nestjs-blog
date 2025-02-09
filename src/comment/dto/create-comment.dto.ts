import { ApiProperty } from "@nestjs/swagger"
import { IsNotEmpty } from "class-validator"

export class CreateCommentDto {
   @ApiProperty()
   @IsNotEmpty()
   body: string
   @ApiProperty({ description: "Id of the author" })
   @IsNotEmpty()
   author: string
   @ApiProperty({ description: "Id of the blog" })
   @IsNotEmpty()
   blog: string
}
