import type { NextApiRequest, NextApiResponse } from 'next';
import { EXCEPTION_ARTICLE } from 'config';
import { AppDataSource } from '@/db/data-source';
import { Article } from '@/db/entity';

async function update(req: NextApiRequest, res: NextApiResponse) {
  const { title = '', content = '', id = 0 } = req.body;

  if (!AppDataSource.isInitialized) {
    await AppDataSource.initialize();
  }
  const articleRepo = AppDataSource.getRepository(Article);
  const article = await articleRepo.findOne({
    where: {
      id,
    },
    relations: {
      user: true, // 返回值关联users表
    },
  });

  if (article) {
    article.title = title;
    article.content = content;
    article.update_time = new Date();

    try {
      const resArticle = await articleRepo.save(article);
      if (resArticle) {
        res.status(200).json({
          code: 0,
          msg: '编辑成功',
          data: resArticle,
        });
      } else {
        res.status(200).json({
          ...EXCEPTION_ARTICLE.UPDATE_FAIL,
        });
      }
    } catch (error) {
      res.status(500).json({
        ...EXCEPTION_ARTICLE.UPDATE_FAIL,
      });
    }
  } else {
    res.status(404).json({
      ...EXCEPTION_ARTICLE.NOT_FOUND_ARTICLE,
    });
  }
}
export default update;
