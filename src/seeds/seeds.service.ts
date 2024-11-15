import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Permission } from 'src/permissions/entities/permissions.entity';
import { Role } from 'src/roles/entities/roles.entity';
import { User } from 'src/users/entities/user.entity';
import { Post } from 'src/post/entities/post.entity';
import { Profile } from 'src/profile/entities/profile.entity';
import { Tag } from 'src/tag/entities/tag.entity';

@Injectable()
export class SeedService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Role) private roleRepository: Repository<Role>,
    @InjectRepository(Permission)
    private permissionRepository: Repository<Permission>,
    @InjectRepository(Profile)
    private profileRepository: Repository<Profile>,
    @InjectRepository(Post)
    private postRepository: Repository<Post>,
    @InjectRepository(Tag)
    private tagRepository: Repository<Tag>,
  ) {}
  async clear() {}

  async seed() {
    await this.clearDatabase();
    const createPost = await this.permissionRepository.save({
      name: 'create_user',
    });
    const deletePost = await this.permissionRepository.save({
      name: 'delete_post',
    });

    const adminRole = this.roleRepository.create({
      name: 'admin',
      permissions: [createPost, deletePost],
    });

    const userRole = this.roleRepository.create({
      name: 'user',
      permissions: [createPost],
    });

    await this.roleRepository.save([adminRole, userRole]);
    await this.clearDatabase();
    await this.seedTags();
    await this.seedUsersAndProfiles();
    await this.seedPosts();
  }
  private async clearDatabase() {
    await this.roleRepository.delete({});
    await this.permissionRepository.delete({});
    await this.postRepository.delete({});
    await this.userRepository.delete({});
    await this.profileRepository.delete({});
    await this.tagRepository.delete({});
  }
  private async seedTags() {
    const tags = [
      { name: 'NestJS' },
      { name: 'TypeORM' },
      { name: 'JavaScript' },
      { name: 'Programming' },
    ];
    await this.tagRepository.save(tags);
  }

  private async seedUsersAndProfiles() {
    const user1 = this.userRepository.create({
      email: 'john@example.com',
      password: '123456',
    });

    const user2 = this.userRepository.create({
      email: 'jane@example.com',
      password: '123456',
    });
    const user3 = this.userRepository.create({
      email: 'nguyenthinhphat30091@gmail.com',
      password: '123456',
    });

    const profile1 = this.profileRepository.create({
      bio: 'Software developer',
      age: 30,
      user: user1,
    });

    const profile2 = this.profileRepository.create({
      bio: 'Technical writer',
      age: 28,
      user: user2,
    });
    const profile3 = this.profileRepository.create({
      bio: 'Technical writer',
      age: 28,
      user: user3,
    });

    await this.userRepository.save([user1, user2, user3]);
    await this.profileRepository.save([profile1, profile2, profile3]);
  }

  private async seedPosts() {
    const user1 = await this.userRepository.findOne({
      where: { email: 'john@example.com' },
    });
    const user2 = await this.userRepository.findOne({
      where: { email: 'jane@example.com' },
    });
    const user3 = await this.userRepository.findOne({
      where: { email: 'nguyenthinhphat3009@gmail.com' },
    });
    const tags = await this.tagRepository.find();

    const post1 = this.postRepository.create({
      title: 'Getting started with NestJS',
      content: 'This is a guide to get started with NestJS...',
      user: user1,
      tags: [tags[0], tags[1]],
    });

    const post2 = this.postRepository.create({
      title: 'Understanding TypeORM',
      content: 'This post explains how TypeORM works...',
      user: user2,
      tags: [tags[1], tags[2]],
    });

    const post3 = this.postRepository.create({
      title: 'Understanding TypeORM',
      content: 'This post explains how TypeORM works...',
      user: user3,
      tags: [tags[1], tags[2]],
    });

    await this.postRepository.save([post1, post2, post3]);
  }
}
