import { Global, Module } from '@nestjs/common';
import { EmailService } from './email.service';
import { MailerModule } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';
import { join } from 'path';
import { EjsAdapter } from '@nestjs-modules/mailer/dist/adapters/ejs.adapter';

@Global()
@Module({
  providers: [EmailService],
  imports: [
    MailerModule.forRootAsync({
      useFactory: async () => ({
        transport: {
          host: process.env.SMTP_HOST,
          secure: true,
          auth: {
            user: process.env.SMTP_EMAIL,
            pass: process.env.SMTP_PASSWORD,
          },
        },
        defaults: {
          from: process.env.SMTP_USER,
        },
        template: {
          dir: join(__dirname, '..', '../../../email-templates'),
          adapter: new EjsAdapter(),
          options: {
            strict: false,
          },
        },
        inject: [ConfigService],
      }),
    }),
  ],
})
export class EmailModule {}
