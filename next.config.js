/** @type {import('next').NextConfig} */
const nextConfig = {
    // output: 'export',
    env: {
        REACT_APP_NAME: 'SISTEMA DEMO',
        REACT_APP_API_URL: 'http://billing.test/',
      },
      images: {
        remotePatterns: [
          {
            protocol: 'http',
            hostname: 'connect.test',
          },{
            protocol: 'https',
            hostname: 'api.latam-pos.com',
          },
        ],
      },
}

module.exports = nextConfig