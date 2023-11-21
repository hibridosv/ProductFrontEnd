import { destroyCookie, parseCookies, setCookie } from "nookies";

export const setAuthTokenLocalStorage = (token: string) => {
  localStorage.setItem('authToken', token);
};

// Función para obtener el token desde localStorage
export const getAuthTokenFromLocalStorage = () => {
  return localStorage.getItem('authToken') || null;
};

export const destroyAuthLocalStorage = () => {
  localStorage.removeItem('authToken');
};


export const setAuthTokenCookie = (token: string) => {
  setCookie(null, 'authToken', token, {
    maxAge: 30 * 24 * 60 * 60, // Duración de la cookie en segundos (30 días en este ejemplo)
    path: '/',
  });
};


export const getAuthTokenFromCookie = () => {
  const cookies = parseCookies();
  return cookies.authToken || null;
};

export const destroyAuthCookie = () => {
    destroyCookie(null, 'authToken')
  };

