'use client'
import { NothingHere } from "../nothing-here/nothing-here";
import { Loading } from "../loading/loading";
import { formatDateAsDMY, formatHourAsHM } from "@/utils/date-formats";
import { API_URL } from "@/constants";
import { InvoiceDetailsModal } from "./invoice-details-modal";
import { useState } from "react";


interface InvoiceDocumentsElectronicTableProps {
  records?:  any;
  isLoading?: boolean;
  resendDocument: (invoice: string)=> void
}

export function InvoiceDocumentsElectronicTable(props: InvoiceDocumentsElectronicTableProps) {
  const { records, isLoading, resendDocument } = props;
  const [howInvoiceModal, setShowInvoiceModal] = useState<boolean>(false);
  const [recordSelect, setRecordSelect] = useState<string>("");

  if (isLoading) return <Loading />;
  if (!records.data) return <NothingHere width="164" height="98" />;
  if (records.data.length == 0) return <NothingHere text="No se encontraron datos" width="164" height="98" />;

const status = (status: number, codigo: string)=>{
    switch (status) {
        case 1: return <span className="status-info">RECIBIDO</span>;
        case 2: return <span className="status-warning">FIRMADO</span>;
        case 3: return <span className="status-danger clickeable" onClick={()=>{ resendDocument(codigo)}}>RECHAZADO</span>;
        case 4: return <span className="status-success">PROCESADO</span>;
        case 5: return <span className="status-danger">ANULADO</span>;
    }
}

const tipoDTE = (dte: string)=>{
    switch (dte) {
        case "01": return <span>Factura</span>;
        case "03": return <span>CCF</span>;
        case "14": return <span>FSE</span>;
    }
}


  const listItems = records.data.map((record: any, key: any) => (
    <tr key={record.id} className="border-b">
      <td className="py-2 px-6 truncate">{ record?.fecha_procesamiento ? record?.fecha_procesamiento : "N/A" } </td>
      <td className={`py-2 px-6 ${record?.status == 4 ? 'clickeable font-semibold' : 'text-red-500'}`}>
        { record?.status == 4 ?
        <a target="_blank" href={`${API_URL}documents/download/${record?.codigo_generacion}/${record?.client_id}`}>{ tipoDTE(record?.tipo_dte) }</a>  :
        <div title={record?.observaciones} onClick={()=>{ setRecordSelect(record?.codigo_generacion); setShowInvoiceModal(true)}}>{ tipoDTE(record?.tipo_dte) }</div>
        }
      </td>
      <td className="py-2 px-6">{ record?.numero_control }</td>
      <td className="py-2 px-6" title={record?.descripcion_msg}>{ status(record?.status, record?.codigo_generacion) }</td>
      <td className="py-2 px-6">{ record?.email == 1 ? "Enviado" : "Sin Enviar" }</td>
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
        </tr>
      </thead>
      <tbody>{listItems}</tbody>
    </table>

 </div>
 <InvoiceDetailsModal isShow={howInvoiceModal} onClose={()=>setShowInvoiceModal(false)} record={recordSelect} />
 </div>);
}
