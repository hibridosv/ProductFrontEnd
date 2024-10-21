'use client'
import { getPaymentTypeName, getTotalOfItem, numberToMoney } from "@/utils/functions";
import { NothingHere } from "../nothing-here/nothing-here";
import { Loading } from "../loading/loading";
import { formatDate, formatDateAsDMY, formatHourAsHM } from "@/utils/date-formats";
import { useContext, useState } from "react";
import { InvoiceDetailsModal } from "./invoice-details-modal";
import { ConfigContext } from "@/contexts/config-context";


interface InvoiceDocumentsTableProps {
  records?:  any;
  isLoading?: boolean;
}

export function InvoiceDocumentsTable(props: InvoiceDocumentsTableProps) {
  const { records, isLoading } = props;
  const [showInvoiceModal, setShowInvoiceModal] = useState<boolean>(false);
  const [recordSelect, setRecordSelect] = useState<string>("");
  const { systemInformation } = useContext(ConfigContext);



  if (isLoading) return <Loading />;
  if (!records.data) return <NothingHere width="164" height="98" />;
  if (records.data.length == 0) return <NothingHere text="No se encontraron datos" width="164" height="98" />;



  const listItems = records.data.map((record: any, key: any) => (
    <tr key={key} className="border-b">
      <td className="py-2 px-6 truncate">{ formatDateAsDMY(record?.charged_at) } | { formatHourAsHM(record?.charged_at)} </td>
      <td className="py-2 px-6 font-bold clickeable" onClick={()=>{ setRecordSelect(record?.id); setShowInvoiceModal(true)}}>{ record?.invoice_assigned?.name } </td>
      <td className="py-2 px-6">{ record?.invoice }</td>
      <td className={`py-2 px-6 ${record?.status == 4 && 'text-red-500'}`}>{ record?.status == 3 ? "Pagado" : "Anulado" }</td>
      <td className="py-2 px-6">{ record?.client?.name ? record?.client?.name : "N/A" }</td>
      <td className="py-2 px-6">{ getPaymentTypeName(record?.payment_type) }</td>
      <td className="py-2 px-6">{ record?.casheir?.name } </td>
      <td className="py-2 px-6">{ numberToMoney(record?.total ? record?.total : 0, systemInformation) }</td>
    </tr>
  ));

  return (<div>
  <div className="w-full overflow-auto">
    <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
      <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
        <tr>
          <th scope="col" className="py-3 px-4 border">Fecha</th>
          <th scope="col" className="py-3 px-4 border">Tipo</th>
          <th scope="col" className="py-3 px-4 border">Numero</th>
          <th scope="col" className="py-3 px-4 border">Estado</th>
          <th scope="col" className="py-3 px-4 border">Cliente</th>
          <th scope="col" className="py-3 px-4 border">Tipo Pago</th>
          <th scope="col" className="py-3 px-4 border">Cajero</th>
          <th scope="col" className="py-3 px-4 border">Total</th>
        </tr>
      </thead>
      <tbody>{listItems}</tbody>
    </table>
    <InvoiceDetailsModal isShow={showInvoiceModal} onClose={()=>setShowInvoiceModal(false)} record={recordSelect} onElectronic={true} />
 </div>
 </div>);
}
