'use client'
import { getTotalOfItem, numberToMoney, percentage } from "@/utils/functions";
import { NothingHere } from "../nothing-here/nothing-here";
import { Loading } from "../loading/loading";
import { formatDateAsDMY } from "@/utils/date-formats";


interface ReportsSalesTableProps {
  records?:  any;
  isLoading?: boolean;
}

export function ReportsSalesTable(props: ReportsSalesTableProps) {
  const { records, isLoading } = props;



  if (isLoading) return <Loading />;
  if (!records.data) return <NothingHere width="164" height="98" />;
  if (records.data.length == 0) return <NothingHere text="No se encontraron datos" width="164" height="98" />;



  const listItems = records.data.map((record: any, key: any) => (
    <tr key={key} className={`border-b`}>
      <td className="py-2 px-6 truncate">{ formatDateAsDMY(record?.created_at) } </td>
      <th className="py-2 px-6 text-gray-900 whitespace-nowrap dark:text-white" scope="row">{ record?.product }</th>
      <td className="py-2 px-6">{ record?.cod }</td>
      {/* <td className="py-2 px-6">{ numberToMoney(record?.unit_price ? record?.unit_price : 0) }</td> */}
      <td className="py-2 px-6">{ record?.quantity }</td>
      <td className="py-2 px-6">{ numberToMoney(record?.unit_cost ? record?.unit_cost : 0) }</td>
      <td className="py-2 px-6">{ numberToMoney(record?.unit_cost ? record?.unit_cost * record?.quantity : 0) }</td>
      <td className="py-2 px-6">{ numberToMoney(record?.unit_price ? record?.unit_price : 0) }</td>
      <td className="py-2 px-6">{ numberToMoney(record?.unit_price ? record?.unit_price * record?.quantity : 0) }</td>
      <td className="py-2 px-6">{ numberToMoney(record?.discount_percerntage ? record?.discount_percerntage : 0) }</td>
      <td className="py-2 px-6">{ numberToMoney(record?.discount ? record?.discount : 0) }</td>
      <td className="py-2 px-6">{ numberToMoney(record?.total ? record?.total : 0) }</td>
      <td className="py-2 px-6">{ numberToMoney((record?.unit_price * record?.quantity) - (record?.unit_cost * record?.quantity)) }</td>
      <td className="py-2 px-6">{ percentage(record?.unit_cost * record?.quantity, record?.unit_price * record?.quantity) }</td>
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
          {/* <th scope="col" className="py-3 px-4 border">Documento</th> */}
          <th scope="col" className="py-3 px-4 border">Cantidad</th>
          <th scope="col" className="py-3 px-4 border">Costo U</th>
          <th scope="col" className="py-3 px-4 border">Costo T</th>
          <th scope="col" className="py-3 px-4 border">Precio U</th>
          <th scope="col" className="py-3 px-4 border">Precio T</th>
          <th scope="col" className="py-3 px-4 border">Descuento</th>
          <th scope="col" className="py-3 px-4 border">Monto</th>
          <th scope="col" className="py-3 px-4 border">Total</th>
          <th scope="col" className="py-3 px-4 border">Margen $</th>
          <th scope="col" className="py-3 px-4 border">Margen %</th>
        </tr>
      </thead>
      <tbody>{listItems}</tbody>
    </table>


 </div>
 </div>);
}
