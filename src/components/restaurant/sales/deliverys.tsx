"use client";

import { Loading } from "@/components/loading/loading";
import { NothingHere } from "@/components/nothing-here/nothing-here";
import { ConfigContext } from "@/contexts/config-context";
import useReverb from "@/hooks/useReverb";
import { getTenant } from "@/services/oauth";
import { getData } from "@/services/resources";
import { getConfigStatus } from "@/utils/functions";
import Image from "next/image";
import {  useContext, useEffect, useState } from "react";
import { OrderTime } from "./tables-time";

export interface DeliverysProps {
  isShow?: boolean;
  onClick: (option: any) => void;

}

export function Deliverys(props: DeliverysProps) {
  const { isShow, onClick} = props;
  const [isLoading, setIsLoading] = useState(false);
  const [orders, setOrders] = useState([]) as any;
  const { config } = useContext(ConfigContext);
  const tenant = getTenant();
  let pusherEvent = useReverb(`${tenant}-channel-orders`, 'PusherOrderEvent', getConfigStatus("realtime-orders", config)).random;

  const loadAllOrders = async () => {
    setIsLoading(true);
    try {
      const response = await getData(`order?included=employee,client,invoiceproducts&filterWhere[status]==2&filterWhere[order_type]==3`);
      setOrders(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    if (isShow) {
      (async () =>  await loadAllOrders())();
    }
    // eslint-disable-next-line
  }, [isShow, pusherEvent]);

      if (!isShow ) return <></>

      return (
              <div className="flex flex-wrap justify-center">
                  {
                  isLoading ? <Loading text="Buscando deliverys" />  : 
                  orders?.length > 0 ? orders.map((record: any) => {
                      return (
                          <div key={record?.id} className="m-2 clickeable" >
                              <div className="rounded-full drop-shadow-lg shadow-lg relative" onClick={() => onClick(record.id)}>
                                  <Image src="/img/delivery.jpg" alt="Delivery" width={146} height={146} className="rounded-full" />
                                  <p className={`w-full -mt-8 content-center text-center rounded overflow-hidden uppercase text-xs text-black font-medium h-9 ${record.status == 0 ? 'bg-lime-300' : 'bg-white'}`} 
                                  style={{ maxWidth: '146px',  wordBreak: 'keep-all', lineHeight: '1.2em' }}>
                                      { record?.client?.name }
                                  </p>
                                  <div className="absolute top-0 left-1/2 transform -translate-x-1/2 z-10 w-3/4">
                                    <OrderTime record={record} isShow={record.status == 2} rowSearch="created_at" />
                                  </div>
                              </div>
                          </div>
                      )
                  }) : <NothingHere width="350" text="No hay ordenes pendientes" /> }
              </div>

  );

}
