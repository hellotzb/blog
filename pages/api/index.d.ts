import { IronSession } from 'iron-session';
import { IUserInfo } from 'store/user';

export type ISession = IronSession & Record<string, any>;

export type IArticle = {
  id: number;
  title: string;
  content: string;
  create_time: Date;
  update_time: Date;
  views: number;
  user: IUserInfo;
};
