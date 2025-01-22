"use client";
import { ContactAddModal } from "@/components/contacts-components/contact-add-modal";
import { ContactListTable } from "@/components/contacts-components/contact-list-table";
import { MinimalSearch } from "@/components/form/minimal-search";
import { Pagination } from "@/components/pagination";
import { usePagination } from "@/hooks/usePagination";
import { useSearchTerm } from "@/hooks/useSearchTerm";
import { loadData } from "@/utils/functions";
import Image from "next/image";
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
        if (!isAdContactModal) {
        (async () => setContacts(await loadData(`contacts?sort=-created_at&perPage=10${currentPage}${searchTerm}&filterWhere[status]==1&filterWhere[is_client]==1`)))();
        }
    }, [currentPage, searchTerm, isAdContactModal, randomNumber]);

      if (!isShow ) return <></>

      return (
        <div className="h-full">
                  <MinimalSearch records={contacts} handleSearchTerm={handleSearchTerm} placeholder="Buscar Contacto" statics={false} />
                  <DeliveryContactList records={contacts} random={setRandomNumber} onDelete={()=>{}} />
                  <Pagination records={contacts} handlePageNumber={handlePageNumber} />
                  <ContactAddModal isShow={isAdContactModal} onClose={()=>setIsAdContactModal(false)} />

            {/* <div className="flex flex-wrap justify-center mt-24">
                <div  className="m-2 clickeable"  onClick={() => onClick(1)}>
                    <div className="rounded-full drop-shadow-lg shadow-lg">
                        <Image src="/img/plus.jpg" alt="Delivery" width={146} height={146} className="rounded-full" />
                        <p className={`w-full -mt-8 content-center text-center rounded overflow-hidden uppercase text-xs text-black font-medium h-9 bg-white`} 
                        style={{ maxWidth: '146px',  wordBreak: 'keep-all', lineHeight: '1.2em' }}>
                            Agregar
                        </p>
                    </div>
                </div>
            </div> */}
        </div>
  );

}
