/** @type {import('next').NextConfig} */
const nextConfig = {
    // output: 'export',
    env: {
        REACT_APP_NAME: 'Aplicación react',
        // REACT_APP_API_URL: 'http://connect.test/',
        // CLIENT_ID: '9b151c53-3508-4464-905b-cbcf4a4f0141',
        // CLIENT_SECRET: 'bAIxTod7WkKcUT4d2E8vwxfNl4gU8FnC87x9TNMm',
        REACT_APP_API_URL: 'https://products.latam-pos.com/',
        CLIENT_ID: '9aaad66c-fc41-4b39-9894-01406537087b',
        CLIENT_SECRET: 'RGREVbIyEZfdNfzGlA3hZFMyodsaft78vXZTGjTx',
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