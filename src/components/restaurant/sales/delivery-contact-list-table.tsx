'use client'
import { FaEdit } from "react-icons/fa";
import { useState } from "react";
import {  TbListDetails } from "react-icons/tb";
import { IoIosCloseCircle } from "react-icons/io";
import { Toaster } from "react-hot-toast";
import { NothingHere } from "@/components/nothing-here/nothing-here";
import { ContactAddModal } from "@/components/contacts-components/contact-add-modal";
import { ContactViewModal } from "@/components/contacts-components/contact-view-modal";
import { DeleteModal } from "@/components/modals/delete-modal";

interface DeliveryContactListProps {
  records?:  any;
  random: (value: number) => void;
  onDelete: (id: string) => void;
}

export function DeliveryContactList(props: DeliveryContactListProps) {
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
    <div className="w-full bg-teal-50 px-2" key={record.id}>
        <div className="border rounded-sm shadow-md">
        <div className="mx-4 font-bold">{ record?.name }</div>
        <div className="flex justify-between mx-4">
            <div><span className=" font-medium">Dirección: </span>{ record?.address }</div>
            <div><span className=" font-medium">Telefono:</span> { record?.phone }</div>
        </div>
        </div>
    </div>
    // <tr key={record.id} className="border-b bg-white" >
    //   <td className="py-3 px-6 whitespace-nowrap cursor-pointer font-semibold text-black" onClick={()=>handleRecordSelectView(record)}>{ record?.name }</td>
    //   <td className="py-3 px-6">{ record?.address }</td>
    //   <td className="py-3 px-6 whitespace-nowrap cursor-pointer">{ record?.phone }</td> 
    //   <td className="py-3 px-6 truncate">{ record?.email }</td>
    //   <td className="py-2 px-6 truncate">
    //     <span className="flex justify-between">
    //     <FaEdit size={20} title="Editar" className="text-lime-600 clickeable" onClick={()=>handleRecordSelect(record)} />
    //     <TbListDetails size={20} title="Ver detalles" className="text-cyan-600 clickeable" onClick={()=>handleRecordSelectView(record)} />
    //     <IoIosCloseCircle size={20} title="Ver detalles" className="text-red-600 clickeable" onClick={()=>handleRecordSelectDelete(record)} />
    //     </span>
    //     </td>
    // </tr>
  ));


  return (<div>
  <div className="w-full overflow-auto">
    {listItems}
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
