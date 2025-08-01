'use client'
import { toast, Toaster } from "react-hot-toast";
import { IoIosNotifications } from "react-icons/io";
import { getTenant } from "@/services/oauth";
import { getConfigStatus } from "@/utils/functions";
import { useEffect } from "react";
import useReverb from "@/hooks/useReverb";

interface NotificationsPushProps {
    theme?: any;
    config: any;
  }



export function NotificationsPush(props: NotificationsPushProps){
  const { config } = props
  const tenant = getTenant();
  const isConfig = getConfigStatus("notifications", config);
  let pusherEvent = useReverb(`${tenant}-channel`, 'PusherSendMessageToTenant', isConfig, false).data;


  useEffect(() => {
    if (isConfig) {
      notification(pusherEvent);
    }
      // eslint-disable-next-line
  }, [pusherEvent, isConfig]);

    const notification = (text: any) => {
        if (!text?.message) return
        toast((t) => (
          <span className="flex justify-between">
            <span className="font-semibold">{ text.message }</span> <button className="ml-4" onClick={() => toast.dismiss(t.id)}>Cerrar</button>
          </span>
        ), {  id: 'clipboard', icon: <IoIosNotifications size={24} color="red" className="animate-pulse"/> });
      }
  
    return(<Toaster position="top-right" />);
}