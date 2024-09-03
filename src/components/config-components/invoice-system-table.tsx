'use client'
import { getPaymentTypeName, getTotalOfItem, numberToMoney } from "@/utils/functions";
import { NothingHere } from "../nothing-here/nothing-here";
import { Loading } from "../loading/loading";
import { formatDateAsDMY, formatHourAsHM } from "@/utils/date-formats";
import { useContext, useState } from "react";
import { ConfigContext } from "@/contexts/config-context";


interface InvoiceSystemTableProps {
  records?:  any;
  isLoading?: boolean;
}

export function InvoiceSystemTable(props: InvoiceSystemTableProps) {
  const { records, isLoading } = props;
  const [showInvoiceModal, setShowInvoiceModal] = useState<boolean>(false);
  const [recordSelect, setRecordSelect] = useState<string>("");
  const { systemInformation } = useContext(ConfigContext);



  if (isLoading) return <Loading />;
  if (!records.data) return <NothingHere width="164" height="98" />;
  if (records.data.length == 0) return <NothingHere text="No se encontraron datos" width="164" height="98" />;

    const status = (status: number) =>{
        switch (status) {
            case 1: return <div className="status-danger">Pendiente</div>;
            case 2: return <div className="status-success">Pagado</div>;
            case 3: return <div className="status-warning">Anulado</div>;
            case 0: return <div className="status-info">Inactivo</div>;
            default: return <div>N/A</div>;
        }
    }

  const listItems = records.data.map((record: any, key: any) => (
    <tr key={key} className="border-b">
      <td className="py-2 px-6 truncate uppercase">{ record.id.slice(-4) } </td>
      <td className="py-2 px-6 truncate">{ formatDateAsDMY(record?.billing_day) } </td>
      <td className="py-2 px-6">{ numberToMoney(record?.total, systemInformation) }</td>
      <td className={`py-2 px-6`}>{ formatDateAsDMY(record?.expires_at) }</td>
      <td className={`py-2 px-6`}>{ status(record?.status) }</td>
    </tr>
  ));

  return (<div>
  <div className="w-full overflow-auto">
    <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
      <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
        <tr>
          <th scope="col" className="py-3 px-4 border">Codigo</th>
          <th scope="col" className="py-3 px-4 border">Fecha Facturación</th>
          <th scope="col" className="py-3 px-4 border">Total</th>
          <th scope="col" className="py-3 px-4 border">Expira</th>
          <th scope="col" className="py-3 px-4 border">Estado</th>
        </tr>
      </thead>
      <tbody>{listItems}</tbody>
    </table>
 </div>
 </div>);
}
