import { Logger } from '@nestjs/common'
import { NestApplication, NestFactory } from '@nestjs/core'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { ConfigService } from '@nestjs/config'

import { AppModule } from './app.module'

async function bootstrap() {
  const app = await NestFactory.create<NestApplication>(AppModule)
  const config = app.get(ConfigService)
  //Swagger
  const configSwagger = new DocumentBuilder().setTitle('Denius APIs').setVersion('1.0').addBearerAuth().build()
  const document = SwaggerModule.createDocument(app, configSwagger)
  SwaggerModule.setup('api', app, document, {
    swaggerOptions: { persistAuthorization: true },
    customSiteTitle: 'Denius Customers',
  })

  const port = process.env.PORT || 3333
  await app.listen(port, '0.0.0.0')
  Logger.log(`🚀 Application is running on: ${await app.getUrl()}`)
}

bootstrap()
