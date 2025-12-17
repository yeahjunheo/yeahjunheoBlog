/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'https://yeahjunheo.com',
  generateRobotsTxt: true,
  generateIndexSitemap: false,
  outDir: './out', // For static export
  exclude: ['/404', '/_*'],
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: '/',
      },
    ],
    additionalSitemaps: [
      `${process.env.NEXT_PUBLIC_SITE_URL || 'https://yeahjunheo.com'}/sitemap.xml`,
    ],
  },
};
