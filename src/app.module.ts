import { join } from 'path'
import * as process from 'process'

import { StorageModule } from '@it-incubator/storage-sdk'
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common'
import { CqrsModule } from '@nestjs/cqrs'
import { ServeStaticModule } from '@nestjs/serve-static'
import { MailerModule } from '@nestjs-modules/mailer'

import { FileUploadService } from './infrastructure/file-upload-service/file-upload.service'
import { AuthModule } from './modules/auth/auth.module'
import { JwtRefreshStrategy } from './modules/auth/strategies/jwt-refresh.strategy'
import { JwtStrategy } from './modules/auth/strategies/jwt.strategy'
import { CardsModule } from './modules/cards/cards.module'
import { DecksModule } from './modules/decks/decks.module'
import { UsersModule } from './modules/users/users.module'
import { PrismaModule } from './prisma.module'
import { ConfigModule } from './settings/config.module'

@Module({
  imports: [
    CqrsModule,
    ConfigModule,
    UsersModule,
    AuthModule,
    DecksModule,
    CardsModule,
    PrismaModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'client'),
    }),
    StorageModule.register({
      baseURL: process.env.STORAGE_SERVICE_URL,
      headers: {
        'service-token': process.env.STORAGE_SERVICE_TOKEN,
      },
    }),
    MailerModule.forRoot({
      transport: {
        host: process.env.AWS_SES_SMTP_HOST,
        port: +process.env.AWS_SES_SMTP_PORT,
        secure: false,
        auth: {
          user: process.env.AWS_SES_SMTP_USER,
          pass: process.env.AWS_SES_SMTP_PASS,
        },
      },
    }),
  ],
  controllers: [],
  providers: [JwtStrategy, JwtRefreshStrategy, FileUploadService],
  exports: [CqrsModule, FileUploadService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    // consumer.apply(LoggerMiddleware).forRoutes('*') // applies the middleware to all routes
  }
}
