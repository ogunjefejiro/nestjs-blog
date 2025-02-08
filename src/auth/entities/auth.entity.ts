import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import { IsEmail, MinLength } from "class-validator"

@Schema({
   timestamps: true,
})
export class Auth {
   @IsEmail()
   @Prop({ unique: true, required: true, lowercase: true })
   email: string
   @Prop({ required: true })
   firstName: string
   @Prop({ required: true })
   lastName: string
   @Prop()
   verificationCode: string
   @Prop({ required: true })
   @MinLength(6)
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

export const AuthSchema = SchemaFactory.createForClass(Auth)
