// usePusher.js
import { useEffect, useState } from 'react';
import pusher from '../utils/pusher';

const usePusher = (channelName: string, eventName: string, status = false, randomData = true) => {
  const [data, setData] = useState(null as any);

  useEffect(() => {
    if (status) {
        const channel = pusher.subscribe(channelName);
        const handleEvent = (newData: any) => {
            setData(randomData ? Math.random() : newData);
            // console.log(newData)
        };
        channel.bind(eventName, handleEvent);
        // Limpia la suscripción al desmontar el componente
        // console.log("EN PUSHER")
        return () => {
            channel.unbind(eventName, handleEvent);
            pusher.unsubscribe(channelName);
        };
    }
  }, [channelName, eventName, status]);

  return data;
};

export default usePusher;
