'use client'
import { NothingHere } from "../nothing-here/nothing-here";
import { FaEdit } from "react-icons/fa";
import { useState } from "react";
import { ContactAddModal } from "./contact-add-modal";
import {  TbListDetails } from "react-icons/tb";
import { ContactViewModal } from "./contact-view-modal";
import { DeleteModal } from "../modals/delete-modal";
import { IoIosCloseCircle } from "react-icons/io";
import { Toaster } from "react-hot-toast";

interface ContactListTableProps {
  records?:  any;
  random: (value: number) => void;
  onDelete: (id: string) => void;
}

export function ContactListTable(props: ContactListTableProps) {
  const { records, random, onDelete } = props;
  const [isAdContactModal, setIsAdContactModal] = useState(false);
  const [isAdContactViewModal, setIsAdContactViewModal] = useState(false);
  const [recordSelect, setRecordSelect] = useState<any>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  if (!records.data) return <NothingHere width="164" height="98" />;
  if (records.data.length == 0) return <NothingHere text="No se encontraron datos" width="164" height="98" />;

  const handleRecordSelect = (record: any) => {
    setRecordSelect(record);
    setIsAdContactModal(true);
  }
  
  const handleRecordSelectView = (record: any) => {
    setRecordSelect(record);
    setIsAdContactViewModal(true);
  }


  const handleRecordSelectDelete = (record: any) => {
    setRecordSelect(record);
    setShowDeleteModal(true);
  }


  const handleRecordDelete = (recordSelect: any)=> {
    onDelete(recordSelect);
    setShowDeleteModal(false);
    setRecordSelect(null);
  }


  const listItems = records.data.map((record: any) => (
    <tr key={record.id} className="border-b bg-white" >
      <td className="py-3 px-6 whitespace-nowrap cursor-pointer font-semibold text-black" onClick={()=>handleRecordSelectView(record)}>{ record?.name }</td>
      <td className="py-3 px-6">{ record?.address }</td>
      <td className="py-3 px-6 whitespace-nowrap cursor-pointer">{ record?.phone }</td> 
      <td className="py-3 px-6 truncate">{ record?.email }</td>
      {/* <td className="py-3 px-6 truncate">{ record?.id_number }</td> */}
      <td className="py-2 px-6 truncate">
        <span className="flex justify-between">
        <FaEdit size={20} title="Editar" className="text-lime-600 clickeable" onClick={()=>handleRecordSelect(record)} />
        <TbListDetails size={20} title="Ver detalles" className="text-cyan-600 clickeable" onClick={()=>handleRecordSelectView(record)} />
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
          <th scope="col" className="py-3 px-4 border">Nombre</th>
          <th scope="col" className="py-3 px-4 border">Dirección</th>
          <th scope="col" className="py-3 px-4 border">Tel&eacute;fono</th>
          <th scope="col" className="py-3 px-4 border">Email</th>
          {/* <th scope="col" className="py-3 px-4 border">Documento</th> */}
          <th scope="col" className="py-3 px-4 border">OP</th>
        </tr>
      </thead>
      <tbody>{listItems}</tbody>
    </table>
    <Toaster position="top-right" reverseOrder={false} />
    <ContactAddModal isShow={isAdContactModal} onClose={()=>setIsAdContactModal(false)} record={recordSelect} random={random} />
    <ContactViewModal isShow={isAdContactViewModal} onClose={()=>setIsAdContactViewModal(false)} record={recordSelect} />
    <DeleteModal isShow={showDeleteModal}
              text="¿Está seguro de eliminar este contacto?"
              onDelete={()=>handleRecordDelete(recordSelect)}
              onClose={()=>setShowDeleteModal(false)} /> 

 </div>
 </div>);
}
