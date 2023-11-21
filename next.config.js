/** @type {import('next').NextConfig} */
const nextConfig = {
    // output: 'export',
    env: {
        REACT_APP_NAME: 'Aplicación react',
        REACT_APP_API_URL: 'http://connect.test/',
        // REACT_APP_API_URL: 'https://products.latam-pos.com/',
        CLIENT_ID: '9aa8faef-278b-4b59-9028-e57118676dba',
        CLIENT_SECRET: 'ak3nodNXkGIAbVWwcPXrreTc2R007wV8mCcszBKL',
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