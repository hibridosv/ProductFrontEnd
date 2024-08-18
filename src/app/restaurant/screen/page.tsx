'use client'

import { useState, useEffect, useContext } from "react";
import { getData, postData } from "@/services/resources";
import { ScreenCard } from "@/components/restaurant/screen/screen-card";
import { getTenant } from "@/services/oauth";
import { getConfigStatus } from "@/utils/functions";
import { ConfigContext } from "@/contexts/config-context";
import usePusher from "@/hooks/usePusher";


export default function Page() {
  const [isLoading, setIsLoading] = useState(false);
  const [ orders, setOrders ] = useState([])
  const tenant = getTenant();
  const { config } = useContext(ConfigContext);
  let pusherEvent = usePusher(`${tenant}-channel-orders`, 'get-orders-event', getConfigStatus("realtime-orders", config));

    const loadData = async () => {
        setIsLoading(true);
        try {
          const products = await getData(`sales?included=employee,client,invoiceproducts.attributes,products.attributes,attributes&filter[status]==3&filter[status]==1&filterWhere[active_station]==1`);
          setOrders(products.data);
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

  return (
        <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-4 m-4 pb-10">
            {orders && orders?.map((order: any) => (
                <div key={order.id} className="mb-4 break-inside-avoid-column">
                    <ScreenCard processData={processData} order={order} />
                </div>
            ))}
        </div>
  )
}
