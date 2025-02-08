import { ApiProperty } from "@nestjs/swagger"
import { IsEmail, IsEnum, IsNotEmpty, MinLength } from "class-validator"
import { EUserType } from "./role.enum"

export class LoginDto {
   @ApiProperty()
   @IsNotEmpty()
   @IsEmail()
   email: string
   @ApiProperty()
   @IsNotEmpty()
   password: string
}

export class SignUpDto {
   @ApiProperty()
   @IsEmail()
   @IsNotEmpty()
   email: string
   @ApiProperty()
   @IsNotEmpty()
   @MinLength(6)
   password: string
   @ApiProperty()
   @IsNotEmpty()
   firstName: string
   @ApiProperty()
   @IsNotEmpty()
   lastName: string
   @ApiProperty()
   @IsNotEmpty()
   phone: string
   @ApiProperty({ enum: EUserType })
   @IsNotEmpty()
   @IsEnum(EUserType)
   userType: EUserType
}

export class VerificationDto {
   @ApiProperty()
   @IsEmail()
   @IsNotEmpty()
   email: string
   @ApiProperty()
   @IsNotEmpty()
   code: string
}

export class ResetPasswordDto {
   @ApiProperty()
   @IsNotEmpty()
   password: string
   @ApiProperty()
   @IsNotEmpty()
   encryptedCode: string
}

export class ChangePasswordDto {
   @ApiProperty()
   @IsNotEmpty()
   oldPassword: string
   @ApiProperty()
   @IsNotEmpty()
   newPassword: string
}
