'use client'
import { useEffect, useState } from "react";
import { getFirstElement, getLastElement, numberToMoney } from "@/utils/functions";
import { NothingHere } from "../nothing-here/nothing-here";
import {  formatDate, formatDateAsDMY, formatTime } from "@/utils/date-formats";
import { Button, Preset } from "../button/button";
import { Tooltip } from "flowbite-react";

interface CredistPaymentsTableProps {
  records?:  any;
  onDelete: (record: any)=> void;
}

export function CredistPaymentsTable(props: CredistPaymentsTableProps) {
  const { records, onDelete } = props;
  const [isLasElement, setIsLasElement] = useState([] as any);


  useEffect(() => setIsLasElement(getFirstElement(records?.data)), [records]);


  if (!records.data) return <NothingHere width="164" height="98" />;
  if (records.data.length == 0) return <NothingHere text="No se encontraron datos" width="164" height="98" />;

  
  const status = (expiration: number) => {
    return (expiration == 1) ? 
    <span className=" text-lime-500 font-bold ">Activo</span> : 
    <span className=" text-red-500 font-bold cursor-pointer">Eliminado</span>;
  }

  const deleted = (record: any) => {
    return (<div>
                <div className=" text-sky-500 font-bold ">Eliminado por: {record?.deleted_by?.name}</div> 
                <div className=" text-sky-500 font-bold ">Fecha: {formatDate(record?.deleted_at)} | {formatTime(record?.deleted_at)}</div>
            </div>)}
  
  const listItems = records.data.map((record: any) => (
    <tr key={record.id} className="border-b bg-white" >
      <td className="py-1 px-6 whitespace-nowrap">{formatDateAsDMY(record?.created_at)}</td> 
      <td className="py-1 px-6 truncate">{ numberToMoney(record?.quantity ? record?.quantity : 0) }</td>
      <td className="py-1 px-6 truncate">{ record?.employee?.name }</td>
      <td className="py-1 px-6">
      { record?.status == 0 ? <Tooltip animation="duration-300" 
      content={deleted(record)} >{ status(record?.status) }</Tooltip> : status(record?.status) }
      </td>
      <td className="py-1 px-6"><Button preset={record?.status == 0 ? Preset.smallInfo : 
      isLasElement?.id == record?.id ? Preset.smallClose : Preset.smallCloseDisable} 
                                    disabled={
                                        record?.status == 0 || 
                                        isLasElement?.id != record?.id || 
                                        formatDateAsDMY(isLasElement?.created_at) != formatDateAsDMY(new Date()) ? true : false} 
                                        noText onClick={()=>onDelete(record)} /></td>
    </tr>
  ));


  return (<div>
  <div className="w-full overflow-auto">
    <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
      <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
        <tr>
          <th scope="col" className="py-3 px-4 border">Fecha</th>
          <th scope="col" className="py-3 px-4 border">Cantidad</th>
          <th scope="col" className="py-3 px-4 border">Usuario</th>
          <th scope="col" className="py-3 px-4 border">Estado</th>
          <th scope="col" className="py-3 px-4 border">Del</th>
        </tr>
      </thead>
      <tbody>{listItems}</tbody>
    </table>
 </div>
 </div>);
}
