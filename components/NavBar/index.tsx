import type { NextPage } from 'next';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Button } from 'antd';
import { useState } from 'react';
import Login from '../Login';

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

  const toEditor = () => {};

  const handleLogin = () => {
    setIsShowLogin(true);
  };

  const handleClose = () => {
    setIsShowLogin(false);
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
        <Button type="primary" onClick={handleLogin}>
          登陆
        </Button>
      </section>
      <Login isShow={isShowLogin} onClose={handleClose} />
    </div>
  );
};

export default NavBar;
