import { NextFetchEvent, type NextRequest, NextResponse } from 'next/server';

export async function middleware(req: NextRequest, ev: NextFetchEvent) {
  // 埋点上报
  // console.log(...)
  // 鉴权，重定向
  // const verifiedToken = await verifyAuth(req).catch((err) => {
  //   console.error(err.message);
  // });
  // if (!verifiedToken) {
  //   return NextResponse.redirect(new URL('/', req.url));
  // }
}
