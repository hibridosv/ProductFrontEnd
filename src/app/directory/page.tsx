'use client'

import { Pagination, ViewTitle } from "@/components"
import { Button, Preset } from "@/components/button/button"
import { ContactAddModal } from "@/components/contacts-components/contact-add-modal";
import { ContactListTable } from "@/components/contacts-components/contact-list-table";
import { usePagination } from "@/hooks/usePagination";
import { loadData } from "@/utils/functions";
import { useEffect, useState } from "react";

export default function Page() {
const [isAdContactModal, setIsAdContactModal] = useState(false);
const [contacts, setContacts] = useState(false);
const {currentPage, handlePageNumber} = usePagination("&page=1");
const [randomNumber, setRandomNumber] = useState(0);


useEffect(() => {
  if (!isAdContactModal) {
    (async () => setContacts(await loadData(`contacts?sort=-created_at&perPage=10${currentPage}`)))();
  }
}, [isAdContactModal, randomNumber]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-10 pb-10">
    <div className="col-span-7 border-r md:border-sky-600">
        <div className="flex justify-between">
          <ViewTitle text="LISTADO DE CLIENTES" />
          <span className=" m-4 text-2xl "><Button preset={Preset.add} text="AGREGAR" onClick={()=>setIsAdContactModal(true)} /></span>
        </div>

      <ContactListTable records={contacts} random={setRandomNumber} />
      <Pagination records={contacts} handlePageNumber={handlePageNumber} />
    </div>
    <div className="col-span-3">
      <ViewTitle text="DETALLES" />
    </div>
    <ContactAddModal isShow={isAdContactModal} onClose={()=>setIsAdContactModal(false)} />
</div>
  )
}
