/** @type {import('next').NextConfig} */
const nextConfig = {
    // output: 'export',
    env: {
        REACT_APP_NAME: 'Sistema de Facturacion',
        REACT_APP_API_URL: 'http://billing.test/',
        // REACT_APP_API_URL: 'https://apitest.latam-pos.com/',
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