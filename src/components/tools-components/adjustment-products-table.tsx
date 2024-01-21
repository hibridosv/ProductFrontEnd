'use client'
import { getPaymentTypeName, getTotalOfItem, numberToMoney } from "@/utils/functions";
import { NothingHere } from "../nothing-here/nothing-here";
import { Loading } from "../loading/loading";
import { formatDate, formatHourAsHM } from "@/utils/date-formats";
import { useState } from "react";
import { Button, Preset } from "../button/button";


interface AdjustmentProductsTableProps {
  records?:  any;
  isLoading?: boolean;
}

export function AdjustmentProductsTable(props: AdjustmentProductsTableProps) {
  const { records, isLoading } = props;


  if (isLoading) return <Loading />;
  if (!records.data) return <NothingHere width="164" height="98" />;
  if (records.data.length == 0) return <NothingHere text="No se encontraron datos" width="164" height="98" />;


  const listItems = records.data.map((record: any, key: any) => (
    <tr key={record.id} className={`border-b ${record?.status == 0 && 'bg-red-200'}`}>
      <td className="py-2 px-6">{ record?.cod } </td>
      <td className="py-2 px-6">{ record?.name } </td>
      <td className="py-2 px-6">{ record?.quantity } </td>
      <td className="py-2 px-6"><Button text="Cambiar" /> </td>
      <td className="py-2 px-6"><Button preset={Preset.save} text="Aceptar" /> </td>
    </tr>
  ));


  return (<div>
  <div className="w-full overflow-auto">
    <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
      <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
        <tr>
          <th scope="col" className="py-3 px-4 border">Cod</th>
          <th scope="col" className="py-3 px-4 border">Producto</th>
          <th scope="col" className="py-3 px-4 border">Cantidad</th>
          <th scope="col" className="py-3 px-4 border">Cambiar</th>
          <th scope="col" className="py-3 px-4 border">Aceptar</th>
        </tr>
      </thead>
      <tbody>{listItems}</tbody>
    </table>
 </div>
 </div>);
}
