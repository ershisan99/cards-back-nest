import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common'
import { JwtStrategy } from './modules/auth/strategies/jwt.strategy'
import { ConfigModule } from './settings/config.module'
import { AuthModule } from './modules/auth/auth.module'
import { UsersModule } from './modules/users/users.module'
import { PrismaModule } from './prisma.module'
import { MailerModule } from '@nestjs-modules/mailer'
import * as process from 'process'
import { JwtRefreshStrategy } from './modules/auth/strategies/jwt-refresh.strategy'
import { CqrsModule } from '@nestjs/cqrs'
import { DecksModule } from './modules/decks/decks.module'
import { CardsModule } from './modules/cards/cards.module'
import { FileUploadService } from './infrastructure/file-upload-service/file-upload.service'

@Module({
  imports: [
    CqrsModule,
    ConfigModule,
    UsersModule,
    AuthModule,
    DecksModule,
    CardsModule,
    PrismaModule,
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
