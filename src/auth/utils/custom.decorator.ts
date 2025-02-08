import { SetMetadata } from "@nestjs/common"
import { EUserType } from "src/auth/dto/role.enum"

export const IS_PUBLIC_KEY = "isPublic"
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true)

export const ROLES_KEY = "roles"
export const Roles = (...roles: EUserType[]) => SetMetadata(ROLES_KEY, roles)
