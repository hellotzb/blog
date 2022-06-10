import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { User, UserAuths } from './entity';

const host = process.env.DATABASE_HOST;
const port = Number(process.env.DATABASE_PORT);
const username = process.env.DATABASE_USERNAME;
const password = process.env.DATABASE_PASSWORD;
const database = process.env.DATABASE_DATABASE;

export const AppDataSource = new DataSource({
  type: 'mysql',
  host,
  port,
  username,
  password,
  database,
  synchronize: true, // 设置synchronize可确保每次运行应用程序时实体都将与数据库同步。
  logging: false,
  entities: [User, UserAuths],
  // entities: ['@/db/entity/*.ts'],
  migrations: [],
  subscribers: [],
});

// AppDataSource.initialize()
//     .then(() => {
//         // here you can start to work with your database
//     })
//     .catch((error) => console.log(error))
