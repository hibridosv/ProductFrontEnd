'use client'

import { useState, useEffect, useContext } from "react";
import { getData } from "@/services/resources";
import { getTenant } from "@/services/oauth";
import { countOrdersWithStatusX, getConfigStatus } from "@/utils/functions";
import { ConfigContext } from "@/contexts/config-context";
import {  Pagination, ViewTitle } from "@/components";
import { RestaurantOrdersTable } from "@/components/restaurant/orders/restaurant-orders-table";
import { usePagination } from "@/hooks/usePagination";
import useReverb from "@/hooks/useReverb";


export default function Page() {
  const [isLoading, setIsLoading] = useState(false);
  const [ orders, setOrders ] = useState([] as any)
  const tenant = getTenant();
  const { config } = useContext(ConfigContext);
  const {currentPage, handlePageNumber} = usePagination("&page=1");
  let pusherEvent = useReverb(`${tenant}-channel-screen`, 'PusherScreenEvent', getConfigStatus("screen-push-active", config)).random;

    const loadData = async () => {
        setIsLoading(true);
        try {
          const response = await getData(`order?included=employee,client,invoiceproducts.attributes,invoiceproducts.options.option,products.attributes,products.options.option,attributes&sort=-created_at&perPage=15${currentPage}`);
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
    }, [pusherEvent, currentPage]);

  return (
      <div className="grid grid-cols-1 md:grid-cols-10 pb-10">
          <div className="col-span-7 border-r md:border-sky-600">
          <ViewTitle text="ORDENES DEL DIA" />
            <RestaurantOrdersTable records={orders} isLoading={isLoading} />
            <Pagination records={orders} handlePageNumber={handlePageNumber}  />
          </div>
          <div className="col-span-3">
          <ViewTitle text="DATOS GENERALES" />
            <div className="mb-2 mx-3 border-2 shadow-xl rounded-md">
                <div className="m-2 grid grid-cols-6">
                    <span className="col-span-4 px-2 xl:text-xl">Ordenes Pendientes: </span>
                    <span className="col-span-2 px-2 xl:text-xl text-right">{ countOrdersWithStatusX(orders.data, "status", 2) }</span>
                </div>
            </div>
            <div className="mb-2 mx-3 border-2 shadow-xl rounded-md">
                <div className="m-2 grid grid-cols-6">
                    <span className="col-span-4 px-2 xl:text-xl">Servicio en Mesa: </span>
                    <span className="col-span-2 px-2 xl:text-xl text-right">{ countOrdersWithStatusX(orders.data, "order_type", 2) }</span>
                </div>
            </div>
            <div className="mb-2 mx-3 border-2 shadow-xl rounded-md">
                <div className="m-2 grid grid-cols-6">
                    <span className="col-span-4 px-2 xl:text-xl">Delivery: </span>
                    <span className="col-span-2 px-2 xl:text-xl text-right">{ countOrdersWithStatusX(orders.data, "order_type", 3) }</span>
                </div>
            </div>
          </div>
      </div>
  )
}
