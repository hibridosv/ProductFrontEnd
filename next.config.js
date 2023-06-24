/** @type {import('next').NextConfig} */
const nextConfig = {
    env: {
        REACT_APP_NAME: 'Aplicación react',
        // REACT_APP_API_URL: 'http://connect.test/',
        REACT_APP_API_URL: 'https://products.latam-pos.com/',
      },
      images: {
        remotePatterns: [
          {
            protocol: 'http',
            hostname: 'connect.test',
            port: '',
            pathname: '/api/**',
          },{
            protocol: 'https',
            hostname: 'products.latam-pos.com',
            port: '',
            pathname: '/api/**',
          },
        ],
      },
}

module.exports = nextConfig