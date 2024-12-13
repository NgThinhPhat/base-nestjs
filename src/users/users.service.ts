import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from './enums/role.enum';
import { CreateUserDto } from './dto/create-user.dto';
import { Profile } from 'src/profile/entities/profile.entity';
@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Profile)
    private profileRepository: Repository<Profile>,
  ) { }

  @Roles(Role.Admin)
  findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  create(email: string, password: string): Promise<User> {
    return this.usersRepository.save({ email, password });
  }

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const user = new User();
    Object.assign(user, {
      email: createUserDto.email,
      password: createUserDto.password,
      firstName: createUserDto.firstName,
      lastName: createUserDto.lastName,
      isActive: createUserDto.isActive ?? false, // Default là false nếu không có giá trị
      role: 'user',
    });

    user.profile = createUserDto.profileId
      ? await this.profileRepository.findOneBy({ id: createUserDto.profileId })
      : null;
    return user;
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
