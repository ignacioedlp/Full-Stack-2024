import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

type mailOptions = {
  subject: string;
  email: string;
  name: string;
  activationCode: string;
  template: string;
};

@Injectable()
export class EmailService {
  constructor(private mailService: MailerService) {}

  async sendEmail({
    subject,
    email,
    name,
    activationCode,
    template,
  }: mailOptions) {
    try {
      await this.mailService.sendMail({
        to: email,
        subject,
        template,
        context: {
          name,
          activationCode,
        },
      });
    } catch (error) {
      console.error(error);
      throw new Error('Error sending email');
    }
  }
}
