"use client";
import { ContactAddModal } from "@/components/contacts-components/contact-add-modal";
import { ContactListTable } from "@/components/contacts-components/contact-list-table";
import { MinimalSearch } from "@/components/form/minimal-search";
import { Pagination } from "@/components/pagination";
import { usePagination } from "@/hooks/usePagination";
import { useSearchTerm } from "@/hooks/useSearchTerm";
import { loadData } from "@/utils/functions";
import { useEffect, useState } from "react";
import { DeliveryContactList } from "./delivery-contact-list-table";

export interface DeliverysLateralProps {
  isShow?: boolean;
  onClick: (option: any) => void;
}

export function DeliverysLateral(props: DeliverysLateralProps) {
    const { isShow, onClick} = props;
    const [isAdContactModal, setIsAdContactModal] = useState(false);
    const [contacts, setContacts] = useState(false);
    const {currentPage, handlePageNumber} = usePagination("&page=1");
    const [randomNumber, setRandomNumber] = useState(0);
    const { searchTerm, handleSearchTerm } = useSearchTerm(["name", "id_number"], 500);

    useEffect(() => {
        if (searchTerm) {
        (async () => setContacts(await loadData(`contacts?sort=-created_at&perPage=10${currentPage}${searchTerm}&filterWhere[status]==1&filterWhere[is_client]==1`)))();
        }
    }, [currentPage, searchTerm, randomNumber]);

      if (!isShow ) return <></>

      return (
        <div className="m-2">
                  <MinimalSearch records={contacts} handleSearchTerm={handleSearchTerm} placeholder="Buscar Contacto" statics={false} />
                  <DeliveryContactList records={contacts} random={setRandomNumber} onClick={onClick} />
                  <Pagination records={contacts} handlePageNumber={handlePageNumber} />
                  <ContactAddModal isShow={isAdContactModal} onClose={()=>setIsAdContactModal(false)} />
        </div>
  );

}
