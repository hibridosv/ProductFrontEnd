'use client'

import { Pagination, ViewTitle } from "@/components"
import { Button, Preset } from "@/components/button/button"
import { ContactAddModal } from "@/components/contacts-components/contact-add-modal";
import { ContactListTable } from "@/components/contacts-components/contact-list-table";
import { MinimalSearch } from "@/components/form/minimal-search";
import { usePagination } from "@/hooks/usePagination";
import { useSearchTerm } from "@/hooks/useSearchTerm";
import { postData } from "@/services/resources";
import { loadData } from "@/utils/functions";
import { useEffect, useState } from "react";
import { toast, Toaster } from "react-hot-toast";

export default function Page() {
const [isAdContactModal, setIsAdContactModal] = useState(false);
const [contacts, setContacts] = useState(false);
const {currentPage, handlePageNumber} = usePagination("&page=1");
const [randomNumber, setRandomNumber] = useState(0);
const { searchTerm, handleSearchTerm } = useSearchTerm(["name", "id_number", "code"], 500);

useEffect(() => {
  if (!isAdContactModal) {
    (async () => setContacts(await loadData(`contacts?sort=-created_at&perPage=10${currentPage}${searchTerm}&filterWhere[status]==1&filterWhere[is_referred]==1`)))();
  }
}, [currentPage, searchTerm, isAdContactModal, randomNumber]);

const deleteContact = async (recordSelect: any) => {
  try {
    const response = await postData(`contacts/${recordSelect.id}`, 'DELETE');
    if (response.type === "successful") {
      toast.success( "Contacto eliminado correctamente");
      setRandomNumber(Math.random());
    } else {
      toast.error("Ha Ocurrido un Error!");
    }
  } catch (error) {
    console.error(error);
    toast.error("Ha Ocurrido un Error!");
  } 
}


  return (
    <div className="grid grid-cols-1 md:grid-cols-10 pb-10">
    <div className="col-span-7 border-r md:border-sky-600">
        <div className="flex justify-between">
          <ViewTitle text="LISTA DE CONTACTOS" />
          <span className=" m-4 text-2xl "><Button preset={Preset.add} text="AGREGAR" onClick={()=>setIsAdContactModal(true)} /></span>
        </div>

      <ContactListTable records={contacts} random={setRandomNumber} onDelete={deleteContact} />
      <Pagination records={contacts} handlePageNumber={handlePageNumber} />
    </div>
    <div className="col-span-3">
      <ViewTitle text="DETALLES" />
      <MinimalSearch records={contacts} handleSearchTerm={handleSearchTerm} placeholder="Buscar Contacto" />
    </div>
    <ContactAddModal isShow={isAdContactModal} onClose={()=>setIsAdContactModal(false)} />
    <Toaster position="top-right" reverseOrder={false} />
</div>
  )
}
