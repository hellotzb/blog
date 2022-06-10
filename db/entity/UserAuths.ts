import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from './User';

@Entity({ name: 'user_auths' })
export class UserAuths {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  identity_type!: string;

  @Column()
  identifier!: string;

  @Column()
  credential!: string;

  // 多对一/一对多关系
  @ManyToOne((type) => User, {
    cascade: true, // 为给定关系设置级联选项，true表示允许在数据库中插入或更新相关对象
  })
  @JoinColumn({ name: 'user_id' })
  user!: User;
}
