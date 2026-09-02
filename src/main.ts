import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(helmet());

  app.enableCors({
    origin: true,
    credentials: true,
  });

  // CAPTCHA
  app.enableShutdownHooks();
  app.setGlobalPrefix('api/v1');

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  const config=new DocumentBuilder().setTitle('Master Backend Api').setDescription("Master Backend Api").setVersion('1.0.0.1').addBearerAuth({
    type:'http',
    scheme:'bearer',
    bearerFormat:'JWT',
    description:'Enter JWT token',
    in:'header'
  },
"JWT-auth"
).build();

  const document =SwaggerModule.createDocument(app,config);
  SwaggerModule.setup('api/docs',app,document)

  await app.listen(process.env.PORT ?? 4500);
}
bootstrap();
