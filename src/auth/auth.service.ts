import {
   BadRequestException,
   Injectable,
   InternalServerErrorException,
   UnauthorizedException,
} from "@nestjs/common"
import { LoginDto, SignUpDto } from "./dto/auth.dto"
import { AuthDal } from "./dal/auth.dal"
import { generateVerificationCode } from "src/utils/helpers"
import * as bcrypt from "bcrypt"
import { JwtService } from "@nestjs/jwt"

@Injectable()
export class AuthService {
   constructor(
      private authDal: AuthDal,
      private jwtService: JwtService,
   ) {}

   async login(loginDto: LoginDto) {
      const user = await this.authDal.findOneByEmail(loginDto.email.toLowerCase().trim())

      if (!user) {
         throw new UnauthorizedException("This email doesn't belong to any user")
      }

      const checkPassword = bcrypt.compareSync(loginDto.password, user.password)
      if (!checkPassword) throw new UnauthorizedException("Invalid credentials")
      const payload = {
         id: user._id,
         firstName: user.firstName,
         lastName: user.lastName,
         email: user.email,
         userType: user.userType,
      }

      const { password, codeExpiresAt, resetPasswordKey, verificationCode, ...userData } =
         user.toObject()
      const accessToken = await this.jwtService.signAsync(payload)

      return {
         accessToken,
         data: userData,
      }
   }

   async signUp(signUpDto: SignUpDto) {
      const user = await this.authDal.findOneByEmail(signUpDto.email.toLowerCase().trim())

      if (user) {
         throw new BadRequestException("A user with this email already exists")
      }

      const verificationCode = generateVerificationCode()
      const salt = await bcrypt.genSalt()
      const hashedVerificationCode = await bcrypt.hash(verificationCode, salt)
      const hashedPassword = await bcrypt.hash(signUpDto.password, salt)

      const userData = await this.authDal.create({
         email: signUpDto.email.toLowerCase().trim(),
         firstName: signUpDto.firstName.trim(),
         lastName: signUpDto.lastName.trim(),
         verificationCode: hashedVerificationCode,
         password: hashedPassword,
         codeExpiresAt: Date.now() + 10 * 60 * 1000, // 10 minutes
         phone: signUpDto.phone.trim(),
         userType: signUpDto.userType,
      })

      if (!userData) {
         throw new InternalServerErrorException("Something went wrong")
      }

      const accessToken = await this.jwtService.signAsync(userData)
      return {
         accessToken,
         data: userData,
      }
   }
}
