import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Configuring CORS, allowing to receive frontend information
  //   app.enableCors({
  //     origin: 'http://loaclhost:5173',
  //     methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  //     credentials:true, // Allows to receive confidential information from the browser
  //   });
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

  app.setGlobalPrefix("/api")

  console.log(process.env.PORT);
  await app.listen(3000); //! process.env.PORT not working
}
bootstrap();
