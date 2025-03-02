import { Injectable } from "@nestjs/common"
import { InjectModel } from "@nestjs/mongoose"
import { Model } from "mongoose"
import { Blog } from "../entities/blog.entity"
import { TCreateBlogData, TUpdateBlogData } from "../types/blog.types"

@Injectable()
export class BlogDal {
   constructor(@InjectModel(Blog.name) private blogModel: Model<Blog>) {}

   async create(createBlogData: TCreateBlogData, userId: string) {
      const blog = await this.blogModel.create({
         title: createBlogData.title,
         body: createBlogData.body,
         snippet: createBlogData.snippet,
         author: userId,
      })

      return blog
   }

   async findAll(searchTerm?: string) {
      const filter = searchTerm
         ? {
              $or: [
                 { title: { $regex: searchTerm, $options: "i" } }, // Case-insensitive search in title
                 { snippet: { $regex: searchTerm, $options: "i" } },
              ],
           }
         : {} // If no searchTerm, return all blogs

      const blogs = await this.blogModel
         .find(filter)
         .sort({ createdAt: -1 })
         .populate({
            path: "comments",
            populate: { path: "author", select: "name email firstName lastName" },
         })
         .populate("author", "name email firstName lastName")
      const count = await this.blogModel.countDocuments(filter)

      return {
         blogs,
         count,
      }
   }

   async findOne(id: string) {
      return await this.blogModel.findById(id)
   }

   async update(updateData: TUpdateBlogData, id: string) {
      const updatedBlog = await this.blogModel.findByIdAndUpdate(id, updateData, { new: true })
      return updatedBlog
   }

   async remove(id: string) {
      await this.blogModel.findByIdAndDelete(id)
   }
}
