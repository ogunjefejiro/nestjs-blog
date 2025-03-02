import { Injectable } from "@nestjs/common"

@Injectable()
export class AppService {
   getHello(): string {
      return "Welcome to my Blog!. I built this with NestJs"
   }
}
