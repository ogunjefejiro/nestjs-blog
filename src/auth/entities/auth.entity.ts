import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import { isEmail, IsEmail, MinLength } from "class-validator"

@Schema({
   timestamps: true,
})
export class User {
   @Prop({ unique: true, required: true, lowercase: true })
   email: string
   @Prop({ required: true })
   firstName: string
   @Prop({ required: true })
   lastName: string
   @Prop()
   verificationCode: string
   @Prop({ required: true })
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
}

export const AuthSchema = SchemaFactory.createForClass(User)
