'use client'
import { getTotalOfItem, numberToMoney, percentage } from "@/utils/functions";
import { NothingHere } from "../nothing-here/nothing-here";
import { Loading } from "../loading/loading";
import { formatDate, formatHourAsHM } from "@/utils/date-formats";


interface HistoriesCostTableProps {
  records?:  any;
  isLoading?: boolean;
}

export function HistoriesCostTable(props: HistoriesCostTableProps) {
  const { records, isLoading } = props;



  if (isLoading) return <Loading />;
  if (!records.data) return <NothingHere width="164" height="98" />;
  if (records.data.length == 0) return <NothingHere text="No se encontraron datos" width="164" height="98" />;



  const listItems = records.data.map((record: any, key: any) => (
    <tr key={record.id} className="border-b">
      <td className="py-2 px-6 truncate">{ formatDate(record?.created_at) } | { formatHourAsHM(record?.created_at)} </td>
      <th className="py-2 px-6">{ record?.quantity } </th>
      <th className="py-2 px-6">{ record?.actual_stock } </th>
      <td className="py-2 px-6">{ numberToMoney(record?.unit_cost ? record?.unit_cost : 0) }</td>
      <td className="py-2 px-6">{ numberToMoney(record?.sale_price ? record?.sale_price : 0) }</td>
      <td className="py-2 px-6">{ numberToMoney((record?.sale_price) - (record?.unit_cost)) }</td>
      <td className="py-2 px-6">{ numberToMoney((record?.sale_price * record?.quantity) - (record?.unit_cost * record?.quantity)) }</td>
      <td className="py-2 px-6">{ percentage(record?.unit_cost * record?.quantity, record?.sale_price * record?.quantity).toFixed(2) } %</td>
      <th className="py-2 px-6 text-gray-900 whitespace-nowrap dark:text-white" scope="row">{ record?.provider?.name } </th>
    </tr>
  ));


  return (<div>
            <div className="uppercase shadow-lg border-x-2 ml-4 mt-4 font-bold text-2xl">
                <div>{ records.data?.[0].product?.cod} | { records.data?.[0].product?.description}</div>
            </div>
  <div className="w-full overflow-auto">
    <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
      <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
        <tr>
          <th scope="col" className="py-3 px-4 border">Ingreso</th>
          <th scope="col" className="py-3 px-4 border">Cantidad</th>
          <th scope="col" className="py-3 px-4 border">Existencia</th>
          <th scope="col" className="py-3 px-4 border">Precio Costo</th>
          <th scope="col" className="py-3 px-4 border">Precio Venta</th>
          <th scope="col" className="py-3 px-4 border">Utilidad Unit</th>
          <th scope="col" className="py-3 px-4 border">Utilidad Total</th>
          <th scope="col" className="py-3 px-4 border">Porcentaje</th>
          <th scope="col" className="py-3 px-4 border">Proveedor</th>
        </tr>
      </thead>
      <tbody>{listItems}</tbody>
    </table>

        <div className="uppercase shadow-lg border-x-2 ml-4 mt-4 ">
            <div>Total Registros: <span className=" font-semibold">{ records?.data.length }</span></div>
        </div>

 </div>
 </div>);
}
