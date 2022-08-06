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
  OneToMany,
  ManyToMany,
} from 'typeorm';
import { User } from './User';
import { Comment } from './Comment';
import { Tag } from './Tag';

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

  // 一篇文章可以关联多个标签，同时一个标签也可以关联多篇文章，多对多
  // 多对多的关系不能通过在一个表里设置外键，需要新建一张关联表，默认表名为tags_articles_articles
  @ManyToMany((type) => Tag, (tag) => tag.articles, {
    cascade: true,
  })
  tags!: Tag[];

  // 一篇文章可以关联多条评论，一对多
  @OneToMany((type) => Comment, (comment) => comment.article)
  comments!: Comment[];
}
