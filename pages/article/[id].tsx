import { useState } from 'react';
import { AppDataSource } from '@/db/data-source';
import type { GetServerSideProps, NextPage } from 'next';
import { Article as ArticleEntity } from '@/db/entity';
import { IArticle } from '../api';
import { Avatar, Button, Divider, Input, message } from 'antd';
import { format } from 'date-fns';
import { observer } from 'mobx-react-lite';
import { useStore } from '@/pages/_app';
import MarkDown from 'markdown-to-jsx';
import Link from 'next/link';
import request from 'service/fetch';

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
      comments: {
        user: true, // 返回值关联comments表，且commments表关联user表
      },
    },
    order: {
      comments: {
        create_time: 'DESC', // 按评论时间倒序排列
      },
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
  console.log('article', article);

  const {
    user: { id, nickname, avatar },
  } = article;
  const store = useStore();
  const loginUserInfo = store?.user?.userInfo;
  const [inputVal, setInputVal] = useState('');
  const [comments, setComments] = useState(article?.comments || []);

  const handleComment = () => {
    request
      .post('/api/comment/publish', {
        articleId: article?.id,
        content: inputVal,
      })
      .then((res: any) => {
        if (res?.code === 0) {
          message.success('发表成功');
          const newComments = [
            {
              id: Math.random(),
              create_time: new Date(),
              update_time: new Date(),
              content: inputVal,
              user: {
                avatar: loginUserInfo?.avatar,
                nickname: loginUserInfo?.nickname,
              },
            },
          ].concat([...(comments as any)]);
          setComments(newComments);
          setInputVal('');
        } else {
          message.error('发表失败');
        }
      });
  };

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
      <div className={styles.divider}></div>
      <div className="content-layout">
        <div className={styles.comment}>
          <h3>评论</h3>
          {loginUserInfo?.id && (
            <div className={styles.enter}>
              <Avatar src={avatar} size={40} />
              <div className={styles.content}>
                <Input.TextArea
                  placeholder="请输入评论"
                  rows={4}
                  value={inputVal}
                  onChange={(event) => setInputVal(event?.target?.value)}
                />
                <Button type="primary" onClick={handleComment}>
                  发表评论
                </Button>
              </div>
            </div>
          )}
          <Divider />
          <div className={styles.display}>
            {comments?.map((comment: any) => (
              <div className={styles.wrapper} key={comment?.id}>
                <Avatar src={comment?.user?.avatar} size={40} />
                <div className={styles.info}>
                  <div className={styles.name}>
                    <div>{comment?.user?.nickname}</div>
                    <div className={styles.date}>
                      {format(
                        new Date(comment?.update_time),
                        'yyyy-MM-dd hh:mm:ss'
                      )}
                    </div>
                  </div>
                  <div className={styles.content}>{comment?.content}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default observer(Article);
