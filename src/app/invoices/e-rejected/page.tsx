'use client'

import { useEffect, useState } from "react";
import { ViewTitle } from "@/components"
import { getData } from "@/services/resources";
import toast, { Toaster } from 'react-hot-toast';
import { InvoiceDocumentsElectronicTable } from "@/components/invoice-components/invoice-documents-electronic-table";



export default function Page() {
  const [documents, setDocuments] = useState([] as any);
  const [isSending, setIsSending] = useState(false);
  const [randomNumber, setRandomNumber] = useState(0);

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
    }, [randomNumber]);

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


  return (
    <div className="grid grid-cols-1 md:grid-cols-10 pb-10">
        <div className="col-span-7 border-r md:border-sky-600">
        <ViewTitle text="REPORTE DOCUMENTOS RECHAZADOS" />

        <InvoiceDocumentsElectronicTable records={documents} isLoading={isSending} resendDocument={resendDocument} />

        </div>
        <div className="col-span-3">
        {/* <ViewTitle text="SELECCIONAR FECHA" /> */}
        </div>
      <Toaster position="top-right" reverseOrder={false} />
    </div>
  )
}
