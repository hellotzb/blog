import type { GetServerSideProps, NextPage } from 'next';
import '@uiw/react-md-editor/markdown-editor.css';
import '@uiw/react-markdown-preview/markdown.css';
import dynamic from 'next/dynamic';
import { ChangeEvent, useEffect, useState } from 'react';
import { Button, Input, message, Select } from 'antd';
import request from 'service/fetch';
import { observer } from 'mobx-react-lite';
import { useRouter } from 'next/router';
import { AppDataSource } from '@/db/data-source';
import { Article } from '@/db/entity';
import { IArticle, ITag } from '../api';

import styles from './index.module.scss';

interface IProps {
  article: IArticle;
}

const MDEditor = dynamic(() => import('@uiw/react-md-editor'), { ssr: false });

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { params } = context;
  const articleId = params?.id;
  if (!AppDataSource.isInitialized) {
    await AppDataSource.initialize();
  }

  const articleRepo = AppDataSource.getRepository(Article);
  const article = await articleRepo.findOne({
    where: {
      id: Number(articleId),
    },
    relations: {
      user: true, // 返回值关联users表
      tags: true, // 返回值关联tag表
    },
  });

  return {
    props: { article: JSON.parse(JSON.stringify(article)) || {} },
  };
};

const ModifyEditor: NextPage<IProps> = ({ article }) => {
  const defaultTagIds = article?.tags?.map((tag) => tag.id) || [];
  const [content, setContent] = useState(article?.content || '');
  const [title, setTitle] = useState(article?.title || '');
  const [tagIds, setTagIds] = useState(defaultTagIds);
  const [allTags, setAllTags] = useState<ITag[]>([]);
  const { query, push } = useRouter();
  const articleId = Number(query?.id);

  useEffect(() => {
    request.get('/api/tag/get').then((res: any) => {
      if (res?.code === 0) {
        setAllTags(res?.data?.allTags || []);
      }
    });
  }, []);

  const handlePublish = () => {
    if (!title) {
      message.warning('请输入文章标题');
    } else {
      request
        .post('/api/article/update', {
          id: articleId,
          title,
          content,
          tagIds,
        })
        .then((res: any) => {
          if (res?.code === 0) {
            message.success('编辑成功');
            articleId ? push(`/article/${articleId}`) : push('/');
          } else {
            message.error(res?.msg || '编辑失败');
          }
        });
    }
  };

  const handleTitleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setTitle(e?.target?.value);
  };

  const handleInputChange = (content?: string) => {
    setContent(content!);
  };

  const handleSelectTag = (value: []) => {
    const tagIds = value.map(
      (item) => allTags?.find((tag) => tag.title === item)?.id as number
    );
    setTagIds(tagIds);
  };

  return (
    <div className={styles.container}>
      <div className={styles.operation}>
        <Input
          className={styles.title}
          placeholder="请输入文章标题"
          value={title}
          onChange={handleTitleChange}
        />
        <Select
          className={styles.tag}
          mode="multiple"
          allowClear
          placeholder="请选择标签"
          defaultValue={article?.tags?.map((tag) => tag.title) as []}
          onChange={handleSelectTag}
        >
          {allTags?.map((tag: any) => (
            <Select.Option key={tag?.title}>{tag?.title}</Select.Option>
          ))}
        </Select>
        <Button
          className={styles.button}
          type="primary"
          onClick={handlePublish}
        >
          发布
        </Button>
      </div>
      <MDEditor value={content} onChange={handleInputChange} height={1080} />
    </div>
  );
};

ModifyEditor.layout = null;

export default observer(ModifyEditor);
