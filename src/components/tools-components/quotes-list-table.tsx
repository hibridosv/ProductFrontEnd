'use client'
import { NothingHere } from "../nothing-here/nothing-here";
import { useState } from "react";
import {  TbListDetails } from "react-icons/tb";
import { DeleteModal } from "../modals/delete-modal";
import { IoIosCloseCircle } from "react-icons/io";
import { formatDate } from "@/utils/date-formats";
import { formatDuiWithAll } from "@/utils/functions";
import { QuotesViewModal } from "./quotes-view-modal";

interface QuotesListTableProps {
  records?:  any;
  onDelete: (id: string) => void;
  sendQuotes: (quote: any) => void;
  isSending: boolean;
}

export function QuotesListTable(props: QuotesListTableProps) {
  const { records, onDelete, sendQuotes, isSending } = props;
  const [recordSelect, setRecordSelect] = useState<any>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showQuotesModal, setShowQuotesModal] = useState(false);

  if (!records.data) return <NothingHere width="164" height="98" />;
  if (records.data.length == 0) return <NothingHere text="No se encontraron datos" width="164" height="98" />;


  const handleRecordSelectDelete = (record: any) => {
    setRecordSelect(record);
    setShowDeleteModal(true);
  }

  const handleRecordDelete = (recordSelect: any)=> {
    onDelete(recordSelect);
    setShowDeleteModal(false);
    setRecordSelect(null);
  }


  const handleRecordSelectModal = (record: any) => {
    setRecordSelect(record);
    setShowQuotesModal(true);
  }

  const listItems = records.data.map((record: any) => (
    <tr key={record.id} className="border-b bg-white" >
      <td className="py-3 px-6 whitespace-nowrap font-semibold text-black">{ record?.quote_number }</td>
      <td className="py-3 px-6 whitespace-nowrap font-semibold text-black">{ record?.client_name }</td>
      <td className="py-3 px-6 whitespace-nowrap font-semibold text-black">{ formatDuiWithAll(record?.client?.document) }</td>
      <td className="py-3 px-6 whitespace-nowrap">{ formatDate(record?.created_at) }</td> 
      <td className="py-3 px-6 truncate">{ formatDate(record?.expiration) }</td>
      <td className="py-2 px-6 truncate">
        <span className="flex justify-between">
        <TbListDetails size={20} title="Ver detalles" className="text-cyan-600 clickeable" onClick={()=>handleRecordSelectModal(record)} />
        <IoIosCloseCircle size={20} title="Ver detalles" className="text-red-600 clickeable" onClick={()=>handleRecordSelectDelete(record)} />
        </span>
        </td>
    </tr>
  ));


  return (<div>
  <div className="w-full overflow-auto">
    <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
      <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
        <tr>
          <th scope="col" className="py-3 px-4 border">Numero</th>
          <th scope="col" className="py-3 px-4 border">Cliente</th>
          <th scope="col" className="py-3 px-4 border">Documento</th>
          <th scope="col" className="py-3 px-4 border">Fecha</th>
          <th scope="col" className="py-3 px-4 border">Expira</th>
          <th scope="col" className="py-3 px-4 border">OP</th>
        </tr>
      </thead>
      <tbody>{listItems}</tbody>
    </table>
    <DeleteModal isShow={showDeleteModal}
              text="¿Está seguro de eliminar esta cotización?"
              onDelete={()=>handleRecordDelete(recordSelect)}
              onClose={()=>setShowDeleteModal(false)} /> 

 </div>
 <QuotesViewModal isShow={showQuotesModal} record={recordSelect} onClose={()=>setShowQuotesModal(false)} sendQuotes={sendQuotes} isSending={isSending} />
 </div>);
}
