import type { NextApiRequest, NextApiResponse } from 'next';
import { format } from 'date-fns';
import md5 from 'md5';
import { encode } from 'js-base64';
import myAxios from 'service/fetch';

interface ResData {
  code: number;
  data: any;
}

const ACCOUNT_ID: string = '8aaf0708809721d00180b3810ed807f2';
const AUTH_TOKEN: string = '497660b639a44dcb9f7eb995a01b6928';
const APP_ID: string = '8aaf0708809721d00180b3810fc707f9';

export default async function sendVerifyCode(
  req: NextApiRequest,
  res: NextApiResponse<ResData>
) {
  const now = format(new Date(), 'yyyyMMddHHmmss');
  const { to = '', templateId = '1' } = req.body;
  // 生成1000 - 9999随机验证码
  const verifyCode = Math.floor(Math.random() * (9999 - 1000)) + 1000;
  const expire = '5'; // 单位：分钟

  const SigParameter = md5(`${ACCOUNT_ID}${AUTH_TOKEN}${now}`).toUpperCase();
  const Authorization = encode(`${ACCOUNT_ID}:${now}`);
  const URL: string = `https://app.cloopen.com:8883/2013-12-26/Accounts/${ACCOUNT_ID}/SMS/TemplateSMS?sig=${SigParameter}`;

  console.log('SigParameter', SigParameter);
  console.log('Authorization', Authorization);
  console.log('now', now);
  console.log('url', URL);

  const response = await myAxios.post(
    URL,
    {
      to,
      templateId,
      appId: APP_ID,
      datas: [verifyCode, expire],
    },
    {
      headers: {
        Authorization,
      },
    }
  );

  const data = {
    code: 0,
    data: response,
  };
  res.status(200).json(data);
}
