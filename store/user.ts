export type IUserInfo = {
  id?: number | null;
  nickname?: string;
  avatar?: string;
};

export interface IUser {
  userInfo: IUserInfo;
  // eslint-disable-next-line no-unused-vars
  setUserInfo: (value: IUserInfo) => void;
}

const user = (): IUser => {
  return {
    userInfo: {},
    setUserInfo: function (value = {}) {
      this.userInfo = value;
    },
  };
};

export default user;
