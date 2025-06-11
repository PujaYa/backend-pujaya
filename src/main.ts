import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors();
  // app.setGlobalPrefix('api');
  app.use((req, res, next) => {
    console.log(`DEBUG: Solicitud recibida - Método: ${req.method}, URL: ${req.url}`);
    next();
  });
  // app.useGlobalPipes(new ValidationPipe())
  const confitSwagger = new DocumentBuilder()
    .setTitle('PujaYa API')
    .setDescription('Documentacion de la API')
    .setVersion('1.0')
    .addBearerAuth(
      {

        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        in: 'header',
        name: 'Authorization'
      }
    )
    .build()

  const document = SwaggerModule.createDocument(app, confitSwagger)
  SwaggerModule.setup('api', app, document, {
    customCssUrl: 'https://backend-pujaya-pehvtekn4-pujaycoms-projects.vercel.app/docs/swagger-ui.css',
    customJs: [
      'https://backend-pujaya-pehvtekn4-pujaycoms-projects.vercel.app/api/swagger-ui-bundle.js',
      'https://backend-pujaya-pehvtekn4-pujaycoms-projects.vercel.app/api/swagger-ui-standalone-preset.js',
      'https://backend-pujaya-pehvtekn4-pujaycoms-projects.vercel.app/api/swagger-ui-init.js'
    ],
    // Asegúrate de incluir los favicons también si quieres que se carguen
    customfavIcon: 'https://backend-pujaya-pehvtekn4-pujaycoms-projects.vercel.app/api/favicon-32x32.png',
    customCss: '', // Puedes dejar esto vacío si no tienes CSS personalizado inyectado
    swaggerOptions: {
      url: '/api/api-json' // Esta es la ruta para tu JSON de la especificación, probablemente sigue siendo /api/api-json si tu prefijo global es /api
                          // Si tu JSON de swagger lo sirves en /api-json, entonces podría ser así
                          // Pero si tu app está en /api, y la especificación es /api/api-json, entonces está bien.
    }
  })

  const port = process.env.PORT ?? 3001;
  await app.listen(port);
}
bootstrap();
