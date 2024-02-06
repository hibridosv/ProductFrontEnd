import { parseCookies } from "nookies";



export const getAuthTokenFromCookie = () => {
  const cookies = parseCookies();
  return cookies.authToken || null;
};

export const getUrlFromCookie = () => {
  const cookies = parseCookies();
  return cookies.remoteUrl || null;
};


export const getTenant = () => {
  const cookies = parseCookies();
  return cookies.tenant || null;
};

