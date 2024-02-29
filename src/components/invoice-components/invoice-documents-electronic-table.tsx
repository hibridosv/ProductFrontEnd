'use client'
import { getPaymentTypeName, getTotalOfItem, numberToMoney } from "@/utils/functions";
import { NothingHere } from "../nothing-here/nothing-here";
import { Loading } from "../loading/loading";
import { formatDate, formatDateAsDMY, formatHourAsHM } from "@/utils/date-formats";


interface InvoiceDocumentsElectronicTableProps {
  records?:  any;
  isLoading?: boolean;
}

export function InvoiceDocumentsElectronicTable(props: InvoiceDocumentsElectronicTableProps) {
  const { records, isLoading } = props;



  if (isLoading) return <Loading />;
  if (!records.data) return <NothingHere width="164" height="98" />;
  if (records.data.length == 0) return <NothingHere text="No se encontraron datos" width="164" height="98" />;

const status = (status: number)=>{
    switch (status) {
        case 1: return <span className="status-info">RECIBIDO</span>;
        case 2: return <span className="status-warning">FIRMADO</span>;
        case 3: return <span className="status-danger">RECHAZADO</span>;
        case 4: return <span className="status-success">PROCESADO</span>;
    }
}

const tipoDTE = (dte: string)=>{
    switch (dte) {
        case "01": return <span>Factura</span>;
        case "03": return <span>CCF</span>;
    }
}


  const listItems = records.data.map((record: any, key: any) => (
    <tr key={record.id} className="border-b">
      <td className="py-2 px-6 truncate">
        { record?.fecha_procesamiento ? formatDateAsDMY(record?.fecha_procesamiento) : formatDateAsDMY(record?.created_at) } | 
        { record?.fecha_procesamiento ? formatHourAsHM(record?.fecha_procesamiento) :  formatHourAsHM(record?.created_at)} 
      </td>
      <td className="py-2 px-6">{ tipoDTE(record?.tipo_dte) } </td>
      <td className="py-2 px-6">{ record?.numero_control }</td>
      <td className="py-2 px-6">{ status(record?.status) }</td>
      <td className="py-2 px-6">{ record?.email == 1 ? "Enviado" : "Sin Enviar" }</td>
      <td className="py-2 px-6">{ record?.observaciones }</td>
    </tr>
  ));

  return (<div>
  <div className="w-full overflow-auto">
    <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
      <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
        <tr>
          <th scope="col" className="py-3 px-4 border">Fecha</th>
          <th scope="col" className="py-3 px-4 border">Tipo DTE</th>
          <th scope="col" className="py-3 px-4 border">Numero de control</th>
          <th scope="col" className="py-3 px-4 border">Estado</th>
          <th scope="col" className="py-3 px-4 border">Email</th>
          <th scope="col" className="py-3 px-4 border">Observaciones</th>
        </tr>
      </thead>
      <tbody>{listItems}</tbody>
    </table>

 </div>
 </div>);
}
