import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import { EUserType } from "../dto/role.enum"

@Schema({
   timestamps: true,
})
export class User {
   @Prop({ unique: true, required: true, lowercase: true, immutable: true })
   email: string
   @Prop({ required: true })
   firstName: string
   @Prop({ required: true })
   lastName: string
   @Prop()
   verificationCode: string
   @Prop({ required: true, immutable: true })
   password: string
   @Prop()
   codeExpiresAt: string
   @Prop({ required: true })
   phone: string
   @Prop({ required: true, default: false })
   isVerified: boolean
   @Prop({ default: null })
   resetPasswordKey: string
   @Prop({ default: null })
   encryptedData: string
   @Prop({
      required: true,
      default: null,
      type: String,
      enum: EUserType,
      index: "text",
      immutable: true,
   })
   userType: EUserType
}

export const UserSchema = SchemaFactory.createForClass(User)
