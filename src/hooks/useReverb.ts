import { useEffect, useState } from 'react';
import { REVERB_HOST, REVERB_PORT, REVERB_SCHEME, REVERB_KEY } from "@/constants";

// Extend the Window interface to include Pusher
declare global {
  interface Window {
    Pusher: typeof Pusher;
  }
}
import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

const useReverb = (channelName: string, eventName: string, status = false, randomData = true) => {
  const [data, setData] = useState([] as any);
  const [random, setRandom] = useState(0);

  useEffect(() => {
    if (!status) return;
   
    window.Pusher = Pusher;
    const echo = new Echo({
      broadcaster: 'reverb',
      key: REVERB_KEY,
      wsHost: REVERB_HOST,
      wsPort: REVERB_PORT,
      wssPort: REVERB_PORT,
      forceTLS: (REVERB_SCHEME ?? 'https') === 'https',
    //   disableStats: true,
    //   encrypted: false,
      enabledTransports: ['ws', 'wss'],
    });

    const channel = echo.channel(channelName);
    console.log("channel: ", channel)
    console.log("REVERB_HOST: ", REVERB_HOST)
    
    const handleEvent = (eventData: string) => {
      if (randomData) {
        setRandom(Math.random());
      } else {
        setData(eventData);
      }
    };

    channel.listen(eventName, handleEvent);

    return () => {
      channel.stopListening(eventName);
      echo.leave(channelName);
    };
  }, [channelName, eventName, status, randomData]);

  return { data, random };
};

export default useReverb;
