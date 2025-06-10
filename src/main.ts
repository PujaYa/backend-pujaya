import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors();
  app.setGlobalPrefix('api');
  // app.useGlobalPipes(new ValidationPipe())
  const confitSwagger = new DocumentBuilder()
    .setTitle('PujaYa API')
    .setDescription('Documentacion de la API')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type:'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        in: 'header',
        name: 'Authorization'
      }
    )
    .build()

  const document = SwaggerModule.createDocument(app, confitSwagger)
  SwaggerModule.setup('api', app, document)
  
  const port = process.env.PORT ?? 3001;
  await app.listen(port);
}
bootstrap();
