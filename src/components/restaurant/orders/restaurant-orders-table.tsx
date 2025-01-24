'use client';
import { deliveryType, orderStatus, orderType } from "@/utils/functions";
import { Loading } from "@/components/loading/loading";
import { NothingHere } from "@/components/nothing-here/nothing-here";
import { useRelativeTime } from "@/hooks/useRelativeTime";
import { BiInfoCircle } from "react-icons/bi";
import React from "react";


interface OrderRowProps {
    record: any;
  }
  
  function OrderRow({ record }: OrderRowProps) {
    const relativeTime = useRelativeTime(record?.created_at);
  
    return (
      <tr className="border-b">
        <th className="py-2 px-4">{record?.number}</th>
        <td className="py-2 px-4">{record?.attributes?.clients_quantity}</td>
        <td className="py-2 px-4">{record?.employee?.name}</td>
        <td className="py-2 px-4 truncate">{orderType(record?.order_type)}</td>
        <td className="py-2 px-4 truncate">{deliveryType(record?.delivery_type)}</td>
        <td className="py-2 px-4 truncate">{relativeTime}</td>
        <th className="py-2 px-4">{orderStatus(record?.status)}</th>
        <td className="py-2 px-4">
          <BiInfoCircle size={24} className="text-teal-500" />
        </td>
      </tr>
    );
  }

  interface RestaurantOrdersTableProps {
    records?: any;
    isLoading?: boolean;
  }

  
export function RestaurantOrdersTable(props: RestaurantOrdersTableProps) {
  const { records, isLoading } = props;

  if (isLoading) return <Loading />;
  if (!records?.data) return <NothingHere width="164" height="98" />;
  if (records?.data?.length === 0)
    return <NothingHere text="No se encontraron datos" width="164" height="98" />;

  return (
    <div>
      <div className="w-full overflow-auto">
        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="py-3 px-4 border">Orden</th>
              <th scope="col" className="py-3 px-4 border">Clientes</th>
              <th scope="col" className="py-3 px-4 border">Atiende</th>
              <th scope="col" className="py-3 px-4 border">Tipo de Servicio</th>
              <th scope="col" className="py-3 px-4 border">Llevar</th>
              <th scope="col" className="py-3 px-4 border">Tiempo</th>
              <th scope="col" className="py-3 px-4 border">Estado</th>
              <th scope="col" className="py-3 px-4 border"></th>
            </tr>
          </thead>
          <tbody>
            {records.data.map((record: any, key: number) => (
              <OrderRow key={key} record={record} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}