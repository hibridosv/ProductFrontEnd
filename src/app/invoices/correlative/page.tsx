'use client'

import { useEffect, useState } from "react";
import { ViewTitle } from "@/components"
import { postData } from "@/services/resources";
import toast, { Toaster } from 'react-hot-toast';
import { loadData } from "@/utils/functions";
import { style } from "@/theme";
import { useForm } from "react-hook-form";
import { AddNewDownloadLink } from "@/hooks/addNewDownloadLink";
import { LinksList } from "@/components/common/links-list";
import { InvoiceCorrelativeTable } from "@/components/invoice-components/invoice-correlative-table";
import { Button, Preset } from "@/components/button/button";

interface Year {
    id: number;
    name: string;
  }

  
export default function Page() {
  const [documents, setDocuments] = useState([]);
  const [invoiceId, setinvoiceId] = useState("");
  const [invoices, setInvoices] = useState([] as any);
  const [isSending, setIsSending] = useState(false);
  const [years, setYears] = useState<Year[]>([]);
  const { register, handleSubmit } = useForm();
  const { links, addLink } = AddNewDownloadLink()

  const months = [
    {id: 1, name: "Enero"},
    {id: 2, name: "Febrero"},
    {id: 3, name: "Marzo"},
    {id: 4, name: "Abril"},
    {id: 5, name: "Mayo"},
    {id: 6, name: "Junio"},
    {id: 7, name: "Julio"},
    {id: 8, name: "Agosto"},
    {id: 9, name: "Septiembre"},
    {id: 10, name: "Octubre"},
    {id: 11, name: "Noviembre"},
    {id: 12, name: "Diciembre"},
]
const currentYear = new Date().getFullYear();
const currentMonth = new Date().getMonth() + 1; 

  useEffect(() => {
      (async () => setInvoices(await loadData(`invoice/type/active`)))();
  }, []);

  useEffect(() => {
    function getYearsFrom2022() {
      const currentYear = new Date().getFullYear();
      const years = [];
      for (let year = 2022; year <= currentYear; year++) {
        years.push({ id: year, name: year.toString() });
      }
      return years;
    }

    // Actualizar el estado con los años
    setYears(getYearsFrom2022());
  }, []);

    const onSubmit = async (data: any) => {
        if (!data.invoiceId) {
            toast.error("Seleccione el tipo de documento");
            return;
        }
        try {
          setIsSending(true);
          const response = await postData(`invoices/correlatives`, "POST", data);
          if (!response.message) {
            toast.success("Datos obtenidos correctamente");
            setDocuments(response);
            if(response.data.length > 0){
                addLink(links, data, 'excel/invoices/correlatives/', [{name: "invoiceId", value: data.invoiceId}, {name: "year", value: data.year}, {name: "month", value: data.month}], 2, "Descargar Excel");
                addLink(links, data, 'pdf/invoices/correlatives/', [{name: "invoiceId", value: data.invoiceId}, {name: "year", value: data.year}, {name: "month", value: data.month}], 2, "Descargar PDF");
                setinvoiceId(data.invoiceId)
            } 
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
        <ViewTitle text="REPORTE DE CORRELATIVO DE DOCUMENTOS" />

        <InvoiceCorrelativeTable records={documents} isLoading={isSending} invoiceId={invoiceId} />

        </div>
        <div className="col-span-3">
        <ViewTitle text="SELECCIONAR FECHA" />
          <div className="flex flex-wrap p-4 m-4 shadow-lg border-2 rounded-md mb-8">
          <form onSubmit={handleSubmit(onSubmit)} className="w-full">
          <div className="flex flex-wrap -mx-3 mb-6">
              <div className="w-full md:w-full px-3 mb-2">
                    <label htmlFor="invoiceId" className={style.inputLabel}> Seleccione el tipo de documento </label>
                    <select defaultValue={1} id="invoiceId" {...register("invoiceId")} className={style.input}>
                        <option value=""> Seleccione</option>
                        {invoices?.data?.map((value: any) => {
                          return (
                            <option key={value.id} value={value.id}> {value.name}</option>
                          );
                        })}
                    </select>
                </div>

                <div className="w-full md:w-1/2 px-3 mb-2">
                    <label htmlFor="month" className={style.inputLabel}> Mes </label>
                    <select defaultValue={currentMonth} id="month" {...register("month")} className={style.input}>
                        {months?.map((value: any) => {
                          return (
                            <option key={value.id} value={value.id}> {value.name}</option>
                          );
                        })}
                    </select>
                </div>

                <div className="w-full md:w-1/2 px-3 mb-2">
                    <label htmlFor="year" className={style.inputLabel}> Año </label>
                    {years.length > 0 ?
                    <select defaultValue={currentYear} id="year" {...register("year")} className={style.input}>
                        { years?.map((value: any) => {
                          return (
                            <option key={value.id} value={value.id}> {value.name}</option>
                          );
                        })}
                    </select>
                    : <div className={style.input}>Cargando ...</div>
                    }
                </div>

            
                </div>

                
                <div className="flex justify-center mb-2">
                    <Button type="submit" disabled={isSending} preset={isSending ? Preset.saving : Preset.save} />
                </div>
                
                </form>
            </div>


        <LinksList links={links} text="DESCARGAR DOCUMENTOS" />
        </div>
      <Toaster position="top-right" reverseOrder={false} />
    </div>
  )
}
