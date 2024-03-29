import React from 'react';
import Link from 'next/link';
import { observer } from 'mobx-react-lite';
import { Button, Avatar, Divider } from 'antd';
import {
  CodeOutlined,
  FireOutlined,
  FundViewOutlined,
} from '@ant-design/icons';
import ListItem from 'components/ListItem';
import { User, Article } from 'db/entity';
import styles from './index.module.scss';
import { AppDataSource } from '@/db/data-source';

// SSG渲染
export async function getStaticPaths() {
  // user/[id]
  if (!AppDataSource.isInitialized) {
    await AppDataSource.initialize();
  }
  const users = await AppDataSource.getRepository(User).find();
  const userIds = users?.map((user) => ({ params: { id: String(user?.id) } }));

  // https://nextjs.org/docs/api-reference/data-fetching/get-static-paths#getstaticpaths-return-values
  return {
    paths: userIds,
    fallback: 'blocking',
  };
}
// SSG渲染
export async function getStaticProps({ params }: { params: any }) {
  const userId = params?.id;
  if (!AppDataSource.isInitialized) {
    await AppDataSource.initialize();
  }
  const user = await AppDataSource.getRepository(User).findOne({
    where: {
      id: Number(userId),
    },
  });
  const articles = await AppDataSource.getRepository(Article).find({
    where: {
      user: {
        id: Number(userId),
      },
    },
    relations: {
      user: true, // 返回值关联users表
      tags: true, // 返回值关联tags表
    },
  });

  return {
    props: {
      userInfo: JSON.parse(JSON.stringify(user)),
      articles: JSON.parse(JSON.stringify(articles)),
    },
  };
}

// SSR渲染
// export async function getServerSideProps({ params }: { params: any }) {
//   const userId = params?.id;
//   const db = await prepareConnection();
//   const user = await db.getRepository(User).findOne({
//     where: {
//       id: Number(userId),
//     },
//   });
//   const articles = await db.getRepository(Article).find({
//     where: {
//       user: {
//         id: Number(userId),
//       },
//     },
//     relations: {
//       user: true, // 返回值关联users表
//       tags: true, // 返回值关联tags表
//     },
//   });

//   return {
//     props: {
//       userInfo: JSON.parse(JSON.stringify(user)),
//       articles: JSON.parse(JSON.stringify(articles)),
//     },
//   };
// }

const UserDetail = (props: any) => {
  const { userInfo = {}, articles = [] } = props;
  const viewsCount = articles?.reduce(
    (prev: any, next: any) => prev + next?.views,
    0
  );

  return (
    <div className={styles.userDetail}>
      <div className={styles.left}>
        <div className={styles.userInfo}>
          <Avatar className={styles.avatar} src={userInfo?.avatar} size={90} />
          <div>
            <div className={styles.nickname}>{userInfo?.nickname}</div>
            <div className={styles.desc}>
              <CodeOutlined /> {userInfo?.job}
            </div>
            <div className={styles.desc}>
              <FireOutlined /> {userInfo?.introduce}
            </div>
          </div>
          <Link href="/user/profile">
            <Button>编辑个人资料</Button>
          </Link>
        </div>
        <Divider />
        <div className={styles.article}>
          {articles?.map((article: any) => (
            <div key={article?.id}>
              <ListItem article={article} />
              <Divider />
            </div>
          ))}
        </div>
      </div>
      <div className={styles.right}>
        <div className={styles.achievement}>
          <div className={styles.header}>个人成就</div>
          <div className={styles.number}>
            <div className={styles.wrapper}>
              <FundViewOutlined />
              <span>共创作 {articles?.length} 篇文章</span>
            </div>
            <div className={styles.wrapper}>
              <FundViewOutlined />
              <span>文章被阅读 {viewsCount} 次</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default observer(UserDetail);
