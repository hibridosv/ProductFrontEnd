'use client'
import { useState } from "react";
import { Toaster } from "react-hot-toast";
import { NothingHere } from "@/components/nothing-here/nothing-here";
import { ContactAddModal } from "@/components/contacts-components/contact-add-modal";
import { ContactViewModal } from "@/components/contacts-components/contact-view-modal";
import { GoEye } from "react-icons/go";
import { BiEdit } from "react-icons/bi";

interface DeliveryContactListProps {
  records?:  any;
  random: (value: number) => void;
  onClick: (option: any) => void;
}

export function DeliveryContactList(props: DeliveryContactListProps) {
  const { records, random, onClick } = props;
  const [isAdContactModal, setIsAdContactModal] = useState(false);
  const [isAdContactViewModal, setIsAdContactViewModal] = useState(false);
  const [recordSelect, setRecordSelect] = useState<any>(null);

  if (!records.data) return <NothingHere width="70" height="50" text="Sin contactos" />;
  if (records.data.length == 0) return <NothingHere text="No se encontraron datos" width="70" height="50" />;

  const handleRecordSelect = (record: any) => {
    setRecordSelect(record);
    setIsAdContactModal(true);
  }
  
  const handleRecordSelectView = (record: any) => {
    setRecordSelect(record);
    setIsAdContactViewModal(true);
  }


  const listItems = records.data.map((record: any) => (
    <div className="w-full bg-teal-50 px-2 clickeable" key={record.id} onClick={()=>onClick(record)}>
        <div className="border rounded-sm shadow-md">
        <div className="mx-4 font-bold flex" title="Ver información" ><GoEye className="mt-1 mr-2 clickeable" color="green" onClick={()=>handleRecordSelectView(record)} /> { record?.name }</div>
        <div className="flex justify-between mx-4">
            <div><span className=" font-medium">Dirección: </span>{ record?.address }</div>
            <div className="flex"><span className="font-medium mr-1">Telefono: </span> { record?.phone }<BiEdit onClick={()=>handleRecordSelect(record)} className="clickeable mt-1 ml-2 " color="green" /></div>
        </div>
        </div>
    </div>
  ));


  return (<div>
  <div className="w-full overflow-auto">
    {listItems}
    <ContactAddModal isShow={isAdContactModal} onClose={()=>setIsAdContactModal(false)} record={recordSelect} random={random} />
    <ContactViewModal isShow={isAdContactViewModal} onClose={()=>setIsAdContactViewModal(false)} record={recordSelect} />
    <Toaster position="top-right" reverseOrder={false} />
 </div>
 </div>);
}
