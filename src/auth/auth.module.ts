import { Module } from "@nestjs/common"
import { AuthService } from "./auth.service"
import { AuthController } from "./auth.controller"
import { JwtModule } from "@nestjs/jwt"
import { AuthDal } from "./dal/auth.dal"
import { MongooseModule } from "@nestjs/mongoose"
import { Auth, AuthSchema } from "./entities/auth.entity"

@Module({
   imports: [
      MongooseModule.forFeature([{ name: Auth.name, schema: AuthSchema }]),
      JwtModule.registerAsync({
         useFactory: () => ({
            global: true,
            secret: process.env.JWT_SECRET,
            signOptions: { expiresIn: "3d" },
         }),
      }),
   ],
   controllers: [AuthController],
   providers: [AuthService, AuthDal],
   exports: [AuthService, AuthDal],
})
export class AuthModule {}
