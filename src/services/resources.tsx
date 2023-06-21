'use client'
import { API_URL } from "../constants";

  export async function getData(url = '') {
    // console.log("URL: ",`${API_URL}${url}`);
    const response = await fetch(`${API_URL}${url}`, {
      method: 'GET',
      mode: 'cors',
      cache: 'no-cache',
      credentials: 'same-origin',
      redirect: 'follow', 
      referrerPolicy: 'no-referrer',
      headers: {
        'Accept': 'application/json'
      },
    });
    return await response.json(); 
  }


  export async function postData(url = '', method = 'POST', data = {}) {
    console.log("URL: ",`${API_URL}${url}`);
    const response = await fetch(API_URL + url, {
      method: method, // *GET, POST, PUT, DELETE, etc.
      mode: 'cors', // no-cors, *cors, same-origin
      cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
      credentials: 'same-origin', // include, *same-origin, omit
      redirect: 'follow', // manual, *follow, error
      referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
      body: JSON.stringify(data), // body data type must match "Content-Type" header
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
    return await response.json(); // parses JSON response into native JavaScript objects
  }


  export async function postDataWithImage(url = '', method = 'POST', data: any) {
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
        'Accept': 'application/json'
      },
    });
  
    return await response.json();
  }