/**
 * @Column()：创建表列，@Column("double")可以设置其他数据类型，@Column({length: 100})可以设置长度
 * @PrimaryColumn()：创建主键
 * @PrimaryGeneratedColumn()：创建自动生成的列
 * 默认情况下，字符串被映射到一个 varchar(255)类型（取决于数据库类型）
 * 默认情况下，数字被映射到一个类似整数类型（取决于数据库类型）
 */
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from './User';

@Entity({ name: 'articles' })
export class Article {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  title!: string;

  @Column()
  content!: string;

  @Column()
  views!: number;

  @Column()
  create_time!: Date;

  @Column()
  update_time!: Date;

  @Column()
  is_delete!: number;

  // 多篇文章可以关联一个用户，多对一
  @ManyToOne((type) => User, {
    cascade: true, // 为给定关系设置级联选项，true表示允许在数据库中插入或更新相关对象
  })
  @JoinColumn({ name: 'user_id' })
  user!: User;
}
