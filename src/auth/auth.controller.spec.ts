import { Test, TestingModule } from "@nestjs/testing"
import { AuthController } from "./auth.controller"
import { AuthService } from "./auth.service"
import { LoginDto, SignUpDto } from "./dto/auth.dto"
import { HttpStatus } from "@nestjs/common"
import { EUserType } from "./dto/role.enum"

describe("AuthController", () => {
   let controller: AuthController
   let mockAuthService: Record<string, jest.Mock>

   beforeEach(async () => {
      mockAuthService = {
         login: jest.fn(),
         signUp: jest.fn(),
      }

      const module: TestingModule = await Test.createTestingModule({
         controllers: [AuthController],
         providers: [{ provide: AuthService, useValue: mockAuthService }],
      }).compile()

      controller = module.get<AuthController>(AuthController)
   })

   it("should be defined", () => {
      expect(controller).toBeDefined()
   })

   describe("login", () => {
      it("should return a success response with user data and token", async () => {
         const loginDto: LoginDto = {
            email: "test@example.com",
            password: "password123",
         }

         const mockResponse = {
            data: { id: "1", email: "test@example.com" },
            accessToken: "mockToken",
         }

         mockAuthService.login.mockResolvedValue(mockResponse)

         const result = await controller.login(loginDto)

         expect(result).toEqual({
            statusCode: HttpStatus.OK,
            message: "Logged in successfully",
            status: true,
            data: { user: mockResponse.data, token: mockResponse.accessToken },
         })

         expect(mockAuthService.login).toHaveBeenCalledWith(loginDto)
      })
   })

   describe("signup", () => {
      it("should return a success response with user data and token", async () => {
         const signUpDto: SignUpDto = {
            email: "newuser@example.com",
            firstName: "John",
            lastName: "Doe",
            password: "securepassword",
            phone: "+1234567890",
            userType: EUserType.USER,
         }

         const mockResponse = {
            data: { id: "2", email: "newuser@example.com" },
            accessToken: "mockToken",
         }

         mockAuthService.signUp.mockResolvedValue(mockResponse)

         const result = await controller.signUp(signUpDto)

         expect(result).toEqual({
            statusCode: HttpStatus.CREATED,
            message: "User created successfully",
            status: true,
            data: { user: mockResponse.data, token: mockResponse.accessToken },
         })

         expect(mockAuthService.signUp).toHaveBeenCalledWith(signUpDto)
      })
   })
})
