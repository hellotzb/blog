import { useEffect, useState } from 'react';
import type { NextPage } from 'next';
import { GetServerSideProps } from 'next';
import { AppDataSource } from '@/db/data-source';
import { Article, Tag } from '@/db/entity';
import ListItem from '@/components/ListItem';
import { IArticle } from './api';
import request from 'service/fetch';
import { Divider } from 'antd';
import classnames from 'classnames';

import styles from './index.module.scss';

interface ITag {
  id: number;
  title: string;
}

interface IProps {
  articles: IArticle[];
  tags: ITag[];
}

export const getServerSideProps: GetServerSideProps = async () => {
  if (!AppDataSource.isInitialized) {
    await AppDataSource.initialize();
  }
  const articles = await AppDataSource.getRepository(Article).find({
    relations: {
      user: true, // 返回值关联users表
      tags: true, // 返回值关联tags表
    },
  });
  const tags = await AppDataSource.getRepository(Tag).find({
    relations: {
      users: true, // 返回值关联users表
    },
  });

  // console.log('server-articles', articles);

  return {
    props: {
      articles: JSON.parse(JSON.stringify(articles)) || [],
      tags: JSON.parse(JSON.stringify(tags)) || [],
    },
  };
};

const Home: NextPage<IProps> = (props) => {
  const { articles = [], tags = [] } = props;
  const [selectTag, setSelectTag] = useState(0);
  const [showAricles, setShowAricles] = useState<IArticle[]>([...articles]);

  const handleSelectTag = (event: any) => {
    const { tagid } = event?.target?.dataset || {};
    setSelectTag(Number(tagid));
  };

  useEffect(() => {
    selectTag &&
      request.get(`/api/article/get?tag_id=${selectTag}`).then((res: any) => {
        if (res?.code === 0) {
          setShowAricles(res?.data);
        }
      });
  }, [selectTag]);

  return (
    <div>
      <div className={styles.tags} onClick={handleSelectTag}>
        {tags?.map((tag) => (
          <div
            key={tag?.id}
            data-tagid={tag?.id}
            className={classnames(
              styles.tag,
              selectTag === tag?.id ? styles['active'] : ''
            )}
          >
            {tag?.title}
          </div>
        ))}
      </div>
      <div className="content-layout">
        {showAricles?.map((article) => (
          <>
            {/* <ListItem article={article} /> */}
            <DynamicComponent article={article} />
            <Divider />
          </>
        ))}
      </div>
    </div>
  );
};

export default Home;
