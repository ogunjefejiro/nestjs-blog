import {
   BadRequestException,
   Injectable,
   InternalServerErrorException,
   NotFoundException,
} from "@nestjs/common"
import { CreateBlogDto } from "./dto/create-blog.dto"
import { UpdateBlogDto } from "./dto/update-blog.dto"
import { BlogDal } from "./dal/blog.dal"
import { Types } from "mongoose"

@Injectable()
export class BlogService {
   constructor(private blogDal: BlogDal) {}

   async create(createBlogDto: CreateBlogDto, userId: string) {
      const blog = await this.blogDal.create(createBlogDto, userId)

      if (!blog) {
         throw new InternalServerErrorException("Something went wrong")
      }

      return blog
   }

   async findAll(searchTerm?: string) {
      const data = await this.blogDal.findAll(searchTerm)

      return {
         data: data.blogs,
         count: data.count,
      }
   }

   async findOne(id: string) {
      if (!Types.ObjectId.isValid(id)) {
         throw new BadRequestException("Invalid Id format")
      }

      const blog = await this.blogDal.findOne(id)

      if (!blog) {
         throw new NotFoundException()
      }

      return blog
   }

   async update(id: string, updateBlogDto: UpdateBlogDto) {
      if (!Types.ObjectId.isValid(id)) {
         throw new BadRequestException("Invalid Id format")
      }

      const blog = await this.blogDal.findOne(id)

      if (!blog) {
         throw new NotFoundException()
      }

      const updatedBlog = await this.blogDal.update(updateBlogDto, id)

      return updatedBlog
   }

   async remove(id: string) {
      if (!Types.ObjectId.isValid(id)) {
         throw new BadRequestException("Invalid Id format")
      }

      const blog = await this.blogDal.findOne(id)

      if (!blog) {
         throw new NotFoundException()
      }

      await this.blogDal.remove(id)
   }
}
