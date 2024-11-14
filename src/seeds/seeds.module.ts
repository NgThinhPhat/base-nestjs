import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { SeedService } from './seeds.service';
import { Permission } from 'src/permissions/entities/permissions.entity';
import { Role } from 'src/roles/entities/roles.entity';
import { Profile } from 'src/profile/entities/profile.entity';
import { Post } from 'src/post/entities/post.entity';
import { Tag } from 'src/tag/entities/tag.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Role, Permission, Profile, Post, Tag]),
  ],
  providers: [SeedService],
  exports: [SeedService],
})
export class SeedsModule {}
