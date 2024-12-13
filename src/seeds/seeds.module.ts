import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { SeedService } from './seeds.service';
import { Permission } from 'src/permissions/entities/permissions.entity';
import { Role } from 'src/roles/entities/roles.entity';
import { Profile } from 'src/profile/entities/profile.entity';
import { Post } from 'src/post/entities/post.entity';
import { Tag } from 'src/tag/entities/tag.entity';
import { UsersModule } from 'src/users/users.module';
import { UsersService } from 'src/users/users.service';
import { RolesService } from 'src/roles/roles.service';
import { ProfileService } from 'src/profile/profile.service';
import { PostService } from 'src/post/post.service';
import { TagService } from 'src/tag/tag.service';
import { PermissionsModule } from 'src/permissions/permissions.module';
import { ProfileModule } from 'src/profile/profile.module';
import { PostModule } from 'src/post/post.module';
import { TagModule } from 'src/tag/tag.module';
import { RolesModule } from 'src/roles/roles.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Role, Permission, Profile, Post, Tag]),
    UsersModule,
    PermissionsModule,
    ProfileModule,
    PostModule,
    TagModule,
    RolesModule,
  ],
  providers: [
    SeedService,
    UsersService,
    RolesService,
    ProfileService,
    PostService,
    TagService,
  ],
  exports: [SeedService],
})
export class SeedsModule { }
