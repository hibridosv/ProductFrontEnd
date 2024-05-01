'use client'
import { useState } from "react"
import { NothingHere } from "../nothing-here/nothing-here";
import { formatDateAsDMY, formatHourAsHM } from "@/utils/date-formats";
import { FailuresShowModal } from "./failures-show-modal";

interface ProductFailureTableProps {
  records?:  any;
}

export const typeFailure = (status: number) => {
  switch (status) {
    case 1: return <span className="status-danger">Averias</span>  
    case 2: return <span className="status-success">Traslado</span>
    case 3: return <span className="status-info">Devolución</span>
    case 4: return <span className="status-warning">Cambio</span>
  }
}

export function ProductFailureTable(props: ProductFailureTableProps) {
  const { records } = props;
  const [isShowModal, setIsShowModal] = useState(false);
  const [isSelectedRecord, setIsSelectedRecord] = useState(null as any);

  if (!records) return <NothingHere width="164" height="98" text="No existen registros" />;
  if (records.length == 0) return <NothingHere text="No existen registros" width="164" height="98" />;


  const selectRecord = (record: any)=>{
    setIsSelectedRecord(record)
    setIsShowModal(true)
  }

  const listItems = records.map((record: any) => (
    <tr key={record.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700" onClick={()=>selectRecord(record)}>
      <td className="py-2 px-2 truncate">{ formatDateAsDMY(record?.created_at) } { formatHourAsHM(record?.created_at) }</td>
      <td className="py-2 px-2">{ record?.employee?.name }</td>
      <td className="py-2 px-2 clickeable">{ typeFailure(record?.type) }</td>
      <td className="py-2 px-2 truncate uppercase">{ record.reason }</td>
      <td className="py-2 px-2">{ record?.failures?.length }</td>
      <td className="py-2 px-2"></td>
    </tr>
  ));


  return (<div>
  <div className="w-full overflow-auto">
    <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
      <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
        <tr>
          <th scope="col" className="py-2 px-2 border">Fecha</th>
          <th scope="col" className="py-2 px-2 border">Usuario</th>
          <th scope="col" className="py-2 px-2 border">Tipo</th>
          <th scope="col" className="py-2 px-2 border">Razón</th>
          <th scope="col" className="py-2 px-2 border">Productos</th>
        </tr>
      </thead>
      <tbody>{listItems}</tbody>
    </table>
 </div>
 <FailuresShowModal isShow={isShowModal} record={isSelectedRecord} onClose={()=>setIsShowModal(false)} />
 </div>);
}
