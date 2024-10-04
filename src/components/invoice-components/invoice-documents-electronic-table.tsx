'use client'
import { NothingHere } from "../nothing-here/nothing-here";
import { Loading } from "../loading/loading";
import { API_URL } from "@/constants";
import { InvoiceDetailsModal } from "./invoice-details-modal";
import { useState } from "react";
import { FaEdit } from "react-icons/fa";
import { Tooltip } from "flowbite-react";
import { ErrorsSVModal } from "./errors-sv-modal";
import { EmailSendModal } from "./email-send-modal";


interface InvoiceDocumentsElectronicTableProps {
  records?:  any;
  isLoading?: boolean;
  resendDocument: (invoice: string)=> void
}

export function InvoiceDocumentsElectronicTable(props: InvoiceDocumentsElectronicTableProps) {
  const { records, isLoading, resendDocument } = props;
  const [showInvoiceModal, setShowInvoiceModal] = useState<boolean>(false);
  const [recordSelect, setRecordSelect] = useState<string>("");
  const [showErrorsModal, setShowErrorsModal] = useState<boolean>(false);
  const [showEmailModal, setShowEmailModal] = useState<boolean>(false);
  const [errorsSelect, setErrorsSelect] = useState([]);


  if (isLoading) return <Loading />;
  if (!records.data) return <NothingHere width="164" height="98" />;
  if (records.data.length == 0) return <NothingHere text="No se encontraron datos" width="164" height="98" />;

const status = (status: number, codigo: string)=>{
    switch (status) {
        case 1: return <span className="status-info">RECIBIDO</span>;
        case 2: return <span className="status-warning">FIRMADO</span>;
        case 3: return <span className="status-danger" >RECHAZADO</span>;
        case 4: return <span className="status-success">PROCESADO</span>;
        case 5: return <span className="status-danger">ANULADO</span>;
    }
}

const tipoDTE = (dte: string)=>{
    switch (dte) {
        case "01": return <span>Factura</span>;
        case "03": return <span>CCF</span>;
        case "14": return <span>FSE</span>;
        case "11": return <span>FEX</span>;
        case "05": return <span>NC</span>;
    }
}


  const listItems = records.data.map((record: any, key: any) => (
    <tr key={record.id} className="border-b">
      <td className="py-2 px-6 truncate">{ record?.fecha_procesamiento ? record?.fecha_procesamiento : "N/A" } </td>
      <td className={`py-2 px-6 ${record?.status == 4 ? 'clickeable font-semibold' : 'text-red-500'}`}>
        { record?.status == 4 ?
        <a target="_blank" href={`${API_URL}documents/download/pdf/${record?.codigo_generacion}/${record?.client_id}`} title="Descargar PDF">
          { tipoDTE(record?.tipo_dte) }
        </a>  
          :
        <div title={record?.observaciones}>{ tipoDTE(record?.tipo_dte) }</div>
        }
      </td>
      <td className={`py-2 px-6 ${(record?.tipo_dte == "01" || record?.tipo_dte == "03") && 'clickeable'}`} onClick={(record?.tipo_dte == "01" || record?.tipo_dte == "03") ? ()=>{ setRecordSelect(record?.codigo_generacion); setShowInvoiceModal(true)} : ()=>{} } title="Ver detalles de documento"> { record?.numero_control } </td>
      <td className={`py-2 px-6 ${record?.status == 3 && 'clickeable'}`} title={record?.descripcion_msg} onClick={ record?.status == 3 ? ()=>{ setErrorsSelect(record?.observaciones); setShowErrorsModal(true); } : ()=>{}}>{ status(record?.status, record?.codigo_generacion) }</td>
      <td className="py-2 px-6">{ record?.email == 1 ? "Enviado" : "Sin Enviar" }</td>
      <td className="py-2 px-6">
      <Tooltip animation="duration-300" style="light" content={
            <div className="w-8/10">
              <div className={`w-full font-semibold ${(record?.tipo_dte == "01" || record?.tipo_dte == "03") ? 'text-slate-700 py-2 px-4 hover:bg-slate-100 clickeable' : 'text-red-700 py-2 px-4 hover:bg-red-100'}`} onClick={ (record?.tipo_dte == "01" || record?.tipo_dte == "03") ? ()=>{ setRecordSelect(record?.codigo_generacion); setShowInvoiceModal(true)} : ()=>{} }>Detalles del documento</div>
              
              <div className={`w-full font-semibold text-slate-700 py-2 px-4 hover:bg-slate-100 ${record?.status == 4 ? 'clickeable' : ''}`}>
              { record?.status == 4 ?
              <a target="_blank" href={`${API_URL}documents/download/pdf/${record?.codigo_generacion}/${record?.client_id}`} title="Descargar PDF"> Descargar PDF </a>  :
              <div> Descargar PDF</div>
              }
              </div>
              <div className={`w-full font-semibold text-slate-700 py-2 px-4 hover:bg-slate-100 ${record?.status == 4 ? 'clickeable' : ''}`}>
              { record?.status == 4 ?
              <a target="_blank" href={`${API_URL}documents/download/json/${record?.codigo_generacion}/${record?.client_id}`} title="Descargar PDF"> Descargar JSON </a>  :
              <div> Descargar JSON</div>
              }
              </div>

              <div className={`w-full font-semibold text-slate-700 py-2 px-4 hover:bg-slate-100 ${record?.status == 4 ? 'clickeable' : ''}`} 
              onClick={ record?.status == 4 ? ()=>{ setRecordSelect(record?.email); setShowEmailModal(true)} : ()=>{} }> Reenviar Email</div>

              <div className={`w-full font-semibold ${record?.status == 3 ? 'text-red-700 py-2 px-4 hover:bg-red-100 clickeable' : 'text-slate-700 py-2 px-4 hover:bg-slate-100'}`} onClick={ record?.status == 3 ? ()=> resendDocument(record?.codigo_generacion) : ()=> {}}>Reenviar Documento</div>
            </div>
          }>
        <div className='clickeable'><FaEdit size="1.2em" /></div>
      </Tooltip>
            
      </td>
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
          <th scope="col" className="py-3 px-4 border">OP</th>
        </tr>
      </thead>
      <tbody>{listItems}</tbody>
    </table>

 </div>
 <InvoiceDetailsModal isShow={showInvoiceModal} onClose={()=>setShowInvoiceModal(false)} record={recordSelect} />
 <ErrorsSVModal isShow={showErrorsModal} onClose={()=>setShowErrorsModal(false)} errors={errorsSelect} />
 <EmailSendModal isShow={showEmailModal} onClose={()=>setShowEmailModal(false)} record={recordSelect} />
 </div>);
}
