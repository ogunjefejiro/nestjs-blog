import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common"
import { Reflector } from "@nestjs/core"
import { JwtService } from "@nestjs/jwt"
import { Request } from "express"
import { ROLES_KEY } from "src/auth/utils/custom.decorator"
import { EUserType } from "../dto/role.enum"

@Injectable()
export class RoleGuard implements CanActivate {
   constructor(
      private jwtService: JwtService,
      private reflector: Reflector,
   ) {}

   async canActivate(context: ExecutionContext): Promise<boolean> {
      const requiredRoles = this.reflector.getAllAndOverride<EUserType[]>(ROLES_KEY, [
         context.getHandler(),
         context.getClass(),
      ])
      if (!requiredRoles) {
         return true
      }
      const request = context.switchToHttp().getRequest()
      const token = this.extractTokenFromHeader(request)
      if (!token) {
         throw new UnauthorizedException()
      }

      try {
         const payload = await this.jwtService.verifyAsync(token, {
            secret: process.env.JWT_SECRET,
         })
         return requiredRoles.some((role) => payload.userType?.includes(role))
      } catch (error) {
         throw new UnauthorizedException(error.message)
      }
   }

   private extractTokenFromHeader(request: Request): string | undefined {
      const [type, token] = request.headers.authorization?.split(" ") ?? []
      return type === "Bearer" ? token : undefined
   }
}
