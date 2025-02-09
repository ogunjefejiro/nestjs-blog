import {
   BadRequestException,
   Injectable,
   InternalServerErrorException,
   NotFoundException,
} from "@nestjs/common"
import { CreateCommentDto } from "./dto/create-comment.dto"
import { UpdateCommentDto } from "./dto/update-comment.dto"
import { Types } from "mongoose"
import { CommentDal } from "./dal/comment.dal"

@Injectable()
export class CommentService {
   constructor(private commentDal: CommentDal) {}

   async create(createCommentDto: CreateCommentDto) {
      const comment = await this.commentDal.create(createCommentDto)

      if (!comment) {
         throw new InternalServerErrorException("Something went wrong")
      }

      return comment
   }

   async findAll() {
      const data = await this.commentDal.findAll()

      return {
         data: data.comments,
         count: data.count,
      }
   }

   async findOne(id: string) {
      if (!Types.ObjectId.isValid(id)) {
         throw new BadRequestException("Invalid Id format")
      }

      const comment = await this.commentDal.findOne(id)

      if (!comment) {
         throw new NotFoundException()
      }

      return comment
   }

   async update(id: string, updateCommentDto: UpdateCommentDto) {
      if (!Types.ObjectId.isValid(id)) {
         throw new BadRequestException("Invalid Id format")
      }

      const comment = await this.commentDal.findOne(id)

      if (!comment) {
         throw new NotFoundException()
      }

      const updatedBlog = await this.commentDal.update(updateCommentDto, id)

      return updatedBlog
   }

   async remove(id: string) {
      if (!Types.ObjectId.isValid(id)) {
         throw new BadRequestException("Invalid Id format")
      }

      const comment = await this.commentDal.findOne(id)

      if (!comment) {
         throw new NotFoundException()
      }

      await this.commentDal.remove(id)
   }
}
