export const NAME = process.env.REACT_APP_NAME || 'React App';
export const URL = window.location.href == "http://localhost:3000/" ? "http://connect.test/" : "https://products.latam-pos.com/";
export const API_URL = `${URL}api/`
