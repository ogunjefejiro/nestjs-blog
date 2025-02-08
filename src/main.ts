import { NestFactory } from "@nestjs/core"
import { AppModule } from "./app.module"
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger"
import { ValidationPipe } from "@nestjs/common"

async function bootstrap() {
   const app = await NestFactory.create(AppModule, {
      cors: {
         origin: "*",
         methods: "GET, PUT, PATCH, POST, DELETE, OPTIONS",
         allowedHeaders: ["*"],
      },
   })

   app.setGlobalPrefix("api/v1")
   app.useGlobalPipes(new ValidationPipe())

   const config = new DocumentBuilder()
      .setTitle("Feji Blog API")
      .setDescription("API Documentation")
      .setVersion("1.0")
      .addBearerAuth()
      .addServer("https://feji-nest-blog.onrender.com", "Development Server")
      .addServer("http://localhost:3030", "Local Server")
      .build()
   const documentFactory = () => SwaggerModule.createDocument(app, config)
   SwaggerModule.setup("docs", app, documentFactory)

   await app.listen(process.env.PORT ?? 3030)
}
bootstrap()
