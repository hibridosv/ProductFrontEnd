/** @type {import('next').NextConfig} */
const nextConfig = {
    // output: 'export',
    env: {
        REACT_APP_NAME: 'Aplicación react',
        // REACT_APP_API_URL: 'http://connect.test/',
        // CLIENT_ID: '9b213143-8316-4215-89df-de9e17601fe9',
        // CLIENT_SECRET: 'mM2mZBPvAdKncX54jQvGvK4JaVQmcKlD66YVBqve',
        REACT_APP_API_URL: 'https://products.latam-pos.com/',
        CLIENT_ID: '9b2130f5-4465-4ac7-9e6f-2a1d08471be0',
        CLIENT_SECRET: 'yYUu6rsCz7Biu8cVOafAofylfYNIYISoQINOIB6N',
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