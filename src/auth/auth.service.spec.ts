import { Test, TestingModule } from "@nestjs/testing"
import { AuthService } from "./auth.service"
import { AuthDal } from "./dal/auth.dal"
import { JwtService } from "@nestjs/jwt"
import * as bcrypt from "bcrypt"
import { BadRequestException, UnauthorizedException } from "@nestjs/common"
import { EUserType } from "./dto/role.enum"

describe("AuthService", () => {
   let service: AuthService
   let mockAuthDal: Record<string, jest.Mock>
   let mockJwtService: Record<string, jest.Mock>

   beforeEach(async () => {
      mockAuthDal = {
         findOneByEmail: jest.fn().mockResolvedValue({
            email: "test@example.com",
            firstName: "John",
            lastName: "Doe",
            password: "hashedPassword",
            toObject: jest.fn().mockReturnValue({
               email: "test@example.com",
               firstName: "John",
               lastName: "Doe",
            }),
         }),
         findOneByEncKey: jest.fn(),
         findOneByPk: jest.fn(),
         create: jest.fn(),
         updateOneByEmail: jest.fn(),
         updateOneById: jest.fn(),
         updateUserPassword: jest.fn(),
      }

      mockJwtService = {
         signAsync: jest.fn().mockResolvedValue("mockToken"),
      }

      const module: TestingModule = await Test.createTestingModule({
         providers: [
            AuthService,
            { provide: AuthDal, useValue: mockAuthDal },
            { provide: JwtService, useValue: mockJwtService },
         ],
      }).compile()

      service = module.get<AuthService>(AuthService)
   })

   it("should be defined", () => {
      expect(service).toBeDefined()
   })

   describe("login", () => {
      // it("should return user and token when credentials are correct", async () => {
      //    const mockUser = {
      //       id: "1",
      //       email: "test@example.com",
      //       password: await bcrypt.hash("password123", 10),
      //    }

      //    mockAuthDal.findOneByEmail.mockResolvedValue(mockUser)
      //    jest.spyOn(bcrypt, "compare").mockResolvedValue(true)

      //    const result = await service.login({
      //       email: "test@example.com",
      //       password: "password123",
      //    })

      //    expect(result).toEqual({
      //       data: { id: mockUser.id, email: mockUser.email },
      //       accessToken: "mockToken",
      //    })

      //    expect(mockAuthDal.findOneByEmail).toHaveBeenCalledWith("test@example.com")
      //    expect(mockJwtService.sign).toHaveBeenCalled()
      // })

      it("should throw UnauthorizedException if user is not found", async () => {
         mockAuthDal.findOneByEmail.mockResolvedValue(null)

         await expect(
            service.login({ email: "wrong@example.com", password: "password123" }),
         ).rejects.toThrow(UnauthorizedException)

         expect(mockAuthDal.findOneByEmail).toHaveBeenCalledWith("wrong@example.com")
      })

      it("should throw UnauthorizedException if password is incorrect", async () => {
         const mockUser = {
            id: "1",
            email: "test@example.com",
            password: await bcrypt.hash("password123", 10),
         }

         mockAuthDal.findOneByEmail.mockResolvedValue(mockUser)
         jest.spyOn(bcrypt, "compare").mockResolvedValue(false)

         await expect(
            service.login({ email: "test@example.com", password: "wrongpassword" }),
         ).rejects.toThrow(UnauthorizedException)
      })
   })

   describe("signUp", () => {
      // it("should create a new user and return user data with a token", async () => {
      //    const signUpDto = {
      //       email: "newuser@example.com",
      //       firstName: "John",
      //       lastName: "Doe",
      //       password: "securepassword",
      //       phone: "+1234567890",
      //       userType: EUserType.USER,
      //       verificationCode: "123456",
      //       codeExpiresAt: new Date(),
      //    }

      //    const mockUser = {
      //       id: "2",
      //       ...signUpDto,
      //       password: await bcrypt.hash(signUpDto.password, 10),
      //    }

      //    mockAuthDal.findOneByEmail.mockResolvedValue(null)
      //    mockAuthDal.create.mockResolvedValue(mockUser)

      //    const result = await service.signUp(signUpDto)

      //    expect(result).toEqual({
      //       data: { id: mockUser.id, email: mockUser.email },
      //       accessToken: "mockToken",
      //    })

      //    expect(mockAuthDal.findOneByEmail).toHaveBeenCalledWith(signUpDto.email)
      //    expect(mockAuthDal.create).toHaveBeenCalled()
      //    expect(mockJwtService.sign).toHaveBeenCalled()
      // })

      it("should throw BadRequestException if email already exists", async () => {
         mockAuthDal.findOneByEmail.mockResolvedValue({ id: "2", email: "existing@example.com" })

         await expect(
            service.signUp({
               email: "existing@example.com",
               firstName: "John",
               lastName: "Doe",
               password: "securepassword",
               phone: "+1234567890",
               userType: EUserType.USER,
            }),
         ).rejects.toThrow(BadRequestException)
      })
   })
})
