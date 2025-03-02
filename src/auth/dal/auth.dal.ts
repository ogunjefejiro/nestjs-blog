import {
   BadRequestException,
   Injectable,
   InternalServerErrorException,
   NotFoundException,
} from "@nestjs/common"
import { InjectModel } from "@nestjs/mongoose"
import { User } from "../entities/auth.entity"
import { Model } from "mongoose"
import * as bcrypt from "bcrypt"
import { TChangePasswordData, TSignUpData, TUpdateData } from "src/auth/utils/types/auth.types"

@Injectable()
export class AuthDal {
   constructor(@InjectModel(User.name) private authModel: Model<User>) {}
   async findOneByEmail(email: string) {
      return await this.authModel.findOne({
         email,
      })
   }

   async findOneByEncKey(key: string) {
      return await this.authModel.findOne({
         encryptedData: key,
      })
   }

   async findOneByPk(id: string) {
      return await this.authModel.findOne({
         _id: id,
      })
   }

   async create(signUpData: TSignUpData) {
      const user = await this.authModel.create({
         email: signUpData.email,
         firstName: signUpData.firstName,
         lastName: signUpData.lastName,
         verificationCode: signUpData.verificationCode,
         password: signUpData.password,
         codeExpiresAt: signUpData.codeExpiresAt,
         phone: signUpData.phone,
         userType: signUpData.userType,
      })
      const { password, codeExpiresAt, resetPasswordKey, verificationCode, ...userData } =
         user.toObject()
      return userData
   }

   async updateOneByEmail(updateData: TUpdateData, email: string) {
      try {
         await this.authModel.updateOne({ email }, updateData)
      } catch (error) {
         throw new InternalServerErrorException("Something went wrong")
      }
   }

   async updateOneById(updateData: TUpdateData, id: string) {
      await this.authModel.updateOne({ _id: id }, updateData)
   }

   async findByIdAndUpdate(updateData: TUpdateData, id: string) {
      const data = await this.authModel.findByIdAndUpdate(id, updateData, { new: true })
      return data
   }

   async updateUserPassword(updatePasswordData: TChangePasswordData) {
      const user = await this.authModel.findById(updatePasswordData.id).select("+password") // Ensure password is retrieved

      if (!user) {
         throw new NotFoundException("User not found")
      }

      const isPasswordValid = await bcrypt.compare(updatePasswordData.oldPassword, user.password)

      if (!isPasswordValid) {
         throw new BadRequestException("Old password is incorrect")
      }

      const isPasswordSame = await bcrypt.compare(updatePasswordData.newPassword, user.password)

      if (isPasswordSame) {
         throw new BadRequestException("New password cannot be the same as the old password")
      }

      const hashedPassword = await bcrypt.hash(
         updatePasswordData.newPassword,
         await bcrypt.genSalt(),
      )

      await this.updateOneById(
         {
            password: hashedPassword,
         },
         updatePasswordData.id,
      )
   }
}
