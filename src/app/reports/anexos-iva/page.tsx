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
import { LinksList } from "@/components/common/links-list";
import { AddNewDownloadLink } from "@/hooks/addNewDownloadLink";


export default function Page() {
  const [documents, setDocuments] = useState([] as any);
  const [invoices, setInvoices] = useState([] as any);
  const [isSending, setIsSending] = useState(false);
  const { register, watch } = useForm();
  const { links, addLink} = AddNewDownloadLink()
  const [documentsUrl, setDocumentsUrl] = useState(null);
  const [documentStatus, setDocumentStatus] = useState(0);


  useEffect(() => {
      (async () => setInvoices(await loadData(`invoice/type/electronic`)))();
  }, []);



    const handleDocuments = async (data: any) => {
      data.invoiceId = watch("invoiceId")
      data.anexo = watch("anexo")
    
        try {
          setIsSending(true);
          setDocumentStatus(data.status);
          const response = await postData(`electronic/documents`, "POST", data);
          if (!response.message) {
            toast.success("Datos obtenidos correctamente");
            setDocuments(response);
            setDocumentsUrl(data);
            addLink(links, data, 'excel/electronic/', data.anexo ? [{name: "anexo", value: data.anexo}] : null);
          } else {
            toast.error("No se encontraron datos!");
            setDocuments([]);
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
        <ViewTitle text={`REPORTES DE ANEXOS DE IVA` } />

        </div>
        <div className="col-span-3">
          <div className="flex justify-between">
            <ViewTitle text="SELECCIONAR ANEXO" />
          </div>
          <div className="flex flex-wrap m-4 shadow-lg border-2 rounded-md mb-8">
                <div className="w-full md:w-full px-3 mb-2">
                    <label htmlFor="anexo" className={style.inputLabel}> Seleccione el Anexo a generar </label>
                    <select defaultValue={documentStatus} id="anexo" {...register("anexo")} className={style.input}>
                        <option value="0"> Seleccionar</option>
                        <option value="1"> Ventas a Consumidor Final</option>
                        <option value="2"> Ventas a Contribuyentes</option>
                        <option value="3"> Documentos Anulados</option>
                        <option value="14"> Compras a Sujetos Excluidos</option>
                    </select>
                </div>
            </div>
            < div className="flex justify-between">
                  <ViewTitle text="SELECCIONAR FECHA" />
            </div>
        <DateRange onSubmit={handleDocuments} />
        <LinksList links={links} />
        </div>
      <Toaster position="top-right" reverseOrder={false} />
    </div>
  )
}
