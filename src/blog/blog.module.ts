import { Module } from "@nestjs/common"
import { BlogService } from "./blog.service"
import { BlogController } from "./blog.controller"
import { MongooseModule } from "@nestjs/mongoose"
import { UserSchema, User } from "src/auth/entities/auth.entity"
import { BlogDal } from "./dal/blog.dal"
import { Blog, BlogSchema } from "./entities/blog.entity"

@Module({
   imports: [
      MongooseModule.forFeature([
         { name: Blog.name, schema: BlogSchema },
         { name: User.name, schema: UserSchema },
      ]),
   ],
   controllers: [BlogController],
   providers: [BlogService, BlogDal],
})
export class BlogModule {}
