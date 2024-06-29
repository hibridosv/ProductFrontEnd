'use client'
import { documentType, getPaymentTypeName, getTotalOfItem, numberToMoney } from "@/utils/functions";
import { NothingHere } from "../nothing-here/nothing-here";
import { Loading } from "../loading/loading";
import { formatDate, formatHourAsHM } from "@/utils/date-formats";


interface HistoriesPaymentTableProps {
  records?:  any;
  isLoading?: boolean;
}

export function HistoriesPaymentTable(props: HistoriesPaymentTableProps) {
  const { records, isLoading } = props;



  if (isLoading) return <Loading />;
  if (!records.data) return <NothingHere width="164" height="98" />;
  if (records.data.length == 0) return <NothingHere text="No se encontraron datos" width="164" height="98" />;



  const listItems = records.data.map((record: any, key: any) => (
    <tr key={record.id} className="border-b">
      <td className="py-2 px-6 truncate">{ formatDate(record?.created_at) } | { formatHourAsHM(record?.created_at)} </td>
      <th className="py-2 px-6 text-gray-900 whitespace-nowrap dark:text-white" scope="row">{ record?.employee?.name } </th>
      <td className="py-2 px-6">{ record?.credit?.order?.invoice }</td>
      <td className="py-2 px-6">{ numberToMoney(record?.quantity ? record?.quantity : 0) }</td>
      <td className="py-2 px-6">{ numberToMoney(record?.balance ? record?.balance : 0) }</td>
    </tr>
  ));


  return (<div>
  <div className="w-full overflow-auto">
    <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
      <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
        <tr>
          <th scope="col" className="py-3 px-4 border">Fecha cobrada</th>
          <th scope="col" className="py-3 px-4 border">Cajero</th>
          <th scope="col" className="py-3 px-4 border">Factura</th>
          <th scope="col" className="py-3 px-4 border">Abono</th>
          <th scope="col" className="py-3 px-4 border">Saldo</th>
        </tr>
      </thead>
      <tbody>{listItems}</tbody>
    </table>

        <div className="uppercase shadow-lg border-x-2 ml-4 mt-4 ">
            <div>Total Abonos: <span className=" font-semibold">{ numberToMoney(getTotalOfItem(records?.data, "quantity")) }</span></div>
        </div>

 </div>
 </div>);
}
