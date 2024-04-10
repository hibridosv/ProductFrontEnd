'use client'
import { documentType, getPaymentTypeName, getTotalOfItem, numberToMoney } from "@/utils/functions";
import { NothingHere } from "../nothing-here/nothing-here";
import { Loading } from "../loading/loading";
import { formatDate, formatHourAsHM } from "@/utils/date-formats";


interface HistoriesShippingNoteTableProps {
  records?:  any;
  isLoading?: boolean;
}

export function HistoriesShippingNoteTable(props: HistoriesShippingNoteTableProps) {
  const { records, isLoading } = props;


console.log(records)
  if (isLoading) return <Loading />;
  if (!records.data) return <NothingHere width="164" height="98" />;
  if (records.data.length == 0) return <NothingHere text="No se encontraron datos" width="164" height="98" />;



  const listItems = records.data.map((record: any, key: any) => (
    <tr key={record.id} className="border-b">
      <td className="py-2 px-6 truncate">{ formatDate(record?.charged_at) } | { formatHourAsHM(record?.charged_at)} </td>
      <th className="py-2 px-6 text-gray-900 whitespace-nowrap dark:text-white" scope="row">{ record?.casheir?.name } </th>
      <td className="py-2 px-6">{ record?.invoice_assigned?.name }</td>
      <td className="py-2 px-6">{ record?.invoice }</td>
      <td className="py-2 px-6">{ record?.products.length }</td>
      <td className="py-2 px-6">{ numberToMoney(record?.total ? record?.total : 0) }</td>
    </tr>
  ));


  return (<div>
  <div className="w-full overflow-auto">
    <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
      <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
        <tr>
          <th scope="col" className="py-3 px-4 border">Fecha Envio</th>
          <th scope="col" className="py-3 px-4 border">Cajero</th>
          <th scope="col" className="py-3 px-4 border">Tipo</th>
          <th scope="col" className="py-3 px-4 border">Correlativo</th>
          <th scope="col" className="py-3 px-4 border">Productos</th>
          <th scope="col" className="py-3 px-4 border">Total</th>
        </tr>
      </thead>
      <tbody>{listItems}</tbody>
    </table>

        <div className="uppercase shadow-lg border-x-2 ml-4 mt-4 ">
            <div>Cantidad de envíos: <span className=" font-semibold">{ records?.data.length }</span></div>
            <div>Total de envíos: <span className=" font-semibold">{ numberToMoney(getTotalOfItem(records?.data, "total")) }</span></div>
        </div>

 </div>
 </div>);
}
