/**
 * @Column()：创建表列，@Column("double")可以设置其他数据类型，@Column({length: 100})可以设置长度
 * @PrimaryColumn()：创建主键
 * @PrimaryGeneratedColumn()：创建自动生成的列
 * 默认情况下，字符串被映射到一个 varchar(255)类型（取决于数据库类型）
 * 默认情况下，数字被映射到一个类似整数类型（取决于数据库类型）
 */
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  nickname!: string;

  @Column()
  avatar!: string;

  @Column()
  job!: string;

  @Column()
  introduce!: string;
}
