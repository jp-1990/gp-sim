/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  i18n: {
    locales: ['en', 'fr'],
    defaultLocale: 'en'
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'storage.googleapis.com',
        pathname: '/project-gp-sim.appspot.com/**'
      }
    ]
  },
  async redirects() {
    return [
      {
        source: '/',
        destination: '/liveries',
        permanent: true
      }
    ];
  }
};

module.exports = nextConfig;
