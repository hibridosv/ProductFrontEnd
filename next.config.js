/** @type {import('next').NextConfig} */
const nextConfig = {
    // output: 'export',
    env: {
        REACT_APP_NAME: 'Aplicación react',
        REACT_APP_API_URL: 'http://connect.test/',
        // REACT_APP_API_URL: 'https://products.latam-pos.com/',
        Authorization: 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiI5YWEwMjkyOC01MzJiLTRhODMtOWQ0NC0wMzQ0MzA5MGJjNjMiLCJqdGkiOiI0YTI1YWFkNzQ5MDc1YTBkNmMyNjk0ZDZjYzU2NzI1ZTYyZmI2ZGIzYzMxN2ZkNGU5YWNmN2QyYzA0N2ZjYmY3M2NkNzJlYjI1MDkzZDIyNiIsImlhdCI6MTcwMDEyNjgzNS44Nzc1ODMsIm5iZiI6MTcwMDEyNjgzNS44Nzc1ODUsImV4cCI6MTcwNTMxMDgzNS44NjIzNywic3ViIjoiOWFhMDI2M2ItNjE2NC00YjViLTkxMDAtOTI0Y2MxMjZlZjU5Iiwic2NvcGVzIjpbXX0.sPTIDTgOBmoGUB4i6mLKSYjezZ3n1sJdBdW_Wf8pMsozwSBfO-mJsxP7MQaJCZ7yUo77I1isJiqBlaSLPwjcdIJl-J6z9QHI_hVq0dStLcKs_Ob23i0dF6VIVQvU3nfaY8Uxlr4Gatx3Pvj8L5oA53qE4KM7_mLx38R84D4G3Egvdei-AvMGqTnKAgLC60k9L2mVsR6KkMq8DkoRN0AfGX51h2CfYl2qHT4HLIZbIk7aFGcto5SXoK1gpUpP86z8ebbBA1bph9LsLXanbIizn55WT7cjQ7h0sFv1Gv1LAtgQmQq2KW06lh2RF3qUxuyWDGkivj20DUUvdZ0BDIOV_WUR_xTBqXt_XwSXCIa15wJKhM_MPSgfM7VC1hDdhiJ39YuiuQyUgvNDKjcHVt2Txp7tV1cYmuEh-L9C38jqvkxG2H2IPIex1cul2t5CcNJpVJtWxMejgAWXFEpz3MpS5ZZqQ-p-42UJ_-1SbZQkYOw-1cQzhfsmjRuB13A6SHJrc59cEk1Y7Ny24ZGAu_3AdkKfDZ60zW0dFy0Liz09cyK9AE0GjcgniAk_z2tlhqcPVAMiU9dry1i4tTTX3iW6sIe1fWUkGBwzBPdbWh7eQjLY5Yz7jkvinij5ggnfAwQxSICd7EW64NOWmRSjzyYdrLCEMQNZ9JJO6S43m7w0aQE',
        CLIENT_ID: '9aa8b4c5-5fd1-4e77-9f65-115d7c73495d',
        CLIENT_SECRET: 'mDALKhTu8R8OdsfdXLgdwVQk1AeXnUncu7198c2Z',
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