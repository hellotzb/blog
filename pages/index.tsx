import type { NextPage } from 'next';
import { GetServerSideProps } from 'next';
import { AppDataSource } from '@/db/data-source';
import { Article } from '@/db/entity';
import ListItem from '@/components/ListItem';
import { IArticle } from './api';
import { Divider } from 'antd';

import styles from './index.module.scss';

interface IProps {
  articles: IArticle[];
}

export const getServerSideProps: GetServerSideProps = async () => {
  if (!AppDataSource.isInitialized) {
    await AppDataSource.initialize();
  }
  const articles = await AppDataSource.getRepository(Article).find({
    relations: {
      user: true, // 返回值关联users表
    },
  });

  // console.log('server-articles', articles);

  return {
    props: { articles: JSON.parse(JSON.stringify(articles)) || [] },
  };
};

const Home: NextPage<IProps> = (props) => {
  const { articles = [] } = props;
  console.log('client-articles', articles);
  return (
    <div className={styles['content-layout']}>
      {articles?.map((article) => (
        <div key={article.id}>
          <ListItem article={article} />
          <Divider />
        </div>
      ))}
    </div>
  );
};

export default Home;
