import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import { Schema as MongooseSchema } from "mongoose"
import { User } from "src/auth/entities/auth.entity"

@Schema({
   timestamps: true,
})
export class Comment {
   @Prop({ required: true })
   body: string
   @Prop({ type: MongooseSchema.Types.ObjectId, ref: "User", immutable: true, required: true })
   author: User
   @Prop({ type: MongooseSchema.Types.ObjectId, ref: "Blog", immutable: true, required: true })
   blog: string
}

export const CommentSchema = SchemaFactory.createForClass(Comment)
