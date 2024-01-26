/** @type {import('next').NextConfig} */
const nextConfig = {
    // output: 'export',
    env: {
        REACT_APP_NAME: 'Aplicación react',
        REACT_APP_API_URL: 'http://billing.test/',
        CLIENT_ID: '9b21e9e5-1a36-42f1-811f-4bc71b1b548e',
        CLIENT_SECRET: 'kkUuzbaQCYKfjao9dugEVvl20PE6Rhp0QLLzMtJv',
        // REACT_APP_API_URL: 'https://products.latam-pos.com/',
        // CLIENT_ID: '9b2130f5-4465-4ac7-9e6f-2a1d08471be0',
        // CLIENT_SECRET: 'yYUu6rsCz7Biu8cVOafAofylfYNIYISoQINOIB6N',
      },
      images: {
        remotePatterns: [
          {
            protocol: 'http',
            hostname: 'connect.test',
          },{
            protocol: 'https',
            hostname: 'products.latam-pos.com',
          },
        ],
      },
}

module.exports = nextConfig