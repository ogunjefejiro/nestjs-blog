import { Controller, Get, Post, Body, Patch, Param, Delete, HttpStatus } from "@nestjs/common"
import { CommentService } from "./comment.service"
import { CreateCommentDto } from "./dto/create-comment.dto"
import { UpdateCommentDto } from "./dto/update-comment.dto"

@Controller("comment")
export class CommentController {
   constructor(private readonly commentService: CommentService) {}

   @Post()
   create(@Body() createCommentDto: CreateCommentDto) {
      return this.commentService.create(createCommentDto)
   }

   //    @Get()
   //    async findAll() {
   //     const data = await this.commentService.findAll()

   //     return {
   //        statusCode: HttpStatus.OK,
   //        status: true,
   //        message: "Comments retrieved successfully",
   //        data: {
   //           blogs: data.data,
   //           count: data.count,
   //        },
   //     }
   //  }

   @Get(":id")
   async findOne(@Param("id") id: string) {
      const data = await this.commentService.findOne(id)

      return {
         statusCode: HttpStatus.OK,
         status: true,
         message: "Comment retrieved successfully",
         data,
      }
   }

   @Patch(":id")
   async update(@Param("id") id: string, @Body() updateCommentDto: UpdateCommentDto) {
      const data = await this.commentService.update(id, updateCommentDto)

      return {
         statusCode: HttpStatus.OK,
         status: true,
         message: "Comment updated successfully",
         data,
      }
   }

   @Delete(":id")
   async remove(@Param("id") id: string) {
      await this.commentService.remove(id)

      return {
         statusCode: HttpStatus.OK,
         status: true,
         message: "Comment deleted successfully",
      }
   }
}
