import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from './enums/role.enum';
@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}
  @Roles(Role.Admin)
  findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  create(email: string, password: string): Promise<User> {
    return this.usersRepository.save({ email, password });
  }

  findOneBy(email: string): Promise<User | null> {
    return this.usersRepository.findOneBy({ email });
  }

  findOne(id: number): Promise<User | null> {
    return this.usersRepository.findOneBy({ id });
  }

  async remove(id: number): Promise<void> {
    await this.usersRepository.delete(id);
  }

  async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 5);
  }
  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.usersRepository.findOne({
      where: { email },
      relations: ['roles', 'roles.permissions'],
    });
    if (user && user.password === pass) {
      return user; // Ensure roles and permissions are loaded here
    }
    return null;
  }
  async comparePassword(
    plainPassword: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return bcrypt.compare(plainPassword, hashedPassword);
  }
}
