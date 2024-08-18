import Pusher from 'pusher-js';

// Reemplaza con tus credenciales de Pusher
const pusher = new Pusher('67ef4909138ad18120e1', {
  cluster: 'us2'
});

export default pusher;