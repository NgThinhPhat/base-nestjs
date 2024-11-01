import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendMail(to: string, subject: string, text: string): Promise<void> {
    const mailOptions = {
      from: process.env.EMAIL_USER, // Sender address
      to, // List of receivers
      subject, // Subject line
      text, // Plain text body
    };

    try {
      await this.mailerService.sendMail(mailOptions);
      console.log('Email sent successfully');
    } catch (error) {
      console.error('Error sending email:', error);
    }
  }

  async sendConfirmationEmail(to: string, code: string): Promise<void> {
    const subject = 'Please Confirm Your Email Address';
    const text = `Hello,\n\nPlease confirm your email address by clicking the link below:\n${code}\n\nThank you!`;

    await this.sendMail(to, subject, text);
  }
}
