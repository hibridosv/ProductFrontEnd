'use client'
import { numberToMoney } from "@/utils/functions";
// import { useState } from "react";
import { NothingHere } from "../nothing-here/nothing-here";
import { formatDateAsDMY } from "@/utils/date-formats";

interface KardexTableProps {
  records?:  any;
}

export function KardexTable(props: KardexTableProps) {
  const { records } = props;

  if (!records.data) return <NothingHere widht="164" height="98" />;
  if (records.data.length == 0) return <NothingHere text="No se encontraron datos" widht="164" height="98" />;




  const listItems = records.data.map((record: any) => (
    <tr key={record.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700" >
      <td className="py-3 px-6">{ formatDateAsDMY(record.created_at) }</td>
      <th className="py-3 px-6 font-medium text-gray-900 whitespace-nowrap dark:text-white cursor-pointer" scope="row">{ record.description }</th>
      <td className="py-3 px-6">{ record.unit_cost }</td>
      <td className="py-3 px-6">{ record.qty_in ? record.qty_in : 0 }</td>
      <td className="py-3 px-6">{ numberToMoney(record.total_in ? record.total_in : 0) }</td>
      <td className="py-3 px-6">{ record.qty_out ? record.qty_out : 0 }</td>
      <td className="py-3 px-6">{ numberToMoney(record.total_out ? record.total_out : 0) }</td>
      <td className="py-3 px-6">{ record.qty_balance ? record.qty_balance : 0 }</td>
      <td className="py-3 px-6">{ numberToMoney(record.total_balance ? record.total_balance : 0) }</td>
    </tr>
  ));


  return (<div>
  <div className="text-2xl md:text-1xl text-gray-800">PRODUCTO: {records?.product?.description}</div>
  <div className="text-2xl md:text-1xl">METODO: COSTO PROMEDIO PONDERADO</div>
  <div className="w-full overflow-auto">
    <table className="text-sm text-left text-gray-500 dark:text-gray-400">
      <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
        <tr>
          <th scope="col" colSpan={3} className="py-3 px-4 border">Código: {records?.product?.cod}</th>
          <th scope="col" colSpan={2} className="py-3 px-4 border">Entradas</th>
          <th scope="col" colSpan={2} className="py-3 px-4 border">Salidas</th>
          <th scope="col" colSpan={2} className="py-3 px-4 border">Saldo</th>
        </tr>
      </thead>
      <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
        <tr>
          <th scope="col" className="py-3 px-4 border">Fecha</th>
          <th scope="col" className="py-3 px-4 border">Detalle</th>
          <th scope="col" className="py-3 px-4 border">Costo U</th>
          <th scope="col" className="py-3 px-4 border">Cantidad</th>
          <th scope="col" className="py-3 px-4 border">Total</th>
          <th scope="col" className="py-3 px-4 border">Cantidad</th>
          <th scope="col" className="py-3 px-4 border">Total</th>
          <th scope="col" className="py-3 px-4 border">Cantidad</th>
          <th scope="col" className="py-3 px-4 border">Total</th>
        </tr>
      </thead>
      <tbody>{listItems}</tbody>
    </table>
 </div>
 </div>);
}
