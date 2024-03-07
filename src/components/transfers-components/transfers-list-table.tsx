'use client'
import { formatDateAsDMY, formatHourAsHM } from "@/utils/date-formats";
import { NothingHere } from "../nothing-here/nothing-here";

interface TransfersListTableProps {
  records?:  any;
}

export function TransfersListTable(props: TransfersListTableProps) {
  const { records } = props;

  if (!records.data) return <NothingHere width="164" height="98" />;
  if (records.data.length == 0) return <NothingHere text="No se encontraron datos" width="164" height="98" />;

  const status = (status: number)=>{
    switch (status) {
      case 1: return <span className="status-info uppercase">En Progreso</span>
      case 2: return <span className="status-info uppercase">Activo</span>
      case 3: return <span className="status-warning uppercase">* Aceptado</span>
      case 4: return <span className="status-success uppercase">Aceptado</span>
      case 5: return <span className="status-danger uppercase">Rechazado</span>
      default: return <span>Eliminado</span>
    }
}

  const listItems = records.data.map((record: any) => (
    <tr key={record.id} className="border-b bg-white" >
      <td className="py-3 px-6">
      { record?.received_at ? formatDateAsDMY(record?.received_at) : "N/A" } 
      { record?.received_at && formatHourAsHM(record?.received_at) }</td>
      <td className="py-3 px-6 whitespace-nowrap">{ record?.to?.name }</td> 
      <td className="py-3 px-6 truncate">{ record?.send }</td>
      <td className="py-3 px-6 truncate">{ record?.receive ? record?.receive : "PENDIENTE" }</td>
      <td className="py-3 px-6 truncate">{ status(record?.status) }</td>
    </tr>
  ));


  return (<div>
  <div className="w-full overflow-auto">
    <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
      <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
        <tr>
          <th scope="col" className="py-3 px-4 border">Recibido</th>
          <th scope="col" className="py-3 px-4 border">Destino</th>
          <th scope="col" className="py-3 px-4 border">Envia</th>
          <th scope="col" className="py-3 px-4 border">Recibe</th>
          <th scope="col" className="py-3 px-4 border">Estado</th>
        </tr>
      </thead>
      <tbody>{listItems}</tbody>
    </table>
 </div>
 </div>);
}
