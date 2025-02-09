import { Injectable } from "@nestjs/common"
import { InjectModel } from "@nestjs/mongoose"
import { Model } from "mongoose"
import { TCreateCommentData, TUpdateCommentData } from "../types/comment.types"
import { Comment } from "../entities/comment.entity"
import { Blog } from "src/blog/entities/blog.entity"

@Injectable()
export class CommentDal {
   constructor(
      @InjectModel(Comment.name) private commentModel: Model<Comment>,
      @InjectModel(Blog.name) private blogModel: Model<Blog>,
   ) {}

   async create(createCommentData: TCreateCommentData) {
      const comment = await this.commentModel.create({
         body: createCommentData.body,
         blog: createCommentData.blog,
         author: createCommentData.author,
      })

      // Update the corresponding Blog document to include the new comment
      await this.blogModel.findByIdAndUpdate(
         createCommentData.blog,
         { $push: { comments: comment._id } }, // Push the new comment ID to the comments array
         { new: true, useFindAndModify: false },
      )

      return comment
   }

   async findAll() {
      const comments = await this.commentModel.find().sort({ createdAt: -1 })
      const count = await this.commentModel.countDocuments()

      return {
         comments,
         count,
      }
   }

   async findOne(id: string) {
      return await this.commentModel.findById(id)
   }

   async update(updateData: TUpdateCommentData, id: string) {
      const updatedComment = await this.commentModel.findByIdAndUpdate(id, updateData, {
         new: true,
      })
      return updatedComment
   }

   async remove(id: string) {
      await this.commentModel.findByIdAndDelete(id)
   }
}
