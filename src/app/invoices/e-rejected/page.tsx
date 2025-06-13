'use client'

import { useEffect, useState } from "react";
import { ViewTitle } from "@/components"
import { getData } from "@/services/resources";
import toast, { Toaster } from 'react-hot-toast';
import { InvoiceDocumentsElectronicTable } from "@/components/invoice-components/invoice-documents-electronic-table";



export default function Page() {
  const [documents, setDocuments] = useState([] as any);
  const [isSending, setIsSending] = useState(false);

    const handleDocuments = async () => {
        try {
          setIsSending(true);
          const response = await getData(`electronic/rejected`);
          if (!response.message) {
            toast.success("Datos obtenidos correctamente");
            setDocuments(response);
          } else {
            toast.error("No se encontraron datos!");
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
          await handleDocuments()
        })();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const resendDocument = async (invoice: string) => {
      try {
        setIsSending(true);
        const response = await getData(`electronic/resend/${invoice}`);
        if (response?.type == "error") {
          toast.error("Ocurrio un error");
        } else {
          toast.success("Datos obtenidos correctamente");
          await handleDocuments();
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
        <ViewTitle text="REPORTE DOCUMENTOS RECHAZADOS" />

        <InvoiceDocumentsElectronicTable records={documents} isLoading={isSending} resendDocument={resendDocument} />

        </div>
        <div className="col-span-3">
        <ViewTitle text="TOTAL DE DOCUMENTOS" />
            <div className="m-5 border-2 shadow-xl rounded-md">
                <div className="m-2 grid grid-cols-6">
                    <span className="col-span-4 px-2 xl:text-xl">Total: </span>
                    <span className="col-span-2 px-2 xl:text-xl text-right">{!documents.data ? 0 : documents.data.length }</span>
                </div>
            </div>
        </div>
      <Toaster position="top-right" reverseOrder={false} />
    </div>
  )
}
