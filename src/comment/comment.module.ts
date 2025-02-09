import { Module } from "@nestjs/common"
import { CommentService } from "./comment.service"
import { CommentController } from "./comment.controller"
import { MongooseModule } from "@nestjs/mongoose"
import { Blog, BlogSchema } from "src/blog/entities/blog.entity"
import { User, UserSchema } from "src/auth/entities/auth.entity"
import { Comment, CommentSchema } from "./entities/comment.entity"
import { CommentDal } from "./dal/comment.dal"

@Module({
   imports: [
      MongooseModule.forFeature([
         { name: Blog.name, schema: BlogSchema },
         { name: User.name, schema: UserSchema },
         { name: Comment.name, schema: CommentSchema },
      ]),
   ],
   controllers: [CommentController],
   providers: [CommentService, CommentDal],
})
export class CommentModule {}
