'use client'
import { toast, Toaster } from "react-hot-toast";
import Pusher from 'pusher-js';
import { IoIosNotifications } from "react-icons/io";
import { getTenant } from "@/services/oauth";

interface NotificationsPushProps {
    theme?: any;
  }



export function NotificationsPush(props: NotificationsPushProps){
        const tenant = getTenant();

    const notification = (text: any) => {
        // console.log("message: ", text)
        if (!text?.message) return
        toast((t) => (
          <span className="flex justify-between">
            <span className="font-semibold">{ text.message }</span> <button className="ml-4" onClick={() => toast.dismiss(t.id)}>Cerrar</button>
          </span>
        ), {  id: 'clipboard', icon: <IoIosNotifications size={24} color="red" className="animate-pulse"/> });
      }
    
        // Enable pusher logging - don't include this in production
        // Pusher.logToConsole = true;
    
        var pusher = new Pusher('67ef4909138ad18120e1', { cluster: 'us2' });
        var channel = pusher.subscribe(`${tenant}-channel`);
        channel.bind('transfer-new-event', function(data:any) {
         notification(data);
        });

    return(<Toaster position="top-right" />);
}