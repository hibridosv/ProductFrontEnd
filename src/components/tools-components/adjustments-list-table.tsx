'use client'
import { NothingHere } from "../nothing-here/nothing-here";
import { Loading } from "../loading/loading";
import { formatDate, formatHourAsHM } from "@/utils/date-formats";
import { useState } from "react";
import { AdjustmentProductsModal } from "./adjustment-products-modal";


interface AdjustmentListTableProps {
  records?:  any;
  isLoading?: boolean;
  random?: (value: number) => void;
}

export function AdjustmentListTable(props: AdjustmentListTableProps) {
  const { records, isLoading, random } = props;
  const [isModalProduct, setIsModalProduct] = useState(false);
  const [recordSelected, setRecordSelected] = useState({} as any);


  if (isLoading) return <Loading />;
  if (!records.data) return <NothingHere width="164" height="98" />;
  if (records.data.length == 0) return <NothingHere text="No se encontraron datos" width="164" height="98" />;



  const listItems = records.data.map((record: any, key: any) => (
    <tr key={record.id} className={`border-b ${record?.status == 0 && 'bg-red-200'}`}>
      <td className="py-2 px-6">{ formatDate(record?.initial_date) } { formatHourAsHM(record?.initial_date) }</td>
      <td className="py-2 px-6">{ formatDate(record?.final_date) } { formatHourAsHM(record?.final_date) } </td>
      <td className="py-2 px-6">{ record?.total_products } </td>
      <td className="py-2 px-6">{ record?.checked_products } </td>
      <td className="py-2 px-6" onClick={()=>setModal(record?.id)}><span className="status-info clickeable">Finalizado</span></td>
    </tr>
  ));

  const setModal = (record: any)=> {
    setRecordSelected(record)
    setIsModalProduct(true)
  }

  return (<div>
  <div className="w-full overflow-auto">
    <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
      <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
        <tr>
          <th scope="col" className="py-3 px-4 border">Fecha Inicial</th>
          <th scope="col" className="py-3 px-4 border">Fecha Final</th>
          <th scope="col" className="py-3 px-4 border">Productos</th>
          <th scope="col" className="py-3 px-4 border">Ajustados</th>
          <th scope="col" className="py-3 px-4 border">Estado</th>
        </tr>
      </thead>
      <tbody>{listItems}</tbody>
    </table>
 </div>
 <AdjustmentProductsModal isShow={isModalProduct} record={recordSelected} onClose={()=>setIsModalProduct(false)} />
 </div>);
}
