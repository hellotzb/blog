// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import { mock, Random } from 'mockjs';

interface IList {
  id: number;
  name: string;
  birthday: string;
  address: string;
}

interface Data {
  list: IList[];
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  // Mock.mock( rurl?, rtype?, template|function( options ) )
  const data = mock({
    // 属性 list 的值是一个数组，其中含有 1 到 10 个元素
    'list|1-10': [
      {
        // 属性 id 是一个自增数，起始值为 1，每次增 1
        'id|+1': 1,
        'name|1': [
          Random.cname(),
          Random.cname(),
          Random.cname(),
          Random.cname(),
        ],
        birthday: Random.date('yyyy-MM-dd'),
        address: Random.county(true),
      },
    ],
  });
  res.status(200).json(data);
}
