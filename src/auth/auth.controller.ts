import { Body, Controller, Get, Post, Req, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Public } from './decorators/public.decorator';
import { SignInDto } from './dto/signin.dto';
import { SignUpDto } from './dto/signup.dto';
import { Response } from 'express';
import { MailService } from 'src/mail/mail.service';
import { generateRandomString } from 'src/generateRandomString';
import { UsersService } from 'src/users/users.service';
import i18n from 'src/i18n.setup';
@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private mailService: MailService,
  ) { }

  @Public()
  @Post('sign-in')
  async signIn(@Body() userSignInDto: SignInDto) {
    return this.authService.signIn(userSignInDto.email, userSignInDto.password);
  }

  @Public()
  @Post('sign-up')
  async signUp(@Body() signUpDto: SignUpDto, res: Response) {
    return this.authService.signUp(
      signUpDto.email,
      signUpDto.password,
      signUpDto.repeatPassword,
    );
  }
  @Public()
  @Get('check')
  async check() {
    return 'hello';
  }
  @Public()
  @Post('send-code')
  async sendVerificationCode(
    @Body('email') email: string,
    @Res() response: Response,
  ) {
    // Generate a random verification code of length 6
    const verificationCode = generateRandomString(6);

    response.cookie('verificationCode', verificationCode, {
      httpOnly: true, // Cookie not accessible via JavaScript
      maxAge: 15 * 60 * 1000, // Cookie expires in 15 minutes
    });

    await this.mailService.sendConfirmationEmail(email, verificationCode);

    return response.send({
      message: i18n.t('Verification code sent'),
      verificationCode,
    });
  }
}
