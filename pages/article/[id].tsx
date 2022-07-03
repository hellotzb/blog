import { AppDataSource } from '@/db/data-source';
import type { GetServerSideProps, NextPage } from 'next';
import { Article as ArticleEntity } from '@/db/entity';
import { IArticle } from '../api';
import { Avatar } from 'antd';
import { format } from 'date-fns';
import { observer } from 'mobx-react-lite';
import { useStore } from '@/pages/_app';
import MarkDown from 'markdown-to-jsx';
import Link from 'next/link';

import styles from './index.module.scss';

interface IProps {
  article: IArticle;
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { params } = context;
  const articleId = params?.id;
  if (!AppDataSource.isInitialized) {
    await AppDataSource.initialize();
  }

  const articleRepo = AppDataSource.getRepository(ArticleEntity);
  const article = await articleRepo.findOne({
    where: {
      id: Number(articleId),
    },
    relations: {
      user: true, // 返回值关联users表
    },
  });

  if (article) {
    // 增加文章阅读数
    article.views = article?.views + 1;
    await articleRepo.save(article);
  }

  return {
    props: { article: JSON.parse(JSON.stringify(article)) || {} },
  };
};

const Article: NextPage<IProps> = (props) => {
  const { article } = props;
  const {
    user: { id, nickname, avatar },
  } = article;
  const store = useStore();
  const loginUserInfo = store?.user?.userInfo;

  return (
    <div>
      <div className="content-layout">
        <h2 className={styles.title}>{article?.title}</h2>
        <div className={styles.user}>
          <Avatar src={avatar} size={50} />
          <div className={styles.info}>
            <div className={styles.name}>{nickname}</div>
            <div className={styles.date}>
              <div>
                {format(new Date(article?.update_time), 'yyyy-MM-dd hh:mm:ss')}
              </div>
              <div>阅读 {article?.views}</div>
              {Number(loginUserInfo?.id) === Number(id) && (
                <Link href={`/editor/${article?.id}`}>编辑</Link>
              )}
            </div>
          </div>
        </div>
        <MarkDown className={styles.markdown}>{article?.content}</MarkDown>
      </div>
    </div>
  );
};

export default observer(Article);
