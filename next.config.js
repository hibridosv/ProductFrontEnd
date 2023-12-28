/** @type {import('next').NextConfig} */
const nextConfig = {
    // output: 'export',
    env: {
        REACT_APP_NAME: 'Aplicación react',
        // REACT_APP_API_URL: 'http://connect.test/',
        // CLIENT_ID: '9aafa422-e1b8-4411-9b0f-1bf8914e2157',
        // CLIENT_SECRET: 'VBuYYgP6SXoYnsBwjmPfjNYZzY7IdoReER0Fwmw2',
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