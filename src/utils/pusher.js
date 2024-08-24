import Pusher from 'pusher-js';

Pusher.logToConsole = true;
// Reemplaza con tus credenciales de Pusher
//const pusher = new Pusher('67ef4909138ad18120e1', {
//  cluster: 'us2'
//});

const pusher = new Pusher('746657009722e09911c3', {
  cluster: 'mt1'
});

export default pusher;