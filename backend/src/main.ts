import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Configuring CORS, allowing to receive frontend information
  app.enableCors({
    origin: 'http://loaclhost:5173',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials:true, // Allows to receive confidential information from the browser
  });
  
  await app.listen(process.env.PORT ?? 5173);
  
}
bootstrap();
