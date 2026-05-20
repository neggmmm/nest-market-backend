import { Global, Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthorizationGuard } from './guards/authorization.guard';
import { PermissionsService } from './permissions.service';
import { MailService } from './mailer.service';

@Global() // Makes providers available globally
@Module({
  imports: [
    ConfigModule,
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        transport: {
          host: configService.get<string>('mail.host'),
          port: configService.get<number>('mail.port'),
          secure: configService.get<boolean>('mail.secure'),
          auth: {
            user: configService.get<string>('mail.user'),
            pass: configService.get<string>('mail.pass'),
          },
        },
        defaults: {
          from: configService.get<string>('mail.from') || 'no-reply@example.com',
        },
      }),
    }),
  ],
  providers: [
    AuthorizationGuard,
    PermissionsService,
    MailService,
  ],
  exports: [
    AuthorizationGuard,
    PermissionsService,
    MailService,
  ],
})
export class CommonModule {}