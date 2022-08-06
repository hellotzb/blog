import type { NextApiRequest, NextApiResponse } from 'next';
import { withIronSessionApiRoute } from 'iron-session/next';
import { EXCEPTION_ARTICLE, ironOptions } from 'config';
import { ISession } from '..';
import { AppDataSource } from '@/db/data-source';
import { Article, Tag, User } from '@/db/entity';

async function publish(req: NextApiRequest, res: NextApiResponse) {
  const session: ISession = req.session; // 被withIronSessionApiRoute包括会生成一个session对象
  const { title = '', content = '', tagIds = [] } = req.body;
  if (!AppDataSource.isInitialized) {
    await AppDataSource.initialize();
  }
  const userRepo = AppDataSource.getRepository(User);
  const articleRepo = AppDataSource.getRepository(Article);
  const tagRepo = AppDataSource.getRepository(Tag);

  const user = await userRepo.findOne({
    where: {
      id: session?.user?.id,
    },
  });

  const tags = await tagRepo.find({
    where: tagIds?.map((tagId: number) => ({ id: tagId })),
  });

  const article = new Article();
  article.title = title;
  article.content = content;
  article.create_time = new Date();
  article.update_time = new Date();
  article.is_delete = 0;
  article.views = 0;

  if (user) {
    article.user = user;
  }

  if (tags) {
    const newTags = tags?.map((tag) => {
      tag.article_count = tag?.article_count + 1;
      return tag;
    });
    article.tags = newTags;
  }

  try {
    const resArticle = await articleRepo.save(article);
    if (resArticle) {
      res.status(200).json({
        code: 0,
        msg: '发布成功',
        data: resArticle,
      });
    } else {
      res.status(200).json({
        ...EXCEPTION_ARTICLE.PUBLISH_FAIL,
      });
    }
  } catch (error) {
    res.status(500).json({
      ...EXCEPTION_ARTICLE.PUBLISH_FAIL,
    });
  }
}
export default withIronSessionApiRoute(publish, ironOptions);
