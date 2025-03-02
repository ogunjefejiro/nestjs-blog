import {
   Controller,
   Post,
   Body,
   HttpStatus,
   HttpCode,
   Patch,
   Request,
   Param,
   Get,
} from "@nestjs/common"
import { AuthService } from "./auth.service"
import {
   ForgotPasswordDto,
   LoginDto,
   ProfileDto,
   ResetPasswordDto,
   SignUpDto,
} from "./dto/auth.dto"
import { TAuthResponse } from "src/auth/utils/types/auth.types"
import { Public } from "./utils/custom.decorator"

@Controller("auth")
export class AuthController {
   constructor(private authService: AuthService) {}

   @Public()
   @Post("login")
   @HttpCode(HttpStatus.OK)
   async login(@Body() loginDto: LoginDto): Promise<TAuthResponse> {
      const data = await this.authService.login(loginDto)

      return {
         statusCode: HttpStatus.OK,
         message: "Logged in successfully",
         status: true,
         data: { user: data.data, token: data.accessToken },
      }
   }

   @Public()
   @Post("signup")
   async signUp(@Body() signUpDto: SignUpDto): Promise<TAuthResponse> {
      const data = await this.authService.signUp(signUpDto)

      return {
         statusCode: HttpStatus.CREATED,
         message: "User created successfully",
         status: true,
         data: { user: data.data, token: data.accessToken },
      }
   }

   @Patch("profile")
   async updateProfile(
      @Body() profileDto: ProfileDto,
      @Request() request: any,
   ): Promise<TAuthResponse> {
      const data = await this.authService.updateProfile(profileDto, request.user.id)

      return {
         statusCode: HttpStatus.OK,
         message: "Profile updated successfully",
         status: true,
         data,
      }
   }

   @Get("profile/:id")
   async findProfile(@Param("id") id: string): Promise<TAuthResponse> {
      const data = await this.authService.findProfile(id)

      return {
         statusCode: HttpStatus.OK,
         message: "Profile fetched successfully",
         status: true,
         data,
      }
   }

   @Public()
   @Post("/forgot-password")
   async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto): Promise<TAuthResponse> {
      const url = await this.authService.forgotPassword(forgotPasswordDto)

      return {
         statusCode: HttpStatus.OK,
         message: "Password reset link sent successfully",
         status: true,
         data: url,
      }
   }

   @Public()
   @Post("/reset-password")
   @HttpCode(HttpStatus.OK)
   async resetPassword(@Body() resetPasswordDto: ResetPasswordDto): Promise<TAuthResponse> {
      await this.authService.resetPassword(resetPasswordDto)

      return {
         statusCode: HttpStatus.OK,
         message: "Password reset successfully",
         status: true,
         data: null,
      }
   }
}
