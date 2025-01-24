'use client'

import { useState, useEffect, useContext } from "react";
import { getData, postData } from "@/services/resources";
import { ScreenCard } from "@/components/restaurant/screen/screen-card";
import { getTenant } from "@/services/oauth";
import { getConfigStatus, screenSound } from "@/utils/functions";
import { ConfigContext } from "@/contexts/config-context";
import usePusher from "@/hooks/usePusher";
import { NothingHere, Pagination, ViewTitle } from "@/components";
import { RestaurantOrdersTable } from "@/components/restaurant/orders/restaurant-orders-table";


export default function Page() {
  const [isLoading, setIsLoading] = useState(false);
  const [ orders, setOrders ] = useState([] as any)
  const tenant = getTenant();
  const { config } = useContext(ConfigContext);
  let pusherEvent = usePusher(`${tenant}-channel-screen`, 'event-screen', getConfigStatus("screen-push-active", config)).random;

    const loadData = async () => {
        setIsLoading(true);
        try {
          const response = await getData(`restaurant/sales`);
          if (response.data) {
            setOrders(response);
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

console.log(orders)

  return (
      <div className="grid grid-cols-1 md:grid-cols-10 pb-10">
          <div className="col-span-7 border-r md:border-sky-600">
          <ViewTitle text="ORDENES DEL DIA" />
            <RestaurantOrdersTable records={orders} isLoading={isLoading} />
            <Pagination records={orders} handlePageNumber={()=>{}}  />
          </div>
          <div className="col-span-3">
          <ViewTitle text="DATOS GENERALES" />

          </div>
      </div>
  )
}
