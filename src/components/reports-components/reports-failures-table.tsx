'use client'
import { getTotalOfItem, numberToMoney, percentage } from "@/utils/functions";
import { NothingHere } from "../nothing-here/nothing-here";
import { Loading } from "../loading/loading";
import { formatDateAsDMY, formatHourAsHM } from "@/utils/date-formats";


interface ReportsFailuresTableProps {
  records?:  any;
  isLoading?: boolean;
}

export function ReportsFailuresTable(props: ReportsFailuresTableProps) {
  const { records, isLoading } = props;



  if (isLoading) return <Loading />;
  if (!records.data) return <NothingHere width="164" height="98" />;
  if (records.data.length == 0) return <NothingHere text="No se encontraron datos" width="164" height="98" />;


  const listItems = records.data.map((record: any, key: any) => (
    <tr key={key} className={`border-b  ${record?.status == 2 && 'bg-red-200'}`}>
      <td className="py-2 px-6 truncate">{ formatDateAsDMY(record?.created_at) } { formatHourAsHM(record?.created_at) }</td>
      <td className="py-2 px-6">{ record?.product?.cod }</td>
      <th className="py-2 px-6 text-gray-900 whitespace-nowrap dark:text-white" scope="row">{ record?.product?.description }</th>
      <th className="py-2 px-6">{ numberToMoney(record?.product?.unit_cost) }</th>
      <td className="py-2 px-6">{ record?.quantity }</td>
      <td className="py-2 px-6  whitespace-nowrap"  scope="row">{ record?.reason }</td>
      <td className="py-2 px-6">{ record?.employee?.name }</td>
      <td className="py-2 px-6">{ record?.deleted_by?.name ? record?.deleted_by?.name : "N/A" }</td>
    </tr>
  ));


  return (<div>
  <div className="w-full overflow-auto">
    <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
      <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
        <tr>
          <th scope="col" className="py-3 px-4 border">Fecha</th>
          <th scope="col" className="py-3 px-4 border">Codigo</th>
          <th scope="col" className="py-3 px-4 border">Producto</th>
          <th scope="col" className="py-3 px-4 border">Costo U</th>
          <th scope="col" className="py-3 px-4 border">Cantidad</th>
          <th scope="col" className="py-3 px-4 border">Razón</th>
          <th scope="col" className="py-3 px-4 border">Empleado</th>
          <th scope="col" className="py-3 px-4 border">Eliminado</th>
        </tr>
      </thead>
      <tbody>{listItems}</tbody>
    </table>


 </div>
 </div>);
}
