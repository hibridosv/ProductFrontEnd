'use client'

import { useState, useEffect, useContext } from "react";
import { getData, postData } from "@/services/resources";
import { getTenant } from "@/services/oauth";
import { getConfigStatus, screenSound } from "@/utils/functions";
import { ConfigContext } from "@/contexts/config-context";
import usePusher from "@/hooks/usePusher";
import { NothingHere } from "@/components";
import { ScreenCardAll } from "@/components/restaurant/screen/screen-card-all";


export default function Page() {
  const [isLoading, setIsLoading] = useState(false);
  const [ orders, setOrders ] = useState([])
  const tenant = getTenant();
  const { config } = useContext(ConfigContext);
  let pusherEvent = usePusher(`${tenant}-channel-screen`, 'event-screen', getConfigStatus("screen-push-active", config)).random;

    const loadData = async () => {
        setIsLoading(true);
        try {
          const products = await getData(`sales?included=employee,client,invoiceproducts.attributes,invoiceproducts.options.option,products.attributes,products.options.option,attributes&filterwherein[status]=3,1&filterwherein[active_print]=1,2`);
          if (products.data) {
            setOrders(products.data);
            screenSound()
          }
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };



    useEffect(() => {
            (async () => { await loadData() })();
        // eslint-disable-next-line
    }, [pusherEvent]);


    const processData = async (values: any) => {
        try {
          const response = await postData(`${values.url}`, "PUT", values);
          if (response.data) {
            setOrders(response.data)
          }
        } catch (error) {
          console.error(error);
        }
      };

  if (!orders || orders.length == 0) return <NothingHere text="No hay comandas pendientes" />

  return (
        <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-4 m-4 pb-10">
            {orders && orders?.map((order: any) => (
                <div key={order.id} className="mb-4 break-inside-avoid-column">
                    <ScreenCardAll processData={processData} order={order} />
                </div>
            ))}
        </div>
  )
}
