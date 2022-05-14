import type { NextApiRequest, NextApiResponse } from 'next';

interface Data {
  code: number;
  data: number;
}

export default async function sendVerifyCode(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const data = {
    code: 0,
    data: 123,
  };
  res.status(200).json(data);
}
