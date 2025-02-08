import { Module } from "@nestjs/common"
import { AuthService } from "./auth.service"
import { AuthController } from "./auth.controller"
import { JwtModule } from "@nestjs/jwt"
import { AuthDal } from "./dal/auth.dal"
import { MongooseModule } from "@nestjs/mongoose"
import { User, AuthSchema } from "./entities/auth.entity"
import { APP_GUARD } from "@nestjs/core"
import { AuthGuard } from "./guard/auth.guard"

@Module({
   imports: [
      MongooseModule.forFeature([{ name: User.name, schema: AuthSchema }]),
      JwtModule.registerAsync({
         useFactory: () => ({
            global: true,
            secret: process.env.JWT_SECRET,
            signOptions: { expiresIn: "3d" },
         }),
      }),
   ],
   controllers: [AuthController],
   providers: [
      AuthService,
      AuthDal,
      {
         //apply authguard globally to all endpoints
         provide: APP_GUARD,
         useClass: AuthGuard,
      },
   ],
   exports: [AuthService, AuthDal],
})
export class AuthModule {}
