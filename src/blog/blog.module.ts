import { Module } from "@nestjs/common"
import { BlogService } from "./blog.service"
import { BlogController } from "./blog.controller"
import { MongooseModule } from "@nestjs/mongoose"
import { UserSchema, User } from "src/auth/entities/auth.entity"
import { BlogDal } from "./dal/blog.dal"
import { Blog, BlogSchema } from "./entities/blog.entity"
import { Comment, CommentSchema } from "src/comment/entities/comment.entity"

@Module({
   imports: [
      MongooseModule.forFeature([
         { name: Blog.name, schema: BlogSchema },
         { name: User.name, schema: UserSchema },
         { name: Comment.name, schema: CommentSchema },
      ]),
   ],
   controllers: [BlogController],
   providers: [BlogService, BlogDal],
})
export class BlogModule {}
