import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Permission } from './entities/permissions.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Permission])],
})
export class PermissionsModule {}
