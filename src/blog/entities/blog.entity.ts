import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import { Model, Schema as MongooseSchema } from "mongoose"
import slugify from "slugify"
import { User } from "src/auth/entities/auth.entity"

@Schema({
   timestamps: true,
})
export class Blog {
   @Prop({ required: true })
   title: string
   @Prop({ required: true })
   snippet: string
   @Prop({ required: true })
   body: string
   @Prop({ unique: true, immutable: true })
   slug: string
   @Prop({ type: MongooseSchema.Types.ObjectId, ref: User.name, index: "text" })
   author: MongooseSchema.Types.ObjectId
   //  @Prop([{ type: MongooseSchema.Types.ObjectId, ref: User.name, index: "text" }])
   //  comments: MongooseSchema.Types.ObjectId
}

export const BlogSchema = SchemaFactory.createForClass(Blog)

// Middleware to auto-generate slug
BlogSchema.pre("save", async function (next) {
   if (!this.isModified("title")) return next()

   const model = this.constructor as Model<Blog>
   let slug = slugify(this.title, { lower: true, strict: true })

   let existingBlog = await model.findOne({ slug })
   if (existingBlog) {
      slug += `-${Math.floor(1000 + Math.random() * 9000)}`
   }

   this.slug = slug
   next()
})
