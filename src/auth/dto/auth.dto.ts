import { ApiProperty } from "@nestjs/swagger"
import { IsEmail, IsNotEmpty } from "class-validator"

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
   email: string
   @ApiProperty()
   @IsNotEmpty()
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
}

export class VerificationDto {
   @ApiProperty()
   @IsEmail()
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
