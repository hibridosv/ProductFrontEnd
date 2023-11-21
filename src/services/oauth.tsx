import { postWithOutApi } from "./resources";
import { setCookie, parseCookies, destroyCookie  } from 'nookies';


export const sendLogin = async (data: any) => {
  data.grant_type = 'password';
  data.client_id = process.env.CLIENT_ID;
  data.client_secret = process.env.CLIENT_SECRET;
  data.scope = "*"
  try {
    const response = await postWithOutApi(`oauth/token`, "POST", data);
    if (!response.error) {
        setAuthTokenLocalStorage(response.access_token);
    }
    return response;
  } catch (error) {
    console.error(error);
  }
};


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