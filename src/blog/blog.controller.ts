import {
   Controller,
   Get,
   Post,
   Body,
   Patch,
   Param,
   Delete,
   HttpStatus,
   Request,
   Query,
} from "@nestjs/common"
import { BlogService } from "./blog.service"
import { CreateBlogDto } from "./dto/create-blog.dto"
import { UpdateBlogDto } from "./dto/update-blog.dto"
import { ApiQuery } from "@nestjs/swagger"

@Controller("blog")
export class BlogController {
   constructor(private readonly blogService: BlogService) {}

   @Post()
   async create(@Body() createBlogDto: CreateBlogDto, @Request() request: any) {
      const blog = await this.blogService.create(createBlogDto, request.user.id)

      return {
         statusCode: HttpStatus.CREATED,
         status: true,
         message: "Blog created successfully",
         data: blog,
      }
   }

   @Get()
   @ApiQuery({ name: "searchTerm", required: false, description: "Search by title or snippet" })
   async findAll(@Query("searchTerm") searchTerm?: string) {
      const data = await this.blogService.findAll(searchTerm)

      return {
         statusCode: HttpStatus.OK,
         status: true,
         message: "Blogs retrieved successfully",
         data: {
            blogs: data.data,
            count: data.count,
         },
      }
   }

   @Get(":id")
   async findOne(@Param("id") id: string) {
      const data = await this.blogService.findOne(id)

      return {
         statusCode: HttpStatus.OK,
         status: true,
         message: "Blog retrieved successfully",
         data,
      }
   }

   @Patch(":id")
   async update(@Param("id") id: string, @Body() updateBlogDto: UpdateBlogDto) {
      const data = await this.blogService.update(id, updateBlogDto)

      return {
         statusCode: HttpStatus.OK,
         status: true,
         message: "Blog updated successfully",
         data,
      }
   }

   @Delete(":id")
   async remove(@Param("id") id: string) {
      await this.blogService.remove(id)

      return {
         statusCode: HttpStatus.OK,
         status: true,
         message: "Blog deleted successfully",
      }
   }
}
