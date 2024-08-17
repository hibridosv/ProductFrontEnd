'use client'
import { documentType, getPaymentTypeName, numberToMoney, percentage } from "@/utils/functions";
import { formatDateAsDMY } from "@/utils/date-formats";
import { NothingHere } from "../nothing-here/nothing-here";
import { Loading } from "../loading/loading";
import { ConfigContext } from "@/contexts/config-context";
import { useContext } from "react";


interface ReportsBillsTableProps {
  records?:  any;
  isLoading?: boolean;
}

export function ReportsBillsTable(props: ReportsBillsTableProps) {
  const { records, isLoading } = props;
  const { systemInformation } = useContext(ConfigContext);

  if (isLoading) return <Loading />;
  if (!records.data) return <NothingHere width="164" height="98" />;
  if (records.data.length == 0) return <NothingHere text="No se encontraron datos" width="164" height="98" />;

  
  const listItems = records.data.map((record: any, key: any) => (
    <tr key={key} className={`border-b`}>
      <td className="py-2 px-6 truncate">{ formatDateAsDMY(record?.created_at) } </td>
      <td className="py-2 px-6">{ record?.employee?.name }</td>
      <td className="py-2 px-6">{ record?.invoice ? documentType(record?.invoice) : "N/A" }</td>
      <td className="py-2 px-6">{ record?.invoice_number ? record?.invoice_number : "N/A" }</td>
      <td className="py-2 px-6">{ record?.category?.name ? record?.category?.name : "N/A" }</td>
      <td className="py-2 px-6 whitespace-nowrap">
        <div className="font-bold">{ record?.name }</div>
        <span className="small">{ record?.description }</span>
      </td>
      <td className="py-2 px-6">{ getPaymentTypeName(record?.type) }</td>
      <td className="py-2 px-6">{ record?.account?.account ? record?.account?.account : "N/A" }</td>
      <th className="py-2 px-6">{ numberToMoney(record?.quantity ? record?.quantity : 0, systemInformation) }</th>
    </tr>
  ));

//   Fecha	Tipo(comprobante)	No Documento	Documento	Grupo Gasto	Gasto	Descripcion	Tipo Pago	Cuenta	Monto
  return (<div>
  <div className="w-full overflow-auto">
    <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
      <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
        <tr>
          <th scope="col" className="py-3 px-4 border">Fecha</th>
          <th scope="col" className="py-3 px-4 border">Empleado</th>
          <th scope="col" className="py-3 px-4 border">Documento</th>
          <th scope="col" className="py-3 px-4 border">No Documento</th>
          <th scope="col" className="py-3 px-4 border">Categoria</th>
          <th scope="col" className="py-3 px-4 border">Gasto</th>
          <th scope="col" className="py-3 px-4 border">Tipo Pago</th>
          <th scope="col" className="py-3 px-4 border">Cuenta</th>
          <th scope="col" className="py-3 px-4 border">Monto</th>
        </tr>
      </thead>
      <tbody>{listItems}</tbody>
    </table>


 </div>
 </div>);
}
