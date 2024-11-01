import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/users/entities/user.entity';
import i18n from 'src/i18n.setup';
@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signIn(
    email: string,
    pass: string,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const user = await this.usersService.findOneBy(email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const isPasswordMatching = await this.usersService.comparePassword(
      pass,
      user.password,
    );
    if (!isPasswordMatching) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return {
      accessToken: await this.generateToken(user, false),
      refreshToken: await this.generateToken(user, true),
    };
  }

  async signUp(
    email: string,
    password: string,
    repeatPassword: string,
  ): Promise<{ result: string }> {
    if (await this.usersService.findOneBy(email)) {
      throw new UnauthorizedException('User already exists');
    }
    if (password !== repeatPassword) {
      throw new UnauthorizedException(i18n.t('PASSWORDS_DO_NOT_MATCH'));
    }
    const hashedPassword = await this.usersService.hashPassword(password);
    const result = await this.usersService.create(email, hashedPassword);
    if (result) {
      return { result: i18n.t('USER_CREATED') };
    }
  }

  async generateToken(user: User, isRefreshToken: boolean): Promise<string> {
    const payload = { email: user.email, sub: user.id };
    return await this.jwtService.signAsync(payload, {
      secret: isRefreshToken
        ? process.env.REFRESH_TOKEN_SECRET
        : process.env.ACCESS_TOKEN_SECRET,
      expiresIn: isRefreshToken ? '7d' : '15m',
    });
  }

  async validateToken(token: string): Promise<boolean> {
    return true;
  }
}
