'use client'

import { useEffect, useState } from "react";
import { ViewTitle } from "@/components"
import { getData, postData } from "@/services/resources";
import toast, { Toaster } from 'react-hot-toast';
import { getRandomInt } from "@/utils/functions";
import { CommissionsListTable } from "@/components/tools-components/commissions-list-table";
import { Button, Preset } from "@/components/button/button";
import { CommissionAddModal } from "@/components/tools-components/commission-add-modal";
import { SearchInput } from "@/components/form/search";
import { useSearchTerm } from "@/hooks/useSearchTerm";

export default function Page() {
  const [commissions, setCommissions] = useState([]);
  const [isAddCommissionModal, setIsAddCommissionModal] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [randomNumber, setRandomNumber] = useState(0);

  const [ randNumber, setrandNumber] = useState(0) as any;
  const { searchTerm, handleSearchTerm } = useSearchTerm(["name", "id_number"], 500);
  const [contacts, setContacts] = useState([]) as any;
  const [contactSelected, setContactSelected] = useState(null) as any;



    const handlegetSales = async () => {
        let userId = contactSelected?.id
        try {
          setIsSending(true);
          const response = await postData(`tools/commissions`, "POST", {userId});
          if (!response.message) {
            setCommissions(response);
            toast.success("Datos obtenidos correctamente");
          } else {
            toast.error("Faltan algunos datos importantes!");
          }
        } catch (error) {
          console.error(error);
          toast.error("Ha ocurrido un error!");
        } finally {
          setIsSending(false);
        }
    };

    useEffect(() => {
      if (!isAddCommissionModal) {
        (async () => await handlegetSales())();
      }
    // eslint-disable-next-line
    }, [isAddCommissionModal, contactSelected, randomNumber]);
 

  const handleCancelContact = () => {
      setContactSelected(null)
      setrandNumber(getRandomInt(100));
      setContacts([])
  }
  const handleSelectContact = (contact: any) => {
      setContactSelected(contact)
      setrandNumber(getRandomInt(100));
      setContacts([])
  }

  const loadDataContacts = async () => {
    try {
    const response = await getData(`contacts?filterWhere[is_referred]==1&sort=-created_at&perPage=10${searchTerm}`);
    setContacts(response.data);
    } catch (error) {
    console.error(error);
    }
};

  useEffect(() => {
      if (searchTerm) {
          (async () => { await loadDataContacts();})();   
      }
      if (searchTerm == "") {
          setContacts([]);
      }
      // eslint-disable-next-line
  }, [searchTerm]);

    const listItems = contacts?.map((contact: any):any => (
      <div key={contact.id} onClick={()=>handleSelectContact(contact)}>
          <li className="flex justify-between p-3 hover:bg-blue-200 hover:text-blue-800 cursor-pointer">
                {contact.name} | {contact.id_number ? contact.id_number : ""}
              <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24"
                  stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
          </li>
      </div>
  ))

  return (
    <div className="grid grid-cols-1 md:grid-cols-10 pb-10">
        <div className="col-span-7 border-r md:border-sky-600">
            <div className="flex justify-between">
            <ViewTitle text="REPORTE DE COMISIONES POR CLIENTE" />
              <span className=" m-4 text-2xl "><Button preset={Preset.add} text="AGREGAR" onClick={()=>setIsAddCommissionModal(true)} /></span>
            </div>
            <CommissionsListTable records={commissions} isLoading={isSending} random={setRandomNumber}/>
        </div>
        <div className="col-span-3">
        <ViewTitle text="SELECCIONAR CLIENTE" />
        <div className="mx-2">
              <SearchInput handleSearchTerm={handleSearchTerm} placeholder="Buscar cliente" randNumber={randNumber} />
              <div className="w-full bg-white rounded-lg shadow-lg mt-4">
                  <ul className="divide-y-2 divide-gray-400">
                  { listItems }
                  { contacts && contacts.length > 0 && 
                          <li className="flex justify-between p-3 hover:bg-red-200 hover:text-red-800 cursor-pointer" onClick={handleCancelContact}>
                              CANCELAR
                              <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24"
                                  stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                              </svg>
                          </li> }
                  </ul>
              </div>
              { contactSelected &&
              <div className="flex justify-between px-2 mb-3 uppercase text-lg font-semibold shadow-md rounded-md">
                  <span>{ contactSelected?.name }</span> 
                  <span className="text-right"><Button noText preset={Preset.smallClose} onClick={handleCancelContact} /></span>
              </div> }
          </div>

        </div>
        <CommissionAddModal isShow={isAddCommissionModal} onClose={()=>setIsAddCommissionModal(false)} />
      <Toaster position="top-right" reverseOrder={false} />
    </div>
  )
}
