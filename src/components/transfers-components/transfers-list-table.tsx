'use client'
import { formatDateAsDMY, formatHourAsHM } from "@/utils/date-formats";
import { NothingHere } from "../nothing-here/nothing-here";
import { IoMdAlert } from "react-icons/io";
import { MdCheck } from "react-icons/md";
import { getTenant } from "@/services/oauth";
import { statusOfTransfer } from "./transfers-receive-table";
import { FaSpinner } from "react-icons/fa";

interface TransfersListTableProps {
  records?:  any;
  getProductsOnline: (transfer: number)=>void;
  isSending: boolean;
  getRequest: (tansferId: string)=>void
  updateStatus: (tansferId: string, status: number, reset: boolean)=>void
}

export function TransfersListTable(props: TransfersListTableProps) {
  const { records, getProductsOnline, isSending, getRequest, updateStatus } = props;
  const tenant = getTenant();

  if (!records.data) return <NothingHere width="164" height="98" />;
  if (records.data.length == 0) return <NothingHere text="No se encontraron datos" width="164" height="98" />;


  const listItems = records.data.map((record: any) => (
    <tr key={record.id} className={`border-b ${record.status == 6 && record.to_tenant_id == tenant || record.status == 7 && record.from_tenant_id == tenant ? "bg-red-100 clickeable" : record.status == 8 && record.from_tenant_id == tenant ? "bg-blue-100 clickeable" : "bg-white"}`} 
      onClick={record.status == 6 && record.to_tenant_id == tenant || record.status == 7 && record.from_tenant_id == tenant ? 
      ()=>getRequest(record.id) : record.status == 8 && record.from_tenant_id == tenant ? ()=>updateStatus(record?.id, 1, true) : ()=>{} }>
      <td className="py-3 px-6 truncate">
      { record?.received_at ? formatDateAsDMY(record?.received_at) : "N/A" } { record?.received_at && formatHourAsHM(record?.received_at) }</td>
      <td className="py-3 px-6">{ record?.from?.description }</td> 
      <td className="py-3 px-6">{ record?.to?.description }</td> 
      <td className="py-3 px-6">{ record?.send }</td>
      <td className="py-3 px-6">{ record?.receive ? record?.receive : "PENDIENTE" }</td>
      <td className="py-3 px-6">{ statusOfTransfer(record?.status) }</td>
      <td className="py-3 px-6">
        { isSending ? <FaSpinner size={20} className="text-teal-500 animate-spin" /> : 
        (record?.status == 3 || record?.status == 5) && record?.is_online == 1 ? 
        <IoMdAlert size={24}  className="clickleable text-orange-400" onClick={()=>getProductsOnline(record)}/> : 
        <MdCheck size={20} className="text-lime-600" /> }
        </td>
    </tr>
  ));


  return (<div>
  <div className="w-full overflow-auto">
    <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
      <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
        <tr>
          <th scope="col" className="py-3 px-4 border">Recibido</th>
          <th scope="col" className="py-3 px-4 border">Origen</th>
          <th scope="col" className="py-3 px-4 border">Destino</th>
          <th scope="col" className="py-3 px-4 border">Envia</th>
          <th scope="col" className="py-3 px-4 border">Recibe</th>
          <th scope="col" className="py-3 px-4 border">Estado</th>
          <th scope="col" className="py-3 px-4 border"></th>
        </tr>
      </thead>
      <tbody>{listItems}</tbody>
    </table>
 </div>
 </div>);
}
