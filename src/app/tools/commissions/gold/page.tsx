'use client'

import { useEffect, useState } from "react";
import { ViewTitle } from "@/components"
import { getData, postData } from "@/services/resources";
import toast, { Toaster } from 'react-hot-toast';
import { useSearchTerm } from "@/hooks/useSearchTerm";
import { DateRange, DateRangeValues } from "@/components/form/date-range";
import { CommissionsListGoldTable } from "@/components/tools-components/commissions-list-gold-table";

export default function Page() {
  const [commissions, setCommissions] = useState([]);
  const [isSending, setIsSending] = useState(false);
  const [randomNumber, setRandomNumber] = useState(0);

  const { searchTerm, handleSearchTerm } = useSearchTerm(["name", "id_number", "code", "phone"], 500);
  const [contacts, setContacts] = useState([]) as any;
  const [contactSelected, setContactSelected] = useState(null) as any;

  

    const createCommission = async (data: DateRangeValues) => {
      if (data.option != "2") {
        toast.error("Seleccione un rango de fechas!");
        return;
      }
      let payload = { "type" : 2, "initialDate" : data.initialDate, "finalDate" : data.finalDate, "option": data.option };
      try {
        setIsSending(true);
        const response = await postData(`tools/commissions/create/gold`, "POST", payload);
        if (response.type == "error") {
          toast.error("Faltan algunos datos importantes!");
        } else {
          setCommissions(response)
        }
      } catch (error) {
        console.error(error);
        toast.error("Ha ocurrido un error!");
      } finally {
        setIsSending(false);
      }
    }

    const handleGetSales = async () => {
        try {
          setIsSending(true);
            const response = await getData(`tools/commissions${contactSelected ? `?filterWhere[referred_id]==${contactSelected?.id}&` : `?`}filterWhere[type]==2&included=employee_deleted,referred&sort=-created_at`);
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
        (async () => await handleGetSales())();
    // eslint-disable-next-line
    }, [contactSelected, randomNumber]);
 
  
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

  return (
    <div className="grid grid-cols-1 md:grid-cols-10 pb-10">
        <div className="col-span-7 border-r md:border-sky-600">
            <ViewTitle text="REPORTE DE COMISIONES PUNTOS DE ORO" />
            <CommissionsListGoldTable records={commissions} isLoading={isSending} random={setRandomNumber}/>
        </div>
        <div className="col-span-3">
          <div className="mx-4 mt-8 ">
                    <ViewTitle text="SELECCIONAR FECHA" />
                    <DateRange onSubmit={createCommission} />
          </div> 
          
            {/* { commissions && 
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
            } */}
        </div>
      <Toaster position="top-right" reverseOrder={false} />
    </div>
  )
}
