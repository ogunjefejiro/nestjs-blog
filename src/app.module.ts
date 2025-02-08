import { Module } from "@nestjs/common"
import { AppController } from "./app.controller"
import { AppService } from "./app.service"
import { ConfigModule } from "@nestjs/config"
import { AuthModule } from "./auth/auth.module"
import { MongooseModule } from "@nestjs/mongoose"
import { DatabaseModule } from "./database/database.module"

@Module({
   imports: [
      ConfigModule.forRoot({
         isGlobal: true, // Makes the configuration available globally
      }),
      MongooseModule.forRoot(process.env.DB_URI!),
      AuthModule,
      DatabaseModule,
   ],
   controllers: [AppController],
   providers: [AppService],
})
export class AppModule {}
