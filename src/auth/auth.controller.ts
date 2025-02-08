import { Controller, Get, Post, Body, Patch, Param, Delete, HttpStatus } from "@nestjs/common"
import { AuthService } from "./auth.service"
import { LoginDto, SignUpDto } from "./dto/auth.dto"
import { TAuthResponse } from "src/auth/util/types/auth.types"

@Controller("auth")
export class AuthController {
   constructor(private authService: AuthService) {}

   @Post("login")
   async login(@Body() loginDto: LoginDto): Promise<TAuthResponse> {
      const data = await this.authService.login(loginDto)
      return {
         statusCode: HttpStatus.OK,
         message: "Logged in successfully",
         status: true,
         data: { accessToken: data.accessToken, user: data.data },
      }
   }

   @Post("signup")
   async signUp(@Body() signUpDto: SignUpDto): Promise<TAuthResponse> {
      const data = await this.authService.signUp(signUpDto)
      return {
         statusCode: HttpStatus.CREATED,
         message: "User created successfully",
         status: true,
         data: { accessToken: data.accessToken, user: data.data },
      }
   }
}
