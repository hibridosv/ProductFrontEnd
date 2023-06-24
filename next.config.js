/** @type {import('next').NextConfig} */
const nextConfig = {
    env: {
        REACT_APP_NAME: 'Aplicación react',
        // REACT_APP_API_URL: 'http://connect.test/',
        // ACCESS_TOKEN: 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiI5OTdjNmE1OC0yMzZlLTRjMDYtYjgxYS02Yzc4ZDcxMzU4NTYiLCJqdGkiOiI2NGEyMzkxOTdlOWIxZDIyY2NjN2IzNjY1MzRkMDhmMzA2ODI4YzAwODZkMjk2OTAxYzg2NzFmMTMwYmNkODJiMTdjOGEzOTBkM2ZkMTg3MCIsImlhdCI6MTY4NzY0MzEyOS4zNzkyNjIsIm5iZiI6MTY4NzY0MzEyOS4zNzkyNjYsImV4cCI6MTY5MjgyNzEyOC45MjU4NDcsInN1YiI6Ijk5N2M2YTQ4LTQ2MjEtNDY4MC04YjMyLTMwOWRlNDE5ZDhiYSIsInNjb3BlcyI6W119.F7FcuFXenObE6yA8i3kcn4si_Bt5YYba9zmEInUE6Ymn1S5u7Ejl_X3FYH2C96BzeLO5vswkFx6vnoh6hFqX9eQ-m85sWzmViphjy_sWE0dgnC4Bkrw_ErN2Zw0ErfibKA8hJDJxRkDe-sqkM3l5Zxm0_EK0QhQ07hsnKZGuqCC78C4QOZCQ_Pq28sp9NmVZxSDehzEoLcKw5i-GCXQWSVN_C4-peYPBOPaSOMVwioX5Et0YIm7Yw2FpC-7s01XaZBktAWOWPG6bzURccQtC2XlJvwXVx3yz-ugiUrT69NT8-snhlhxRKdJ51HwoXrEzbxTNDh0z-lLTJ83oUekxSpkfrAzw1Xa5VnGwPO9uW7IEVPiGztyrITOOQpO_JXo_M6XsbWo5xImdGUt8elX4Srch49KzJN3XcOpCABuTgxCDeyJbix1jdC_r830wTG11Gfv2mQHREg_cyQfDn9zQAmK3R8joWESVTFA5LSOMP_6JUiFOeZCLhT6aZP_sZkPm9KHqXtGYRzXCRCX2ghwPrwmu3WWrbIJnw-TX6rxxTTbSeX264h1GjEhJ69kHXEKDHh0_EZj6kCCzNyu_sC9wa1a1uX3FAe39aWjKCqFjdikQ_KRk0qWLcWIjtm_WKNbq40EvNH8L-XgVde7pmIkmaVvPVQBZNCec4DM4AsPoWq8',
        REACT_APP_API_URL: 'https://products.latam-pos.com/',
        ACCESS_TOKEN: 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiI5OTdkOGMxNi1kOWY0LTRkMDgtYmViNi1jN2JkMzY5Mjk0OGUiLCJqdGkiOiJkMjhlZTEwYTkwYmVjZmQ3MGE0NDk3MTU3OGRkZmJmYzZlM2ViMTY4NzBhYTU5ZjFkYzcyYjQ2MzllYzQ0MWMzMDgwNTEzYThjMjYxZmEwNSIsImlhdCI6MTY4NzY0NTE2Ni4wNzMxNDksIm5iZiI6MTY4NzY0NTE2Ni4wNzMxNTIsImV4cCI6MTY5MjgyOTE2NS42MzM4MzcsInN1YiI6Ijk5N2Q4YmE0LWZhNTktNGZjMC04ZDNjLWY4MTU3ZTgwODY4NyIsInNjb3BlcyI6W119.pFQqcHQtVQ3U2STk7bihBbH80CzFqWsaGUPlreOk1zsD95q5-XM_o0a6wQkkrqvky-StAAlIINhN8VQ4KpDQw-jLgVM9e93WAeJKaL91ZdDwNW3S-d2tPpidj9Om4lNhKDwPVBJWSepnrQLhZx7Z8ZNHmM6ZM6W9QQvopcMQV5leGhrsERh9Db4Q1YCVViHIt9VDir0MRf6PciOvkD2wFcWAdCb9p08-X-_RSjz75nPhjF_Gi3dQ1pYhExc6YhrnZPpzFy1U12FnHhLF2jxKODSDA0EgjbK1br3DR5t_9BOcoceSo1AjG4QdjqOy4AgFQYRhbyLVM00fhMpiJPkpuCKDUu1Rf7CKnk1AD1Qb06XxwfWmz6AHexw8hZpcnoqzCFij8YrVszsKczmfaWvKsDEq5_rb7ju_xPOtyWmcDf_CSj69vi6wjQbPuL1hDWsvwTWp-ZhHJbNM6HpwqiwsfGSLJv480wSbxhwxHQMBlyPzxvCXWl2r-6tdcbgXPqdIVWuU5kxzNCRhujFfZnnoUdn9Tk_wsGM33Lb9p5_0ac6Q9B-3a-e_nVC1GRtuYEf46QmzIRpJHnruJ4pNpTqoIkpMwKTKXnUUog8c4WBq9dP3hNSumgfaeAV5s0DbXDG7uLu_RfDfrs2_P_UDUQdwAgrsypWlhrNjfTsuUyEZZJ4',
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