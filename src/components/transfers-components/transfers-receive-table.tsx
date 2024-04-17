'use client'
import { formatDate, formatDateAsDMY, formatHourAsHM } from "@/utils/date-formats";
import { NothingHere } from "../nothing-here/nothing-here";
import { AiOutlineFundView } from "react-icons/ai";


export const statusOfTransfer = (status: number)=>{
  switch (status) {
    case 1: return <span className="status-info uppercase">En Progreso</span>
    case 2: return <span className="status-info uppercase">Activo</span>
    case 3: return <span className="status-warning uppercase">* Aceptado</span>
    case 4: return <span className="status-success uppercase">Aceptado</span>
    case 5: return <span className="status-danger uppercase">Rechazado</span>
    case 6: return <span className="status-danger uppercase">Solicitando</span>
    case 7: return <span className="status-danger uppercase">Solicitado</span>
    default: return <span className="uppercase font-bold">Eliminado</span>
  }
}

interface TransfersReceiveTableProps {
  records?:  any;
  showTransfer: (transfer: any) => void;
  showOpRow?: boolean;
}

export function TransfersReceiveTable(props: TransfersReceiveTableProps) {
  const { records, showTransfer, showOpRow = false } = props;

  if (!records.data) return <NothingHere width="164" height="98" />;
  if (records.data.length == 0) return <NothingHere text="No se encontraron datos" width="164" height="98" />;



  const listItems = records.data.map((record: any) => (
    <tr key={record.id} className={`border-b bg-white ${record.status == 2 && 'bg-lime-100'}`} >
      <td className="py-3 px-6 whitespace-nowrap"> { formatDateAsDMY(record?.created_at) } { formatHourAsHM(record?.created_at) }</td>
      <td className="py-3 px-6 whitespace-nowrap">{ record?.from?.name }</td> 
      <td className="py-3 px-6 whitespace-nowrap">{ record?.to?.name }</td> 
      <td className="py-3 px-6 truncate">{ record?.send }</td>
      <td className="py-3 px-6 truncate">{ record?.receive ? record?.receive : "N/A" }</td>
      <td className="py-3 px-6 truncate font-extrabold">{ record?.products ? record?.products?.length : "N/A" }</td>
      <td className="py-3 px-6 truncate">{ record?.received_at ? formatDate(record?.received_at) : "N/A" }</td>
      <td className="py-3 px-6 truncate clickeable" onClick={()=>showTransfer(record)}>{ statusOfTransfer(record?.status) }</td>
      { showOpRow &&
      <td className="py-3 px-6 truncate">
        <span className="flex justify-between">
          <AiOutlineFundView size={20} title="Ver detalles" className="text-red-600 clickeable" onClick={()=>showTransfer(record)} />
        </span>
      </td>
      }
    </tr>
  ));


  return (<div>
  <div className="w-full overflow-auto">
    <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
      <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
        <tr>
          <th scope="col" className="py-3 px-4 border">Enviado</th>
          <th scope="col" className="py-3 px-4 border">Origen</th>
          <th scope="col" className="py-3 px-4 border">Destino</th>
          <th scope="col" className="py-3 px-4 border">Envia</th>
          <th scope="col" className="py-3 px-4 border">Recibe</th>
          <th scope="col" className="py-3 px-4 border">Productos</th>
          <th scope="col" className="py-3 px-4 border">Recibido</th>
          <th scope="col" className="py-3 px-4 border">Estado</th>
          { showOpRow &&
          <th scope="col" className="py-3 px-4 border">OP</th>
          }
        </tr>
      </thead>
      <tbody>{listItems}</tbody>
    </table>
 </div>
 </div>);
}
