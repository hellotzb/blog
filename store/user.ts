export type IUserInfo = {
  userId?: number | null;
  nickname?: string;
  avatar?: string;
};

export interface IUser {
  userInfo: IUserInfo;
  setUserInfo: (value: IUserInfo) => void;
}

const user = (): IUser => {
  return {
    userInfo: {},
    setUserInfo: function (value) {
      this.userInfo = value;
    },
  };
};

export default user;
