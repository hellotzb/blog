import { NextApiRequest, NextApiResponse } from 'next';
import { withIronSessionApiRoute } from 'iron-session/next';
import { format } from 'date-fns';
import md5 from 'md5';
import { encode } from 'js-base64';
import myAxios from 'service/fetch';
import { ironOptions, verifyCodeExpires } from 'config';
import { ISession } from '../index';

interface ResData {
  code: number;
  data?: any;
  msg?: string;
}

const ACCOUNT_ID: string = '8aaf0708809721d00180b3810ed807f2';
const AUTH_TOKEN: string = '497660b639a44dcb9f7eb995a01b6928';
const APP_ID: string = '8aaf0708809721d00180b3810fc707f9';

async function sendVerifyCode(
  req: NextApiRequest,
  res: NextApiResponse<ResData>
) {
  const session: ISession = req.session; // 被withIronSessionApiRoute包括会生成一个session对象
  const now = format(new Date(), 'yyyyMMddHHmmss');
  const { to = '', templateId = '1' } = req.body;
  // 生成1000 - 9999随机验证码
  const verifyCode = Math.floor(Math.random() * (9999 - 1000)) + 1000;

  // 容联云通讯-短信平台接口
  // http://doc.yuntongxun.com/pe/5a533de33b8496dd00dce07c
  const SigParameter = md5(`${ACCOUNT_ID}${AUTH_TOKEN}${now}`).toUpperCase();
  const Authorization = encode(`${ACCOUNT_ID}:${now}`);
  const URL: string = `https://app.cloopen.com:8883/2013-12-26/Accounts/${ACCOUNT_ID}/SMS/TemplateSMS?sig=${SigParameter}`;

  const response = await myAxios.post(
    URL,
    {
      to,
      templateId,
      appId: APP_ID,
      datas: [verifyCode, verifyCodeExpires],
    },
    {
      headers: {
        Authorization,
      },
    }
  );
  const { statusCode, statusMsg, templateSMS = {} } = response as any;
  if (statusCode === '000000') {
    session.verifyCode = verifyCode;
    await session.save();
    res.status(200).json({
      code: 0,
      data: templateSMS,
    });
  } else {
    res.status(200).json({ code: -1, msg: statusMsg });
  }
}

export default withIronSessionApiRoute(sendVerifyCode, ironOptions);
