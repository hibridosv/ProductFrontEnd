'use client'
import { getTotalOfItem, numberToMoney } from "@/utils/functions";
import { NothingHere } from "../nothing-here/nothing-here";
import { Loading } from "../loading/loading";
import { ConfigContext } from "@/contexts/config-context";
import { useContext } from "react";


interface InventoryHistoryTableProps {
  records?:  any;
  isLoading?: boolean;
}

export function InventoryHistoryTable(props: InventoryHistoryTableProps) {
  const { records, isLoading } = props;
  const { systemInformation } = useContext(ConfigContext);



  if (isLoading) return <Loading />;
  if (!records.data) return <NothingHere width="164" height="98" />;
  if (records.data.length == 0) return <NothingHere text="No se encontraron datos" width="164" height="98" />;



  const listItems = records.data.map((record: any, key: any) => (
    <tr key={key} className={`border-b`}>
      <td className="py-2 px-6 truncate">{ record?.cod } </td>
      <th className="py-2 px-6 text-gray-900 whitespace-nowrap dark:text-white" scope="row">{ record?.description }</th>
      <td className="py-2 px-6">{  numberToMoney(record?.unit_cost ? record?.unit_cost : 0, systemInformation)}</td>
      <td className="py-2 px-6">{ record?.qty_balance }</td>
      <td className="py-2 px-6">{ numberToMoney(record?.total_balance ? record?.total_balance : 0, systemInformation) }</td>
    </tr>
  ));


  return (<div>
  <div className="w-full overflow-auto">
    <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
      <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
        <tr>
          <th scope="col" className="py-3 px-4 border">Codigo</th>
          <th scope="col" className="py-3 px-4 border">Producto</th>
          <th scope="col" className="py-3 px-4 border">Costo Unitario</th>
          <th scope="col" className="py-3 px-4 border">Cantidad</th>
          <th scope="col" className="py-3 px-4 border">Total</th>
        </tr>
      </thead>
      <tbody>{listItems}</tbody>
    </table>

        <div className="uppercase shadow-lg border-x-2 mx-4 mt-4 mb-4 p-4 bg-white rounded-lg">
            <div>Valor de inventario: <span className=" font-semibold">{ numberToMoney(getTotalOfItem(records?.data, "total_balance"), systemInformation) }</span></div>
        </div>
 </div>
 </div>);
}
