'use client'

import { useEffect, useState } from "react";
import { ViewTitle } from "@/components"
import { DateRange, DateRangeValues } from "@/components/form/date-range"
import { postData } from "@/services/resources";
import toast, { Toaster } from 'react-hot-toast';
import { DateTime } from 'luxon';
import { HistoriesCutTable } from "@/components/histories-components/histories-cut-table";
import { LinksList } from "@/components/common/links-list";
import { AddNewDownloadLink } from "@/hooks/addNewDownloadLink";
import { loadData } from "@/utils/functions";
import { useDateUrlConstructor } from "@/hooks/useDateUrlConstructor";

export default function Page() {
  const [sales, setSales] = useState([]);
  const [isSending, setIsSending] = useState(false);
  const { links, addLink} = AddNewDownloadLink()
  const { url, constructor } = useDateUrlConstructor()



  useEffect(() => {
      (async () => { 
        const actualDate = DateTime.now();
        const formatedDate = actualDate.toFormat('yyyy-MM-dd');
        await handlegetSales({option: "1", initialDate: `${formatedDate} 00:00:00`})
      })();
        // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

    const handlegetSales = async (data: DateRangeValues) => {
        try {
          setIsSending(true);
          constructor(data, 'histories/cuts')
          const response = await loadData(url);
          if (!response.message) {
            toast.success("Datos obtenidos correctamente");
            setSales(response);
            if(response.data.length > 0) addLink(links, data, 'excel/cut/');
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

  return (
    <div className="grid grid-cols-1 md:grid-cols-10 pb-10">
        <div className="col-span-7 border-r md:border-sky-600">
        <ViewTitle text="HISTORIAL DE CORTES" />

        <HistoriesCutTable records={sales} isLoading={isSending} />

        </div>
        <div className="col-span-3">
        <ViewTitle text="SELECCIONAR FECHA" />

        <DateRange onSubmit={handlegetSales} />
        <LinksList links={links} />
        </div>
      <Toaster position="top-right" reverseOrder={false} />
    </div>
  )
}
