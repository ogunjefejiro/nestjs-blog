import { Controller, Post, Body, HttpStatus, HttpCode } from "@nestjs/common"
import { AuthService } from "./auth.service"
import { LoginDto, SignUpDto } from "./dto/auth.dto"
import { TAuthResponse } from "src/auth/util/types/auth.types"
import { Public, Roles } from "src/utils/custom.decorator"
import { EUserType } from "./dto/role.enum"

@Controller("auth")
export class AuthController {
   constructor(private authService: AuthService) {}

   @Public()
   @Roles(EUserType.USER)
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
}
