/** @type {import('next').NextConfig} */
const removeImports = require('next-remove-imports')();

const withMDX = require('@next/mdx')({
  extension: /\.mdx?$/,
  options: {
    remarkPlugins: [],
    rehypePlugins: [],
    // If you use `MDXProvider`, uncomment the following line.
    // providerImportSource: "@mdx-js/react",
  },
});

const nextConfig = {
  reactStrictMode: true,
  // 在nextjs中如果使用<Image />组件，对静态资源的链接有限制，需要配置白名单
  // images: {
  //   domain: ['raw.githubusercontent.com'],
  // },
  pageExtensions: ['ts', 'tsx', 'js', 'jsx', 'md', 'mdx'],
};

module.exports = removeImports(withMDX(nextConfig));
