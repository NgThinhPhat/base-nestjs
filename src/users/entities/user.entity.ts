import { Post } from 'src/post/entities/post.entity';
import { Profile } from 'src/profile/entities/profile.entity';
import { Role } from 'src/roles/entities/roles.entity';
import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false, unique: true })
  email: string;

  @Column({ nullable: false })
  password: string;

  @Column({ nullable: true })
  firstName: string;

  @Column({ nullable: true })
  lastName: string;

  @Column({ default: false })
  isActive: boolean;

  @ManyToMany(() => Role, { cascade: true })
  @JoinTable() // Manages the many-to-many relationship between users and roles
  roles: Role[];

  @OneToOne(() => Profile, (profile) => profile.user, { cascade: true })
  @JoinColumn() // Indicates this side will hold the foreign key
  profile: Profile;

  @OneToMany(() => Post, (post) => post.user)
  posts: Post[];
}
