'use client'
import { getPaymentTypeName, getTotalOfItem, numberToMoney } from "@/utils/functions";
import { NothingHere } from "../nothing-here/nothing-here";
import { Loading } from "../loading/loading";
import { formatDate, formatHourAsHM } from "@/utils/date-formats";
import { useContext, useState } from "react";
import { ConfigContext } from "@/contexts/config-context";


interface HistoriesRemittancesTableProps {
  records?:  any;
  isLoading?: boolean;
}

export function HistoriesRemittancesTable(props: HistoriesRemittancesTableProps) {
  const { records, isLoading } = props;
  const { systemInformation } = useContext(ConfigContext);


  if (isLoading) return <Loading />;
  if (!records.data) return <NothingHere width="164" height="98" />;
  if (records.data.length == 0) return <NothingHere text="No se encontraron datos" width="164" height="98" />;


  const listItems = records.data.map((record: any, key: any) => (
    <tr key={record.id} className={`border-b ${record?.status == 0 && 'bg-red-200'}`}>
      <td className="py-2 px-6 truncate">{ formatDate(record?.created_at) } | { formatHourAsHM(record?.created_at)} </td>
      <th className="py-2 px-6 text-gray-900 whitespace-nowrap dark:text-white" scope="row">{ record?.name } </th>
      <td className="py-2 px-6">{ record?.description } </td>
      <td className="py-2 px-6">{ record?.account?.account }</td>
      <td className="py-2 px-6 text-gray-900 whitespace-nowrap dark:text-white" scope="row">{ record?.employee?.name } </td>
      <td className="py-2 px-6">{ numberToMoney(record?.quantity ? record?.quantity : 0, systemInformation) }</td>
    </tr>
  ));


  return (<div>
  <div className="w-full overflow-auto">
    <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
      <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
        <tr>
          <th scope="col" className="py-3 px-4 border">Fecha</th>
          <th scope="col" className="py-3 px-4 border">Nombre</th>
          <th scope="col" className="py-3 px-4 border">Descripción</th>
          <th scope="col" className="py-3 px-4 border">Tipo de pago</th>
          <th scope="col" className="py-3 px-4 border">Cajero</th>
          <th scope="col" className="py-3 px-4 border">Cantidad</th>
        </tr>
      </thead>
      <tbody>{listItems}</tbody>
    </table>

        <div className="uppercase shadow-lg border-x-2 mx-4 mt-4 mb-4 p-4 bg-white rounded-lg">
            <div>Numero total remesas: <span className=" font-semibold">{ records?.data.length }</span></div>
            <div>Total en remesas: <span className=" font-semibold">{ numberToMoney(getTotalOfItem(records?.data, "quantity"), systemInformation) }</span></div>
        </div>
 </div>
 </div>);
}
