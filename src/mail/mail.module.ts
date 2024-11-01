import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { MailService } from './mail.service'; // Adjust the path if necessary

@Module({
  imports: [
    MailerModule.forRoot({
      transport: {
        service: 'gmail',
        auth: {
          user: 'nguyenthinhphat3009@gmail.com', // Your email
          pass: 'flnqdfxnbnljnmdo', // Your password or App Password
        },
      },
      defaults: {
        from: '"No Reply" <your-email@gmail.com>',
      },
    }),
  ],
  providers: [MailService],
  exports: [MailService], // Export the MailService if needed elsewhere
})
export class MailModule {
  constructor() {
    console.log(
      'MailModule loaded' + process.env.EMAIL_USER + process.env.EMAIL_PASSWORD,
    );
  }
}
