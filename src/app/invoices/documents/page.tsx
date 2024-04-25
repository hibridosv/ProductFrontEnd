'use client'

import { useEffect, useState } from "react";
import { ViewTitle } from "@/components"
import { DateRange } from "@/components/form/date-range"
import { postData } from "@/services/resources";
import toast, { Toaster } from 'react-hot-toast';
import { DateTime } from 'luxon';
import { loadData } from "@/utils/functions";
import { style } from "@/theme";
import { useForm } from "react-hook-form";
import { InvoiceDocumentsTable } from "@/components/invoice-components/invoice-documents-table";
import { AddNewDownloadLink } from "@/hooks/addNewDownloadLink";
import { LinksList } from "@/components/common/links-list";

export default function Page() {
  const [documents, setDocuments] = useState([]);
  const [invoices, setInvoices] = useState([] as any);
  const [isSending, setIsSending] = useState(false);
  const { register, watch } = useForm();
  const { links, addLink} = AddNewDownloadLink()


  useEffect(() => {
      (async () => setInvoices(await loadData(`invoice/type/active`)))();
  }, []);



    const handleDocuments = async (data: any) => {
      data.invoiceId = watch("invoiceId")
        try {
          setIsSending(true);
          const response = await postData(`invoices/documents`, "POST", data);
          if (!response.message) {
            toast.success("Datos obtenidos correctamente");
            setDocuments(response);
            if(response.data.length > 0) addLink(links, data, 'excel/invoices/documents/', [{name: "invoiceId", value: data.invoiceId}]);
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
          await handleDocuments({option: "1", initialDate: `${formatedDate} 00:00:00`})
        })();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-10 pb-10">
        <div className="col-span-7 border-r md:border-sky-600">
        <ViewTitle text="REPORTE DOCUMENTOS EMITIDOS" />

        <InvoiceDocumentsTable records={documents} isLoading={isSending} />

        </div>
        <div className="col-span-3">
        <ViewTitle text="SELECCIONAR FECHA" />
          <div className="flex flex-wrap m-4 shadow-lg border-2 rounded-md mb-8">
              <div className="w-full md:w-full px-3 mb-2">
                    <label htmlFor="invoiceId" className={style.inputLabel}> Seleccione el tipo de documento </label>
                    <select defaultValue={1} id="invoiceId" {...register("invoiceId")} className={style.input}>
                        <option value=""> Mostrar todo</option>
                        {invoices?.data?.map((value: any) => {
                          return (
                            <option key={value.id} value={value.id}> {value.name}</option>
                          );
                        })}
                    </select>
                </div>
            </div>

        <DateRange onSubmit={handleDocuments} />
        <LinksList links={links} />
        </div>
      <Toaster position="top-right" reverseOrder={false} />
    </div>
  )
}
