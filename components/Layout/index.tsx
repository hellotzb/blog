import type { NextPage } from 'next';
import React from 'react';
import Footer from '../Footer';
import NavBar from '../NavBar';

interface IProps {
  children: React.ReactNode;
}

const Layout: NextPage<IProps> = ({ children }) => {
  return (
    <div>
      <NavBar />
      <main>{children}</main>
      <Footer />
    </div>
  );
};

export default Layout;
