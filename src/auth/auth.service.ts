import {
   BadRequestException,
   Injectable,
   InternalServerErrorException,
   UnauthorizedException,
} from "@nestjs/common"
import {
   ForgotPasswordDto,
   LoginDto,
   ProfileDto,
   ResetPasswordDto,
   SignUpDto,
} from "./dto/auth.dto"
import { AuthDal } from "./dal/auth.dal"
import * as bcrypt from "bcrypt"
import { JwtService } from "@nestjs/jwt"
import { decrypt, encrypt, generateVerificationCode } from "./utils/helpers"

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

   async updateProfile(profileDto: ProfileDto, userId: string) {
      const userData = await this.authDal.findByIdAndUpdate(profileDto, userId)

      // if (!!userData) {
      //    throw new InternalServerErrorException("Something went wrong")
      // }

      return userData
   }

   async forgotPassword(forgotPasswordDto: ForgotPasswordDto) {
      const user = await this.authDal.findOneByEmail(forgotPasswordDto.email)
      if (!user) {
         throw new BadRequestException("User does not exist")
      }
      const [encryptedData, tempKey] = encrypt(user._id.toString(), process.env.ENCRYPTION_KEY!)
      await this.authDal.updateOneByEmail(
         {
            resetPasswordKey: tempKey,
            codeExpiresAt: Date.now() + 10 * 60 * 1000,
            encryptedData,
         },
         forgotPasswordDto.email,
      )
      const url = `${process.env.FORGOT_PSWD_URL}?encryptedCode=${encryptedData}`
      return url
   }

   async resetPassword(resetPasswordDto: ResetPasswordDto) {
      const user = await this.authDal.findOneByEncKey(resetPasswordDto.encryptedCode)
      if (!user) {
         throw new BadRequestException("User does not exist")
      }
      if (parseInt(user.codeExpiresAt) < Date.now()) {
         throw new BadRequestException("Your key has expired")
      }
      const id = decrypt(
         resetPasswordDto.encryptedCode,
         process.env.ENCRYPTION_KEY!,
         user.resetPasswordKey,
      )
      if (id !== user._id.toString()) {
         throw new BadRequestException("Incorrect password reset token")
      }

      const salt = await bcrypt.genSalt()
      const password = await bcrypt.hash(resetPasswordDto.password, salt)
      await this.authDal.updateOneById(
         {
            password,
         },
         id,
      )
      return
   }
}
