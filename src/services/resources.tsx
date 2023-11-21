import { API_URL, URL } from "@/constants";
import { getAuthTokenFromLocalStorage } from "./oauth";



  export async function getData(url = '') {
    const token = await getAuthTokenFromLocalStorage();
    const Authorization = `Bearer ${token}`;

    // console.log("URL: ",`${API_URL}${url}`);
    try {
      const response = await fetch(`${API_URL}${url}`, {
        method: 'GET',
        mode: 'cors',
        cache: 'no-cache',
        credentials: 'same-origin',
        redirect: 'follow', 
        referrerPolicy: 'no-referrer',
        headers: {
          'Accept': 'application/json',
          'Authorization': Authorization,
        },
      });
      return await response.json(); 
    } catch (error) {
      console.error(error);
    }

  }


  export async function postData(url = '', method = 'POST', data = {}) {
    const token = await getAuthTokenFromLocalStorage();
    const Authorization = `Bearer ${token}`;

    try {
          // console.log("URL: ",`${API_URL}${url}`);
    const response = await fetch(API_URL + url, {
        method: method, // *GET, POST, PUT, DELETE, etc.
        mode: 'cors', // no-cors, *cors, same-origin
        cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached, no-store
        credentials: 'same-origin', // include, *same-origin, omit
        redirect: 'follow', // manual, *follow, error
        referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
        body: JSON.stringify(data), // body data type must match "Content-Type" header
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': Authorization,
          // 'Content-Type': 'application/x-www-form-urlencoded',
        },
      });
      return await response.json(); // parses JSON response into native JavaScript objects
    } catch (error) {
      console.error(error);
    }

  }


  export async function postDataWithImage(url = '', method = 'POST', data: any) {

    const token = await getAuthTokenFromLocalStorage();
    const Authorization = `Bearer ${token}`;
     try {
      const formData = new FormData();    
        formData.append('product_id', data?.product_id);
        formData.append('image', data?.image[0]);
        formData.append('description', data.description);
        const response = await fetch(API_URL + url, {
          method: method,
          mode: 'cors',
          cache: 'no-cache',
          credentials: 'same-origin',
          redirect: 'follow',
          referrerPolicy: 'no-referrer',
          body: formData, // Utiliza el objeto FormData en lugar de JSON.stringify(data)
          headers: {
            'Accept': 'application/json',
            'Authorization': Authorization,
          },
        });
        return await response.json();
     } catch (error) {
      console.error(error);
     }

  }


  export async function postWithOutApi(url = '', method = 'POST', data = {}) {
    const response = await fetch(`${URL}${url}`, {
      method: method,
      mode: 'cors',
      cache: 'no-cache',
      credentials: 'same-origin',
      redirect: 'follow',
      referrerPolicy: 'no-referrer',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });
    return await response.json();
  }
