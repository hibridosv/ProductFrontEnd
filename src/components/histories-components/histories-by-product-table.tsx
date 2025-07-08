'use client'
import { getPaymentTypeName, getTotalOfItem, numberToMoney } from "@/utils/functions";
import { NothingHere } from "../nothing-here/nothing-here";
import { Loading } from "../loading/loading";
import { formatDate, formatHourAsHM } from "@/utils/date-formats";
import { useContext, useState } from "react";
import { ConfigContext } from "@/contexts/config-context";


interface HistoriesByProductTableProps {
  records?:  any;
  isLoading?: boolean;
}

export function HistoriesByProductTable(props: HistoriesByProductTableProps) {
  const { records, isLoading } = props;
  const { systemInformation } = useContext(ConfigContext);



  if (isLoading) return <Loading />;
  if (!records.data) return <NothingHere width="164" height="98" />;
  if (records.data.length == 0) return <NothingHere text="No se encontraron datos" width="164" height="98" />;



  const listItems = records.data.map((record: any, key: any) => (
    <tr key={record.id} className="border-b">
      <td className="py-2 px-6 truncate">{ formatDate(record?.order?.charged_at) } | { formatHourAsHM(record?.order?.charged_at)} </td>
      <td className="py-2 px-6">{ record?.order?.casheir?.name } </td>
      <td className="py-2 px-6">
        <span>{ record?.order?.invoice_assigned?.name }:</span>
        <span className="ml-3">{ record?.order?.invoice }</span>
      </td>
      <td className="py-2 px-6">{ record?.order?.client ? record?.order?.client?.name : "N/A" }</td>
      <td className="py-2 px-6">{ record?.cod }</td>
      <td className="py-2 px-6">{ record?.product }</td>
      <td className="py-2 px-6">{ record?.quantity }</td>
      <td className="py-2 px-6">{ numberToMoney((record?.total / record?.quantity), systemInformation) }</td>
      <td className="py-2 px-6">{ numberToMoney(record?.discount ? record?.discount : 0, systemInformation) }</td>
      <td className="py-2 px-6">{ numberToMoney(record?.total ? record?.total : 0, systemInformation) }</td>
    </tr>
  ));


  return (<div>
  <div className="w-full overflow-auto">
    <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
      <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
        <tr>
          <th scope="col" className="py-3 px-4 border">Fecha cobrada</th>
          <th scope="col" className="py-3 px-4 border">Cajero</th>
          <th scope="col" className="py-3 px-4 border">Factura</th>
          <th scope="col" className="py-3 px-4 border">Cliente</th>
          <th scope="col" className="py-3 px-4 border">Codigo</th>
          <th scope="col" className="py-3 px-4 border">Producto</th>
          <th scope="col" className="py-3 px-4 border">Cantidad</th>
          <th scope="col" className="py-3 px-4 border">Precio</th>
          <th scope="col" className="py-3 px-4 border">Descuento</th>
          <th scope="col" className="py-3 px-4 border">Total</th>
        </tr>
      </thead>
      <tbody>{listItems}</tbody>
    </table>

        <div className="uppercase shadow-lg border-x-2 mx-4 mt-4 mb-4 p-4 bg-white rounded-lg">
            <div>Total de Productos: <span className=" font-semibold">{ getTotalOfItem(records?.data , "quantity") }</span></div>
            <div>Total descuentos: <span className=" font-semibold">{ numberToMoney(getTotalOfItem(records?.data, "discount"), systemInformation) }</span></div>
            <div>Total de ventas: <span className=" font-semibold">{ numberToMoney(getTotalOfItem(records?.data, "total"), systemInformation) }</span></div>
        </div>

 </div>
 </div>);
}
