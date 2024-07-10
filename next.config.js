/** @type {import('next').NextConfig} */
const nextConfig = {
    // output: 'export',
    env: {
        REACT_APP_NAME: 'Sistema de Facturación',
        // REACT_APP_API_URL: 'http://billing.test/',
        REACT_APP_API_URL: 'https://apitest.latam-pos.com/',
        // REACT_APP_API_URL: 'https://sistema-sv.pro/public/',
      },
      images: {
        remotePatterns: [
          {
            protocol: 'http',
            hostname: 'connect.test',
          },{
            protocol: 'https',
            hostname: 'api-connect.hibridosv.com',
          },
        ],
      },
}

module.exports = nextConfig