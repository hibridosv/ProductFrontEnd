'use client'

import { useEffect, useState } from "react";
import { ViewTitle } from "@/components"
import { DateRange } from "@/components/form/date-range"
import { getData, postData } from "@/services/resources";
import toast, { Toaster } from 'react-hot-toast';
import { DateTime } from 'luxon';
import { HistoriesByUserTable } from "@/components/histories-components/histories-by-user-table";
import { AddNewDownloadLink } from "@/hooks/addNewDownloadLink";
import { LinksList } from "@/components/common/links-list";
import { SearchInput } from "@/components/form/search";
import { useSearchTerm } from "@/hooks/useSearchTerm";
import { getRandomInt } from "@/utils/functions";
import { Button, Preset } from "@/components/button/button";


export default function Page() {
  const [sales, setSales] = useState([]);
  const [isSending, setIsSending] = useState(false);
  const { links, addLink} = AddNewDownloadLink()
  const [ randNumber, setrandNumber] = useState(0) as any;
  const { searchTerm, handleSearchTerm } = useSearchTerm(["name", "id_number"], 500);
  const [contacts, setContacts] = useState([]) as any;
  const [contactSelected, setContactSelected] = useState(null) as any;


  const loadDataContacts = async () => {
        try {
        const response = await getData(`contacts?filterWhere[is_client]==1&sort=-created_at&perPage=10${searchTerm}`);
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


    const handlegetSales = async (data: any) => {
        if (!contactSelected) {
            toast.error("Seleccione un contacto")
            return
        }
        data.clientId = contactSelected?.id
        try {
          setIsSending(true);
          const response = await postData(`histories/by-client`, "POST", data);
          if (!response.message) {
            toast.success("Datos obtenidos correctamente");
            setSales(response);
            if(response.data.length > 0) addLink(links, data, 'excel/by-client/', [{name: "clientId", value: contactSelected?.id}]);
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
        (async () => { 
        const actualDate = DateTime.now();
        const formatedDate = actualDate.toFormat('yyyy-MM-dd');
        await handlegetSales({option: "1", initialDate: `${formatedDate} 00:00:00`})
        })();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

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
        <ViewTitle text="LISTADO DE VENTAS POR CLIENTE" />

        <HistoriesByUserTable records={sales} isLoading={isSending} />

        </div>
        <div className="col-span-3">
        <ViewTitle text="SELECCIONAR FECHA" />
        <div className="mx-2">
            <SearchInput handleSearchTerm={handleSearchTerm} placeholder="Buscar Cliente" randNumber={randNumber} />
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

        <DateRange onSubmit={handlegetSales} />
        <LinksList links={links} />
        </div>
      <Toaster position="top-right" reverseOrder={false} />
    </div>
  )
}
