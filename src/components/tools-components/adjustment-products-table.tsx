'use client'
import { NothingHere } from "../nothing-here/nothing-here";
import { Loading } from "../loading/loading";
import { formatDate, formatHourAsHM } from "@/utils/date-formats";


interface AdjustmentProductsTableProps {
  records?:  any;
  isLoading?: boolean;
}

export function AdjustmentProductsTable(props: AdjustmentProductsTableProps) {
  const { records, isLoading } = props;

  if (isLoading) return <Loading />;
  if (!records.data) return <NothingHere width="164" height="98" />;
  if (records.data.length == 0) return <NothingHere text="No se encontraron datos" width="164" height="98" />;


  const listItems = records.data.map((record: any, key: any) => (
    <tr key={record.id} className={`border-b ${record?.status == 0 && 'bg-red-200'}`}>
      <td className="py-2 px-6">{ formatDate(record?.updated_at) } { formatHourAsHM(record?.updated_at) }</td>
      <td className="py-2 px-6">{ record?.cod } </td>
      <td className="py-2 px-6">{ record?.name } </td>
      <td className="py-2 px-6">{ record?.quantity } </td>
      <td className="py-2 px-6">{ record?.stablished } </td>
      <td className={`py-2 px-6 font-bold ${record?.difference == 0 ? "text-black" : record?.difference > 0 ? "text-lime-600" : "text-red-600" }`}>
        { record?.difference } </td>
    </tr>
  ));



  return (<div>
  <div className="w-full overflow-auto">
    <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
      <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
        <tr>
          <th scope="col" className="py-3 px-4 border">Fecha</th>
          <th scope="col" className="py-3 px-4 border">Cod</th>
          <th scope="col" className="py-3 px-4 border">Producto</th>
          <th scope="col" className="py-3 px-4 border">Cantidad</th>
          <th scope="col" className="py-3 px-4 border">Establecido</th>
          <th scope="col" className="py-3 px-4 border">Diferencia</th>
        </tr>
      </thead>
      <tbody>{listItems}</tbody>
    </table>
 </div>
 </div>);
}
