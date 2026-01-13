'use client'
import { numberToMoney } from "@/utils/functions";
import { NothingHere } from "../../nothing-here/nothing-here";
import { Loading } from "../../loading/loading";
import { formatDate, formatHourAsHM } from "@/utils/date-formats";
import { useContext, useState } from "react";
import { ConfigContext } from "@/contexts/config-context";


interface HistoriesDeletedTableProps {
  records?:  any;
  isLoading?: boolean;
}

export function HistoriesDeletedTable(props: HistoriesDeletedTableProps) {
  const { records, isLoading } = props;
  const { systemInformation } = useContext(ConfigContext);



  if (isLoading) return <Loading />;
  if (!records.data) return <NothingHere width="164" height="98" />;
  if (records.data.length == 0) return <NothingHere text="No se encontraron datos" width="164" height="98" />;



  const listItems = records.data.map((record: any, key: any) => (
    <tr key={record.id} className="border-b">
      <td className="py-2 px-6">{ formatDate(record?.updated_at) } | { formatHourAsHM(record?.updated_at)} </td>
      <td className="py-2 px-6">{ record?.order?.number } </td>
      <td className="py-2 px-6">{record?.quantity}</td>
      <td className="py-2 px-6">{record?.product}</td>
      <td className="py-2 px-6">{ numberToMoney(record?.total ? record?.total : 0, systemInformation) }</td>
      <td className="py-2 px-6">{record?.order?.employee?.name}</td>
      <td className="py-2 px-6">{record?.attributes?.deleted_by?.name}</td>
    </tr>
  ));


  return (<div>
  <div className="w-full overflow-auto">
    <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
      <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
        <tr>
          <th scope="col" className="py-3 px-4 border">Fecha | Hora</th>
          <th scope="col" className="py-3 px-4 border">orden</th>
          <th scope="col" className="py-3 px-4 border">Cantidad</th>
          <th scope="col" className="py-3 px-4 border">Producto</th>
          <th scope="col" className="py-3 px-4 border">Total</th>
          <th scope="col" className="py-3 px-4 border">Usuario</th>
          <th scope="col" className="py-3 px-4 border">Eliminado por</th>
        </tr>
      </thead>
      <tbody>{listItems}</tbody>
    </table>
 </div>
 </div>);
}
