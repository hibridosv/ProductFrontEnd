/** @type {import('next').NextConfig} */
const nextConfig = {
    // output: 'export',
    env: {
        REACT_APP_NAME: 'Aplicación react',
        REACT_APP_API_URL: 'http://connect.test/',
        CLIENT_ID: '9b1ce610-c7f9-44cb-9684-6acad6e3b914',
        CLIENT_SECRET: 'mUvA3pDCpKUpJoOfh4hz0av8wccUIr7Hb8aY9ljw',
        // REACT_APP_API_URL: 'https://products.latam-pos.com/',
        // CLIENT_ID: '9aaad66c-fc41-4b39-9894-01406537087b',
        // CLIENT_SECRET: 'RGREVbIyEZfdNfzGlA3hZFMyodsaft78vXZTGjTx',
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