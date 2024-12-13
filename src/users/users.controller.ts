import { Controller, Get, Param, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { Public } from 'src/auth/decorators/public.decorator';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) { }

  @Public()
  @Get('find-all')
  async findAll(): Promise<any> {
    return this.usersService.findAll();
  }

  @Post('find-one/:id')
  async findOne(@Param('id') id: number): Promise<any> {
    return this.usersService.findOne(id);
  }

  @Post('remove/:id')
  async remove(@Param('id') id: number): Promise<any> {
    return this.usersService.remove(id);
  }
}
