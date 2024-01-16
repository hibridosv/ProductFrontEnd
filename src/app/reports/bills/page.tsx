'use client'

import { useEffect, useState } from "react";
import { ViewTitle } from "@/components"
import { DateRange, DateRangeValues } from "@/components/form/date-range"
import { postData } from "@/services/resources";
import toast, { Toaster } from 'react-hot-toast';
import { DateTime } from 'luxon';
import { ReportsBillsTable } from "@/components/reports-components/reports-bills-table";

export default function Page() {
  const [products, setProducts] = useState([]);
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
      (async () => { 
        const actualDate = DateTime.now();
        const formatedDate = actualDate.toFormat('yyyy-MM-dd');
        await handlegetSales({option: "1", initialDate: `${formatedDate} 00:00:00`})
      })();
  }, []);

    const handlegetSales = async (data: DateRangeValues) => {
        try {
          setIsSending(true);
          const response = await postData(`reports/bills`, "POST", data);
          if (!response.message) {
            toast.success("Datos obtenidos correctamente");
            setProducts(response);
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

 console.log(products);

  return (
    <div className="grid grid-cols-1 md:grid-cols-10 pb-10">
        <div className="col-span-7 border-r md:border-sky-600">
        <ViewTitle text="DETALLE DE GASTOS" />

        <ReportsBillsTable records={products} isLoading={isSending} />

        </div>
        <div className="col-span-3">
        <ViewTitle text="SELECCIONAR FECHA" />

        <DateRange onSubmit={handlegetSales} />
        </div>
      <Toaster position="top-right" reverseOrder={false} />
    </div>
  )
}
