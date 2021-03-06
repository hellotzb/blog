import type { AppProps } from 'next/app';
import { SWRConfig } from 'swr';
import axios from 'axios';
import Layout from '../components/Layout';
import React, { createContext, useContext } from 'react';
import { useLocalObservable, enableStaticRendering } from 'mobx-react-lite';
import createStore, { IStore } from 'store';

import '../styles/globals.css';

interface IProps {
  initialValue: Record<any, any>;
  children: React.ReactElement;
}

const options = {
  fetcher: (url: string) => axios.post(url).then((res) => res.data),
};

// 如果 observer 是服务器渲染的 rendering context；请确保调用 enableStaticRendering(true)， 这样 observer 将不会订阅任何可观察对象， 并且就不会有 GC 问题产生了。
enableStaticRendering(!process.browser);

const StoreContext = createContext({});

export const useStore = () => {
  const store: IStore = useContext(StoreContext) as IStore;
  if (!store) {
    throw new Error('Store is not defined');
  }
  return store;
};

const StoreProvider: React.FC<IProps> = ({ initialValue, children }) => {
  const store: IStore = useLocalObservable(createStore(initialValue));
  return (
    <StoreContext.Provider value={store}>{children}</StoreContext.Provider>
  );
};

function MyApp({
  Component,
  pageProps,
  initialValue,
}: AppProps & { initialValue: Record<any, any> }) {
  const renderLayout = () => {
    // Component.layout为自定义属性，用于区分是否需要渲染Layout
    if (Component.layout === null) {
      return <Component {...pageProps} />;
    } else {
      return (
        <Layout>
          <Component {...pageProps} />
        </Layout>
      );
    }
  };
  return (
    <StoreProvider initialValue={initialValue}>
      <SWRConfig value={options}>{renderLayout()}</SWRConfig>
    </StoreProvider>
  );
}

// 从cookies获取userInfo设置登录态
MyApp.getInitialProps = async ({ ctx }: any) => {
  const cookies = ctx?.req?.cookies || {};
  let userInfo = {};
  console.log('cookies.blogUser', cookies.blogUser);

  try {
    userInfo = JSON.parse(cookies.blogUser || '{}');
  } catch (error) {
    console.log(error);
  }

  return {
    initialValue: {
      user: { userInfo },
    },
  };
};

export default MyApp;
