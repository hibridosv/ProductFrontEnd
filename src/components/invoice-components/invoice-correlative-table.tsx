'use client'
import { getCountryProperty, numberToMoney } from "@/utils/functions";
import { NothingHere } from "../nothing-here/nothing-here";
import { Loading } from "../loading/loading";
import { formatDateAsDMY } from "@/utils/date-formats";
import { useContext } from "react";
import { ConfigContext } from "@/contexts/config-context";
import { ButtonDownload } from "../button/button-download";


interface InvoiceCorrelativeTableProps {
  records?:  any;
  isLoading?: boolean;
  invoiceId?: string;
}

export function InvoiceCorrelativeTable(props: InvoiceCorrelativeTableProps) {
  const { records, isLoading, invoiceId } = props;
  const { systemInformation } = useContext(ConfigContext);

  if (isLoading) return <Loading />;
  if (!records.data) return <NothingHere width="164" height="98" />;
  if (records.data.length == 0) return <NothingHere text="No se encontraron datos" width="164" height="98" />;



  const listItems = records.data.map((record: any, key: any) => (
    <tr key={key} className="border-b">
      <td className="py-2 px-6 truncate">
      <ButtonDownload 
            href={`/download/pdf/invoices/correlative/?invoiceId=${invoiceId}&date=${record?.date}`}
            autoclass={false}
            divider="&">
            { formatDateAsDMY(record?.date) }
      </ButtonDownload>
      </td>
      <td className="py-2 px-6">{ record?.invoices } </td>
      <td className="py-2 px-6 text-center truncate">{ record?.initial_correlative } - { record?.final_correlative }</td>
      <td className="py-2 px-6">{ numberToMoney(record?.subtotal ? record?.subtotal : 0, systemInformation) }</td>
      <td className="py-2 px-6">{ numberToMoney(record?.taxes ? record?.taxes : 0, systemInformation) }</td>
      <td className="py-2 px-6">{ numberToMoney(record?.total_exempt ? record?.total_exempt : 0, systemInformation) }</td>
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
          <th scope="col" className="py-3 px-4 border">Facturas</th>
          <th scope="col" className="py-3 px-4 border text-center truncate">Factura Inicial -  Factura Final</th>
          <th scope="col" className="py-3 px-4 border">Sub Total</th>
          <th scope="col" className="py-3 px-4 border">{ getCountryProperty(parseInt(systemInformation?.system?.country)).taxesName }</th>
          <th scope="col" className="py-3 px-4 border">Exento</th>
          <th scope="col" className="py-3 px-4 border">Gravado</th>
          <th scope="col" className="py-3 px-4 border">Total</th>
        </tr>
      </thead>
      <tbody>{listItems}</tbody>
    </table>
 </div>
 </div>);
}
