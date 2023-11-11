'use client'
import { useState } from "react";
import { getPaymentTypeName, numberToMoney } from "@/utils/functions";
import { NothingHere } from "../nothing-here/nothing-here";
import { formatDateAsDMY } from "@/utils/date-formats";
import { Button, Preset } from "../button/button";

interface CashBillsTableProps {
  records?:  any;
}

export function CashBillsTable(props: CashBillsTableProps) {
  const { records } = props;



  if (!records.data) return <NothingHere width="164" height="98" />;
  if (records.data.length == 0) return <NothingHere text="No se encontraron datos" width="164" height="98" />;


  const listItems = records.data.map((record: any) => (
    <tr key={record.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700" >
      {/* <td className="py-3 px-6 whitespace-nowrap">{ record.name }</td> */}
      <th className="py-2 px-6 text-gray-900 whitespace-nowrap dark:text-white" scope="row"><div className={`${record?.description && "text-xs font-light"}`}>{ record.name }</div><div>{ record.description }</div></th>
      <td className="py-2 px-6">{ numberToMoney(record.quantity ? record.quantity : 0) }</td>
      {/* <td className="py-3 px-6 whitespace-nowrap">{ formatDateAsDMY(record.created_at) }</td> */}
      <td className="py-2 px-6 truncate">{ getPaymentTypeName(record.payment_type) }</td>
      {/* <td className="py-3 px-6 truncate">{ record.cash_accounts_id }</td> */}
      <td className="py-2 px-6 truncate"><Button preset={Preset.smallClose} noText /> </td>
    </tr>
  ));


  return (<div>
  <div className="w-full overflow-auto">
    <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
      <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
        <tr>
          {/* <th scope="col" className="py-3 px-4 border">Nombre</th> */}
          <th scope="col" className="py-3 px-4 border">Descripción</th>
          <th scope="col" className="py-3 px-4 border">Cantidad</th>
          {/* <th scope="col" className="py-3 px-4 border">Fecha</th> */}
          <th scope="col" className="py-3 px-4 border">Tipo Pago</th>
          {/* <th scope="col" className="py-3 px-4 border">Cuenta</th> */}
          <th scope="col" className="py-3 px-4 border">Del</th>
        </tr>
      </thead>
      <tbody>{listItems}</tbody>
    </table>
 </div>
 </div>);
}
