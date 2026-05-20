import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendVerificationEmail(email: string, otp: string, name: string) {
    const text = `Hello ${name},\n\nYour verification code is ${otp}. It expires in 15 minutes.\n\nIf you did not request this, please ignore this email.`;

    await this.mailerService.sendMail({
      to: email,
      subject: 'Verify your email address',
      text,
    });
  }
}
