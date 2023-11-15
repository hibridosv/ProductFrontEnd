'use client'
import { numberToMoney } from "@/utils/functions";
import { NothingHere } from "../nothing-here/nothing-here";
import { Tooltip } from "flowbite-react";
import { formatDateAsDMY } from "@/utils/date-formats";
import { MdAddchart } from "react-icons/md";

interface CredistPayableTableProps {
  records?:  any;
  onClick: ()=> void;
  creditSelect: (credit: any)=> void;
}

export function CredistPayableTable(props: CredistPayableTableProps) {
  const { records, onClick, creditSelect } = props;

  if (!records.data) return <NothingHere width="164" height="98" />;
  if (records.data.length == 0) return <NothingHere text="No se encontraron datos" width="164" height="98" />;

  const status = (expiration: number) => {
    return (expiration == 1) ? 
    <span className=" text-lime-500 font-bold ">ACTIVO</span> : 
    <span className=" text-sky-500 font-bold ">PAGADO</span>;
  }

  const handleClick = (credit: any)=>{
    creditSelect(credit)
    onClick();
  }

  
  const listItems = records.data.map((record: any) => (
    <tr key={record.id} className="border-b bg-white" >
      <td className="py-3 px-6 whitespace-nowrap cursor-pointer font-semibold text-black">
      <Tooltip animation="duration-300" 
      content={`Fecha: ${formatDateAsDMY(record.created_at)}`} >{ record?.name }</Tooltip>
      </td>
      <td className="py-3 px-6 truncate">{ record?.provider?.name }</td>
      <td className="py-3 px-6 whitespace-nowrap cursor-pointer">{formatDateAsDMY(record?.expiration)}</td> 
      {/* <td className="py-2 px-6">{ record?.description }</td> */}
      <td className="py-3 px-6 truncate">{ numberToMoney(record?.quantity ? record?.quantity : 0) }</td>
      <td className="py-3 px-6 truncate">{ numberToMoney(record?.balance ? record?.balance : 0) }</td>
      <td className="py-2 px-6">{ status(record?.status) }</td>
      <td className="py-2 px-6"><MdAddchart size={28} className="text-lime-600 clickeable" onClick={()=>handleClick(record)} /></td>
    </tr>
  ));


  return (<div>
  <div className="w-full overflow-auto">
    <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
      <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
        <tr>
          <th scope="col" className="py-3 px-4 border">Nombre</th>
          <th scope="col" className="py-3 px-4 border">Proveedor</th>
          <th scope="col" className="py-3 px-4 border">Fecha limite</th>
          <th scope="col" className="py-3 px-4 border">Total</th>
          <th scope="col" className="py-3 px-4 border">Saldo</th>
          <th scope="col" className="py-3 px-4 border">Estado</th>
          <th scope="col" className="py-3 px-4 border">OP</th>
        </tr>
      </thead>
      <tbody>{listItems}</tbody>
    </table>
 </div>
 </div>);
}
