'use client'

import { useEffect, useState } from "react";
import { ViewTitle } from "@/components"
import { DateRange } from "@/components/form/date-range"
import { getData, postData } from "@/services/resources";
import toast, { Toaster } from 'react-hot-toast';
import { DateTime } from 'luxon';
import { loadData } from "@/utils/functions";
import { style } from "@/theme";
import { useForm } from "react-hook-form";
import { InvoiceDocumentsElectronicTable } from "@/components/invoice-components/invoice-documents-electronic-table";
import { LinksList } from "@/components/common/links-list";
import { AddNewDownloadLink } from "@/hooks/addNewDownloadLink";


export default function Page() {
  const [documents, setDocuments] = useState([] as any);
  const [invoices, setInvoices] = useState([] as any);
  const [isSending, setIsSending] = useState(false);
  const { register, watch } = useForm();
  const [randomNumber, setRandomNumber] = useState(0);
  const { links, addLink} = AddNewDownloadLink()


  useEffect(() => {
      (async () => setInvoices(await loadData(`invoice/type/electronic`)))();
  }, []);



    const handleDocuments = async (data: any) => {
      data.invoiceId = watch("invoiceId")
      if (data.invoiceId == 2) data.invoiceId = '01';
      if (data.invoiceId == 3) data.invoiceId = '03';
      if (data.invoiceId == 4) data.invoiceId = '14';
      if (data.invoiceId == 5) data.invoiceId = '05';
        try {
          setIsSending(true);
          const response = await postData(`electronic/documents-gt`, "POST", data);
          if (!response.message) {
            toast.success("Datos obtenidos correctamente");
            setDocuments(response);
            if(response.data.length > 0) addLink(links, data, 'excel/electronic-gt/');
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
    }, [randomNumber]);

    const resendDocument = async (invoice: string) => {
      try {
        setIsSending(true);
        const response = await getData(`electronic/resend-gt/${invoice}`);
        if (response?.type == "error") {
          toast.error("Ocurrio un error");
        } else {
          toast.success("Datos obtenidos correctamente");
          setRandomNumber(Math.random());
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
        <ViewTitle text="REPORTE DOCUMENTOS EMITIDOS" />

        <InvoiceDocumentsElectronicTable records={documents} isLoading={isSending} resendDocument={resendDocument} />

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
                            <option key={value.id} value={value.type}> {value.name}</option>
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
