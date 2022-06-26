import type { NextPage } from 'next';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Avatar, Button, Dropdown, Menu, MenuProps } from 'antd';
import { observer } from 'mobx-react-lite';
import { LoginOutlined, HomeOutlined } from '@ant-design/icons';
import { useState } from 'react';
import Login from '../Login';
import { useStore } from '@/pages/_app';
import request from 'service/fetch';

import styles from './index.module.scss';

interface Navs {
  label: string;
  route: string;
}

const navs: Navs[] = [
  {
    label: '首页',
    route: '/',
  },
  {
    label: '咨询',
    route: '/info',
  },
  {
    label: '标签',
    route: '/tag',
  },
];

const menuItems = [
  {
    label: '个人主页',
    key: 'Home',
    icon: <HomeOutlined />,
  },
  {
    label: '退出',
    key: 'exit',
    icon: <LoginOutlined />,
  },
];

const NavBar: NextPage = () => {
  const [isShowLogin, setIsShowLogin] = useState(false);
  const { pathname } = useRouter();
  const store = useStore();
  const { id: userId, avatar } = store.user.userInfo;
  console.log('userInfo', store.user.userInfo);

  // 跳转主页
  const toHome = () => {};

  const toEditor = () => {};

  const handleLogin = () => {
    setIsShowLogin(true);
  };

  const handleClose = () => {
    setIsShowLogin(false);
  };

  // 退出登录
  const handleLogout = () => {
    request.post('/api/user/logout').then((res: any) => {
      if (res?.code === 0) {
        store.user.setUserInfo({});
      }
    });
  };

  const handleMenuItemClick: MenuProps['onClick'] = (e) => {
    console.log('click ', e);
    switch (e.key) {
      case 'Home':
        toHome();
        break;
      case 'exit':
        handleLogout();
        break;

      default:
        break;
    }
  };

  const renderDropdown = () => {
    return <Menu items={menuItems} onClick={handleMenuItemClick} />;
  };

  return (
    <div className={styles.navbar}>
      <section className={styles['logo-area']}>BLOG</section>
      <section className={styles['link-area']}>
        {navs?.map((nav) => (
          <Link key={nav?.label} href={nav?.route}>
            <a className={pathname === nav?.route ? styles.active : ''}>
              {nav?.label}
            </a>
          </Link>
        ))}
      </section>
      <section className={styles['operate-area']}>
        <Button onClick={toEditor}>写文章</Button>
        {/* 检查登录态 */}
        {userId ? (
          <>
            <Dropdown overlay={renderDropdown} placement="bottomLeft">
              <Avatar src={avatar} size={32} />
            </Dropdown>
          </>
        ) : (
          <Button type="primary" onClick={handleLogin}>
            登陆
          </Button>
        )}
      </section>
      <Login isShow={isShowLogin} onClose={handleClose} />
    </div>
  );
};

export default observer(NavBar);
