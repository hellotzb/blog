import user, { IUser } from './user';

export interface IStore {
  user: IUser;
}

export default function createStore(initialValue: IStore) {
  return () => ({
    user: { ...user(), ...initialValue?.user },
  });
}
