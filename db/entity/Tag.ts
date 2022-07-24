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
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { Article } from './Article';
import { User } from './User';

@Entity({ name: 'tags' })
export class Tag {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  title!: string;

  @Column()
  icon!: string;

  @Column()
  follow_count!: number;

  @Column()
  article_count!: number;

  // 一个标签可以关联多个用户，同时多个用户也可以关联多个标签，多对多
  // 多对多的关系不能通过在一个表里设置外键，需要新建一张关联表，默认表名为tags_users_users
  @ManyToMany((type) => User, {
    cascade: true, // 为给定关系设置级联选项，true表示允许在数据库中插入或更新相关对象
  })
  @JoinTable({
    joinColumn: {
      name: 'tag_id',
    },
    inverseJoinColumn: {
      name: 'user_id',
    },
  })
  users!: User[];

  // 一个标签可以关联多篇文章，同时多篇文章也可以关联多个标签，多对多
  // 多对多的关系不能通过在一个表里设置外键，需要新建一张关联表，默认表名为tags_articles_articles
  @ManyToMany((type) => Article)
  @JoinTable({
    joinColumn: {
      name: 'tag_id',
    },
    inverseJoinColumn: {
      name: 'article_id',
    },
  })
  articles!: Article[];
}
