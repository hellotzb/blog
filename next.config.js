/** @type {import('next').NextConfig} */
const removeImports = require('next-remove-imports')();

const nextConfig = {
  reactStrictMode: true,
  // 在nextjs中对静态资源的链接有限制，需要配置白名单
  // images: {
  //   domain: ['raw.githubusercontent.com'],
  // },
};

module.exports = removeImports(nextConfig);
