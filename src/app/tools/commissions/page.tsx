'use client'

import { useEffect, useState } from "react";
import { ViewTitle } from "@/components"
import { getData, postData } from "@/services/resources";
import toast, { Toaster } from 'react-hot-toast';
import { getRandomInt } from "@/utils/functions";
import { CommissionsListTable } from "@/components/tools-components/commissions-list-table";
import { Button, Preset } from "@/components/button/button";
import { SearchInput } from "@/components/form/search";
import { useSearchTerm } from "@/hooks/useSearchTerm";
import { CommissionsProductsTable } from "@/components/tools-components/commissions-products-table";
import { CreditsShowTotal } from "@/components/credits-components/credits-show-total";
import { ButtonDownload } from "@/components/button/button-download";
import { FaDownload } from "react-icons/fa";

export default function Page() {
  const [commissions, setCommissions] = useState([]);
  const [initialCommission, setInitialCommission] = useState(null as any);
  const [isSending, setIsSending] = useState(false);
  const [randomNumber, setRandomNumber] = useState(0);

  const [ randNumber, setrandNumber] = useState(0) as any;
  const { searchTerm, handleSearchTerm } = useSearchTerm(["name", "id_number"], 500);
  const [contacts, setContacts] = useState([]) as any;
  const [contactSelected, setContactSelected] = useState(null) as any;
  const [products, setProducts] = useState(0) as any;

  

    const createCommission = async () => {
      try {
        setIsSending(true);
        const response = await postData(`tools/commissions/create`, "POST", { "userId" : contactSelected?.id, "type" : 1 });
        if (!response.message) {
          setInitialCommission(response)
        } else {
          toast.error("Faltan algunos datos importantes!");
        }
      } catch (error) {
        console.error(error);
        toast.error("Ha ocurrido un error!");
      } finally {
        setIsSending(false);
      }
    }

    const cancelCommission = async () => {
      try {
        setIsSending(true);
        const response = await postData(`tools/commissions/cancel/${initialCommission?.data?.id}`, "PUT", { "userId" : initialCommission?.data?.referred_id });
        if (response.type == "successful") {
          setInitialCommission(null)
        } else {
          toast.error("Error al cancelar!");
        }
      } catch (error) {
        console.error(error);
        toast.error("Ha ocurrido un error!");
      } finally {
        setIsSending(false);
        setContactSelected(null)
        setrandNumber(getRandomInt(100));
        setContacts([])
      }
    }

    const saveCommission = async () => {
      try {
        setIsSending(true);
        const response = await postData(`tools/commissions/save/${initialCommission?.data?.id}`, "PUT", { "userId" : initialCommission?.data?.referred_id });
        if (response.type == "successful") {
          setInitialCommission(null)
        } else {
          toast.error("Error al guardar!");
        }
      } catch (error) {
        console.error(error);
        toast.error("Ha ocurrido un error!");
      } finally {
        setIsSending(false);
        setContactSelected(null)
        setrandNumber(getRandomInt(100));
        setContacts([])
      }
    }


    const handleGetSales = async () => {
        try {
          setIsSending(true);
          const active = await  await getData(`tools/commissions/active`);
          if (!active.message) {
            setInitialCommission(active)
          } else {
            const response = await getData(`tools/commissions${contactSelected ? `?filterWhere[referred_id]==${contactSelected?.id}&` : `?`}included=employee_deleted,referred,linked.product.order&sort=-created_at`);
            if (!response.message) {
              setCommissions(response);
              toast.success("Datos obtenidos correctamente");
            } else {
              toast.error("Faltan algunos datos importantes!");
            }
          }
        } catch (error) {
          console.error(error);
          toast.error("Ha ocurrido un error!");
        } finally {
          setIsSending(false);
        }
    };

    useEffect(() => {
        (async () => await handleGetSales())();
    // eslint-disable-next-line
    }, [contactSelected, randomNumber]);
 
  
  const handleCancelContact = () => {
      setContactSelected(null)
      setrandNumber(getRandomInt(100));
      setContacts([])
  }
  const handleCancelSelect = () => {
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
    const response = await getData(`contacts?filterWhere[is_referred]==1&filterWhere[status]==1&sort=-created_at&perPage=10${searchTerm}`);
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
            <ViewTitle text={initialCommission ? "FACTURAS PENDIENTES DE PAGAR" : "REPORTE DE COMISIONES POR CLIENTE"} />

            { initialCommission ?
            <CommissionsProductsTable record={initialCommission} setProducts={setProducts} /> :
            <CommissionsListTable records={commissions} isLoading={isSending} random={setRandomNumber}/>
            }
        </div>
        <div className="col-span-3">
        <ViewTitle text={initialCommission ? "NUEVA COMISION" : "BUSCAR CLIENTE"} />
        
        { initialCommission ? 
        <div>
          <CreditsShowTotal quantity={products} text="Facturas seleccionadas" number />
          <div className="mx-4 mt-8 flex">
            <Button text="Cancelar" isFull={products == 0} style="mx-2" preset={Preset.cancel} onClick={cancelCommission} />
            { products > 0 && <Button text="Guardar" style="mx-2" isFull preset={Preset.save} onClick={saveCommission} /> }
          </div>
        </div> 
        :
        <div className="mx-2">
              <SearchInput handleSearchTerm={handleSearchTerm} placeholder="Buscar cliente" randNumber={randNumber} />
              <div className="w-full bg-white rounded-lg shadow-lg mt-4">
                  <ul className="divide-y-2 divide-gray-400">
                  { listItems }
                  { contacts && contacts.length > 0 && 
                          <li className="flex justify-between p-3 hover:bg-red-200 hover:text-red-800 cursor-pointer" onClick={handleCancelSelect}>
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
          }
          { contactSelected && !initialCommission && 
          <div className="mx-4 mt-8 ">
            <Button disabled={!contactSelected || isSending || initialCommission} isFull preset={Preset.primary} style="mx-2" text="AGREGAR" onClick={()=>createCommission()} />
          </div> 
          }

            {/* <ButtonDownload href={`/download/pdf/failure/`}><FaDownload size={24}/></ButtonDownload> */}
            { commissions && 
            <div className='mt-4 border-t border-teal-700'>
                <div className="uppercase flex justify-center font-bold">Descargar</div>
                <ButtonDownload 
                  href={`/download/excel/commissions/report/${contactSelected ? `?filterWhere[referred_id]==${contactSelected?.id}&` : `?`}included=employee_deleted,referred,linked.product.order&sort=-created_at`}
                  autoclass={false}
                  divider="&">
                            <li className="flex justify-between p-3 hover:bg-blue-200 hover:text-blue-800 cursor-pointer">
                                DESCARGAR REPORTE EXCEL
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24"
                                    stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                </svg>
                            </li>
                </ButtonDownload>

            </div>
            }
        </div>
      <Toaster position="top-right" reverseOrder={false} />
    </div>
  )
}
