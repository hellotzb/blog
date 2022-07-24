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
import { Article } from './Article';
import { User } from './User';

@Entity({ name: 'comments' })
export class Comment {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  content!: string;

  @Column()
  create_time!: Date;

  @Column()
  update_time!: Date;

  // 多个评论可以关联一个用户，多对一
  @ManyToOne((type) => User)
  @JoinColumn({ name: 'user_id' })
  user!: User;

  // 多个评论可以关联一个篇文章，多对一
  @ManyToOne((type) => Article)
  @JoinColumn({ name: 'article_id' })
  article!: Article;
}
