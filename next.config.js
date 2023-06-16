/** @type {import('next').NextConfig} */
const nextConfig = {
    env: {
        REACT_APP_NAME: 'Aplicación react',
        // REACT_APP_API_URL: 'http://connect.test/api/',
        REACT_APP_API_URL: 'https://products.latam-pos.com/api/',
      },
}

module.exports = nextConfig