'use client'
import { numberToMoney, percentage } from "@/utils/functions";
import { formatDateAsDMY } from "@/utils/date-formats";
import { NothingHere } from "../nothing-here/nothing-here";
import { Loading } from "../loading/loading";
import { ConfigContext } from "@/contexts/config-context";
import { useContext } from "react";


interface ReportsProductsTableProps {
  records?:  any;
  isLoading?: boolean;
}

export function ReportsProductsTable(props: ReportsProductsTableProps) {
  const { records, isLoading } = props;
  const { systemInformation } = useContext(ConfigContext);

  if (isLoading) return <Loading />;
  if (!records.data) return <NothingHere width="164" height="98" />;
  if (records.data.length == 0) return <NothingHere text="No se encontraron datos" width="164" height="98" />;

  
  const listItems = records.data.map((record: any, key: any) => (
    <tr key={key} className={`border-b`}>
      <td className="py-2 px-6 truncate">{ formatDateAsDMY(record?.created_at) } </td>
      <th className="py-2 px-6 text-gray-900 whitespace-nowrap dark:text-white" scope="row">{ record?.product?.description }</th>
      <td className="py-2 px-6">{ record?.product?.cod }</td>
      <td className="py-2 px-6">{ record?.document_number ? record?.document_number : "N/A" }</td>
      <td className="py-2 px-6">{ record?.quantity }</td>
      <td className="py-2 px-6">{ numberToMoney(record?.unit_cost ? record?.unit_cost : 0, systemInformation) }</td>
      <td className="py-2 px-6">{ record?.provider?.name }</td>
      <td className="py-2 px-6">{ record?.expiration ? formatDateAsDMY(record?.expiration) : "N/A" }</td>
      <td className="py-2 px-6">{ record?.employee?.name }</td>
    </tr>
  ));


  return (<div>
  <div className="w-full overflow-auto">
    <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
      <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
        <tr>
          <th scope="col" className="py-3 px-4 border">Fecha</th>
          <th scope="col" className="py-3 px-4 border">Producto</th>
          <th scope="col" className="py-3 px-4 border">Codigo</th>
          <th scope="col" className="py-3 px-4 border">Documento</th>
          <th scope="col" className="py-3 px-4 border">Cantidad</th>
          <th scope="col" className="py-3 px-4 border">Precio Costo</th>
          <th scope="col" className="py-3 px-4 border">Proveedor</th>
          <th scope="col" className="py-3 px-4 border">Caduca</th>
          <th scope="col" className="py-3 px-4 border">Usuario</th>
        </tr>
      </thead>
      <tbody>{listItems}</tbody>
    </table>


 </div>
 </div>);
}
