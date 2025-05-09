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
import { MdDeleteForever, MdDoneAll, MdFingerprint, MdOutlineDeleteSweep, MdOutlineDoneAll, MdSend } from "react-icons/md";


export default function Page() {
  const [documents, setDocuments] = useState([] as any);
  const [invoices, setInvoices] = useState([] as any);
  const [isSending, setIsSending] = useState(false);
  const { register, watch } = useForm();
  const [randomNumber, setRandomNumber] = useState(0);
  const { links, addLink} = AddNewDownloadLink()
  const [documentsUrl, setDocumentsUrl] = useState(null);
  const [documentStatus, setDocumentStatus] = useState(0);


  useEffect(() => {
      (async () => setInvoices(await loadData(`invoice/type/electronic`)))();
  }, []);



    const handleDocuments = async (data: any) => {
      data.invoiceId = watch("invoiceId")
      data.status = watch("status")
      if (data.invoiceId == 2) data.invoiceId = '01';
      if (data.invoiceId == 3) data.invoiceId = '03';
      if (data.invoiceId == 4) data.invoiceId = '14';
      if (data.invoiceId == 5) data.invoiceId = '05';
        try {
          setIsSending(true);
          setDocumentStatus(data.status);
          const response = await postData(`electronic/documents`, "POST", data);
          if (!response.message) {
            toast.success("Datos obtenidos correctamente");
            setDocuments(response);
            setDocumentsUrl(data);
            if(response.data.length > 0) addLink(links, data, 'excel/electronic/', data.invoiceId ? [{name: "invoiceId", value: data.invoiceId}] : null);
          } else {
            toast.error("Faltan algunos datos importantes!");
            setDocuments([]);
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
          await handleDocuments( documentsUrl ?? {option: "1", initialDate: `${formatedDate} 00:00:00`, status: documentStatus });
        })();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [randomNumber, documentStatus]);

    const resendDocument = async (invoice: string) => {
      try {
        setIsSending(true);
        const response = await getData(`electronic/resend/${invoice}`);
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

    const setIcon = () => {
      switch (documentStatus) {
        case 0:
          return <MdDoneAll size={32} className={`col-span-11 m-4 text-2xl text-lime-900`} />;
        case 1:
          return <MdSend size={32} className={`col-span-11 m-4 text-2xl text-sky-900`} />;
        case 2:
          return <MdFingerprint size={32} className={`col-span-11 m-4 text-2xl text-blue-900`} />;
        case 3:
          return <MdOutlineDeleteSweep size={32} className={`col-span-11 m-4 text-2xl text-red-900`} />;
        case 4:
          return <MdOutlineDoneAll size={32} className={`col-span-11 m-4 text-2xl text-lime-900`} />;
        case 5:
            return <MdDeleteForever size={32} className={`col-span-11 m-4 text-2xl text-red-900`} />;
        default:
          return <MdDoneAll size={32} className={`col-span-11 m-4 text-2xl text-sky-900`} />;
      }
    }

    const setName = () => {
      switch (documentStatus) {
        case 0:
          return "EMITIDOS";
        case 1:
          return "ENVIADOS";
        case 2:
          return "FIRMADOS";
        case 3:
          return "RECHAZADOS";
        case 4:
          return  "PROCESADOS";
        case 5:
            return  "ANULADOS";
        default:
          return "EMITIDOS";
      }
    }


  return (
    <div className="grid grid-cols-1 md:grid-cols-10 pb-10">
        <div className="col-span-7 border-r md:border-sky-600">
        <ViewTitle text={`REPORTE DOCUMENTOS ${setName()}` } />

        <InvoiceDocumentsElectronicTable records={documents} isLoading={isSending} resendDocument={resendDocument} />

        </div>
        <div className="col-span-3">
          <div className="flex justify-between">
            <ViewTitle text="SELECCIONAR FECHA" />
            { setIcon() }
          </div>
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

                <div className="w-full md:w-full px-3 mb-2">
                    <label htmlFor="status" className={style.inputLabel}> Seleccione el estado del documento </label>
                    <select defaultValue={documentStatus} id="status" {...register("status")} className={style.input}>
                        <option value="0"> Todos</option>
                        <option value="1"> Enviados</option>
                        <option value="2"> Firmados</option>
                        <option value="3"> Rechazados</option>
                        <option value="4"> Procesados</option>
                        <option value="5"> Anulados</option>
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
