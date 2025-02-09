import { Module } from "@nestjs/common"
import { AuthService } from "./auth.service"
import { AuthController } from "./auth.controller"
import { JwtModule } from "@nestjs/jwt"
import { AuthDal } from "./dal/auth.dal"
import { MongooseModule } from "@nestjs/mongoose"
import { User, UserSchema } from "./entities/auth.entity"
import { APP_GUARD } from "@nestjs/core"
import { AuthGuard } from "./guard/auth.guard"
import { RoleGuard } from "./guard/role.guard"

@Module({
   imports: [
      MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
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
         //apply AuthGuard globally to all endpoints
         provide: APP_GUARD,
         useClass: AuthGuard,
      },
      {
         //apply RoleGaurd globally to all endpoints
         provide: APP_GUARD,
         useClass: RoleGuard,
      },
   ],
   exports: [AuthService, AuthDal],
})
export class AuthModule {}
