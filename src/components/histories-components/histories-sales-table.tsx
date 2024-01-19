'use client'
import { getTotalOfItem, numberToMoney } from "@/utils/functions";
import { NothingHere } from "../nothing-here/nothing-here";
import { Loading } from "../loading/loading";


interface HistoriesSalesTableProps {
  records?:  any;
  isLoading?: boolean;
}

export function HistoriesSalesTable(props: HistoriesSalesTableProps) {
  const { records, isLoading } = props;



  if (isLoading) return <Loading />;
  if (!records.data) return <NothingHere width="164" height="98" />;
  if (records.data.length == 0) return <NothingHere text="No se encontraron datos" width="164" height="98" />;



  const listItems = records.data.map((record: any, key: any) => (
    <tr key={key} className={`border-b`}>
      <td className="py-2 px-6 truncate">{ record?.cod } </td>
      <th className="py-2 px-6 text-gray-900 whitespace-nowrap dark:text-white" scope="row">{ record?.product }</th>
      <td className="py-2 px-6">{ record?.quantity_sum }</td>
      <td className="py-2 px-6">{ numberToMoney(record?.unit_price ? record?.unit_price : 0) }</td>
      <td className="py-2 px-6">{ numberToMoney(record?.discount_sum ? record?.discount_sum : 0) }</td>
      <td className="py-2 px-6">{ numberToMoney(record?.total_sum ? record?.total_sum : 0) }</td>
    </tr>
  ));


  return (<div>
  <div className="w-full overflow-auto">
    <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
      <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
        <tr>
          <th scope="col" className="py-3 px-4 border">Codigo</th>
          <th scope="col" className="py-3 px-4 border">Producto</th>
          <th scope="col" className="py-3 px-4 border">Cantidad</th>
          <th scope="col" className="py-3 px-4 border">Precio</th>
          <th scope="col" className="py-3 px-4 border">Descuento</th>
          <th scope="col" className="py-3 px-4 border">Total</th>
        </tr>
      </thead>
      <tbody>{listItems}</tbody>
    </table>

        <div className="uppercase shadow-lg border-x-2 ml-4 mt-4 ">
            <div>Cantidad de productos: <span className=" font-semibold">{ getTotalOfItem(records?.data, "quantity_sum") }</span></div>
            <div>Total descuentos: <span className=" font-semibold">{ numberToMoney(getTotalOfItem(records?.data, "discount_sum")) }</span></div>
            <div>Total de ventas: <span className=" font-semibold">{ numberToMoney(getTotalOfItem(records?.data, "total_sum")) }</span></div>
        </div>
 </div>
 </div>);
}
