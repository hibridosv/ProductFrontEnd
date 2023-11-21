import { postWithOutApi } from "./resources";

export const sendLogin = async (data: any) => {
  data.grant_type = 'password';
  data.client_id = "9aa8faef-278b-4b59-9028-e57118676dba";
  data.client_secret = "ak3nodNXkGIAbVWwcPXrreTc2R007wV8mCcszBKL";
  data.scope = "*"
  console.log(data);
  try {

    const response = await postWithOutApi(`oauth/token`, "POST", data);
    if (!response.error) {
      localStorage.setItem("token", response.access_token);
      localStorage.setItem("refresh_token", response.refresh_token);
    }
    console.log(response);
    return response;
  } catch (error) {
    console.error(error);
  }
};