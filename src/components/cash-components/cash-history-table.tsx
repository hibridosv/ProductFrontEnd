'use client'
import { numberToMoney } from "@/utils/functions";
import { NothingHere } from "../nothing-here/nothing-here";
import { Tooltip } from "flowbite-react";
import { formatDateAsDMY } from "@/utils/date-formats";

interface CashhistoryTableProps {
  records?:  any;
}

export function CashhistoryTable(props: CashhistoryTableProps) {
  const { records } = props;

  if (!records.data) return <NothingHere width="164" height="98" />;
  if (records.data.length == 0) return <NothingHere text="No se encontraron datos" width="164" height="98" />;

  const viewTooltip = (previus: number, current: number)=>{
     return (
        <div>
            <div><span className="mr-3">Saldo Anterior</span>{ numberToMoney(previus ? previus : 0) }</div>
            <div><span className="mr-3">Saldo Actual</span>{ numberToMoney(current ? current : 0) }</div>
        </div>
     )
  }


  const listItems = records.data.map((record: any) => (

    <tr key={record.id} className={`border-b  ${record.status == 1 ? 'bg-white' : 'bg-red-200'}`} >
      <td className="py-3 px-6 whitespace-nowrap cursor-pointer font-semibold text-black">
      <Tooltip animation="duration-300" 
      content={`Fecha: ${formatDateAsDMY(record.created_at)}`} >{ record?.name }</Tooltip>
      </td>
      
      
      <td className="py-3 px-6 whitespace-nowrap cursor-pointer">
      {record?.from_cash_accounts_id ? <Tooltip animation="duration-300" 
      content={viewTooltip(record?.from_previous_balance, record?.from_current_balance)} >{ record?.account_from?.bank }</Tooltip> :
      <span className="ml-4 text-red-500 font-semibold text-center">N/A</span> }
      </td> 
      <td className="py-3 px-6 truncate cursor-pointer">
      { record?.to_cash_accounts_id ?  <Tooltip animation="duration-300" 
      content={viewTooltip(record?.to_previous_balance,record?.to_current_balance)} >{ record?.account_to?.bank }</Tooltip> :
      <span className="ml-4 text-red-500 font-semibold text-center">N/A</span> }
      </td>
      <td className="py-3 px-6 truncate">{ numberToMoney(record?.quantity ? record?.quantity : 0) }</td>
      <td className="py-2 px-6">{ record?.employee?.name }</td>
    </tr>
  ));


  return (<div>
  <div className="w-full overflow-auto">
    <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
      <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
        <tr>
          <th scope="col" className="py-3 px-4 border">Nombre</th>
          <th scope="col" className="py-3 px-4 border">Origen</th>
          <th scope="col" className="py-3 px-4 border">Destino</th>
          <th scope="col" className="py-3 px-4 border">Cantidad</th>
          <th scope="col" className="py-3 px-4 border">Usuario</th>
        </tr>
      </thead>
      <tbody>{listItems}</tbody>
    </table>
 </div>
 </div>);
}
