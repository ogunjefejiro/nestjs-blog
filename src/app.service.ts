import { Injectable } from "@nestjs/common"

@Injectable()
export class AppService {
   getHello(): string {
      return "Hello Feji My Guy!"
   }
}
