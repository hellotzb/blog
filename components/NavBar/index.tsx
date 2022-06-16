import type { NextPage } from 'next';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Avatar, Button, Dropdown, Menu } from 'antd';
import { LoginOutlined, HomeOutlined } from '@ant-design/icons';
import { useState } from 'react';
import Login from '../Login';
import { useStore } from '@/pages/_app';

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

const NavBar: NextPage = () => {
  const [isShowLogin, setIsShowLogin] = useState(false);
  const { pathname } = useRouter();
  const store = useStore();
  const { userId, avatar } = store.user.userInfo;

  const toEditor = () => {};

  const handleLogin = () => {
    setIsShowLogin(true);
  };

  const handleClose = () => {
    setIsShowLogin(false);
  };

  const renderDropdown = () => {
    return (
      <Menu>
        <Menu.Item>
          <HomeOutlined />
          &nbsp;个人主页
        </Menu.Item>
        <Menu.Item>
          <LoginOutlined />
          &nbsp;退出
        </Menu.Item>
      </Menu>
    );
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

export default NavBar;
