'use client'
import { documentType, getPaymentTypeName, getTotalOfItem, numberToMoney } from "@/utils/functions";
import { NothingHere } from "../nothing-here/nothing-here";
import { Loading } from "../loading/loading";
import { formatDate, formatHourAsHM } from "@/utils/date-formats";
import { InvoiceDetailsModal } from "../invoice-components/invoice-details-modal";
import { useContext, useState } from "react";
import { ConfigContext } from "@/contexts/config-context";


interface HistoriesByDayTableProps {
  records?:  any;
  isLoading?: boolean;
}

export function HistoriesByDayTable(props: HistoriesByDayTableProps) {
  const { records, isLoading } = props;
  const [showInvoiceModal, setShowInvoiceModal] = useState<boolean>(false);
  const [recordSelect, setRecordSelect] = useState<string>("");
  const { systemInformation } = useContext(ConfigContext);


  if (isLoading) return <Loading />;
  if (!records.data) return <NothingHere width="164" height="98" />;
  if (records.data.length == 0) return <NothingHere text="No se encontraron datos" width="164" height="98" />;



  const listItems = records.data.map((record: any , key: any) => (
    <tr key={key} className="border-b">
      <td className="py-2 px-6">{ formatDate(record?.date) } </td>
      <td className="py-2 px-6">{ numberToMoney(record?.subtotal ? record?.subtotal : 0, systemInformation) } </td>
      <td className="py-2 px-6">{ numberToMoney(record?.taxes ? record?.taxes : 0, systemInformation) } </td>
      <td className="py-2 px-6">{ numberToMoney(record?.exempt ? record?.exempt : 0, systemInformation) } </td>
      <td className="py-2 px-6">{ numberToMoney(record?.total_recorded ? record?.total_recorded : 0, systemInformation) }</td>
      <td className="py-2 px-6">{ numberToMoney(record?.total ? record?.total : 0, systemInformation) }</td>
    </tr>
  ));


  return (<div>
  <div className="w-full overflow-auto">
    <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
      <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
        <tr>
          <th scope="col" className="py-3 px-4 border">Fecha</th>
          <th scope="col" className="py-3 px-4 border">Subtotal</th>
          <th scope="col" className="py-3 px-4 border">IVA</th>
          <th scope="col" className="py-3 px-4 border">Exento</th>
          <th scope="col" className="py-3 px-4 border">Gravado</th>
          <th scope="col" className="py-3 px-4 border">Total</th>
        </tr>
      </thead>
      <tbody>{listItems}</tbody>
    </table>

        <div className="uppercase shadow-lg border-x-2 ml-4 my-4 ">
            <div className="px-4">Subtotal: <span className="font-semibold">{ numberToMoney(getTotalOfItem(records?.data, "subtotal"), systemInformation) }</span></div>
            <div className="px-4">IVA: <span className="font-semibold">{ numberToMoney(getTotalOfItem(records?.data, "taxes"), systemInformation) }</span></div>
            <div className="px-4">Exento: <span className="font-semibold">{ numberToMoney(getTotalOfItem(records?.data, "exento"), systemInformation) }</span></div>
            <div className="px-4">Gravado: <span className="font-semibold">{ numberToMoney(getTotalOfItem(records?.data, "total_recorded"), systemInformation) }</span></div>
            <div className="px-4">Total: <span className="font-semibold">{ numberToMoney(getTotalOfItem(records?.data, "total"), systemInformation) }</span></div>
        </div>

 </div>
 </div>);
}
