'use client'
import { getPaymentTypeName, getTotalOfItem, numberToMoney } from "@/utils/functions";
import { NothingHere } from "../nothing-here/nothing-here";
import { Loading } from "../loading/loading";
import { formatDate, formatHourAsHM } from "@/utils/date-formats";
import { useContext, useState } from "react";
import { InvoiceDetailsModal } from "../invoice-components/invoice-details-modal";
import { ConfigContext } from "@/contexts/config-context";


interface HistoriesByUserTableProps {
  records?:  any;
  isLoading?: boolean;
}

export function HistoriesByUserTable(props: HistoriesByUserTableProps) {
  const { records, isLoading } = props;
  const [showInvoiceModal, setShowInvoiceModal] = useState<boolean>(false);
  const [recordSelect, setRecordSelect] = useState<string>("");
  const { systemInformation } = useContext(ConfigContext);



  if (isLoading) return <Loading />;
  if (!records.data) return <NothingHere width="164" height="98" />;
  if (records.data.length == 0) return <NothingHere text="No se encontraron datos" width="164" height="98" />;



  const listItems = records.data.map((record: any, key: any) => (
    <tr key={record.id} className="border-b">
      <td className="py-2 px-6 truncate">{ formatDate(record?.charged_at) } | { formatHourAsHM(record?.charged_at)} </td>
      <th className="py-2 px-6 text-gray-900 whitespace-nowrap dark:text-white clickeable" scope="row" onClick={()=>{ setRecordSelect(record?.id); setShowInvoiceModal(true)}}>{ record?.casheir?.name } </th>
      <td className="py-2 px-6">
        <span>{ record?.invoice_assigned?.name }:</span>
        <span className="ml-3">{ record?.invoice }</span>
      </td>
      <td className="py-2 px-6">{ record?.client?.name }</td>
      <td className="py-2 px-6">{ getPaymentTypeName(record?.payment_type) }</td>
      <td className="py-2 px-6">{ numberToMoney(record?.discount ? record?.discount : 0, systemInformation) }</td>
      <td className="py-2 px-6">{ numberToMoney(record?.total ? record?.total : 0, systemInformation) }</td>
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
          <th scope="col" className="py-3 px-4 border">Cliente</th>
          <th scope="col" className="py-3 px-4 border">Tipo Pago</th>
          <th scope="col" className="py-3 px-4 border">Descuento</th>
          <th scope="col" className="py-3 px-4 border">Total</th>
        </tr>
      </thead>
      <tbody>{listItems}</tbody>
    </table>

        <div className="uppercase shadow-lg border-x-2 mx-4 mt-4 mb-4 p-4 bg-white rounded-lg">
            <div>Total descuentos: <span className=" font-semibold">{ numberToMoney(getTotalOfItem(records?.data, "discount"), systemInformation) }</span></div>
            <div>Total de ventas: <span className=" font-semibold">{ numberToMoney(getTotalOfItem(records?.data, "total"), systemInformation) }</span></div>
        </div>

 </div>
 <InvoiceDetailsModal isShow={showInvoiceModal} onClose={()=>setShowInvoiceModal(false)} record={recordSelect} />

 </div>);
}
