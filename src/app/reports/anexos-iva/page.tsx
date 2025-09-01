'use client'

import { useEffect, useState } from "react";
import { Alert, ViewTitle } from "@/components"
import { DateRange } from "@/components/form/date-range"
import toast, { Toaster } from 'react-hot-toast';
import { loadData } from "@/utils/functions";
import { style } from "@/theme";
import { useForm } from "react-hook-form";
import { LinksList } from "@/components/common/links-list";
import { AddNewDownloadLink } from "@/hooks/addNewDownloadLink";
import { PresetTheme } from "@/services/enums";
import { API_URL } from "@/constants";


export default function Page() {
  const [downloads, setDownloads] = useState([] as any);
  const { register, watch } = useForm();
  const { links, addLink} = AddNewDownloadLink()
  const [documentsUrl, setDocumentsUrl] = useState(null);
  const [documentStatus, setDocumentStatus] = useState(0);



  useEffect(() => {
      (async () => setDownloads(await loadData(`document/download`)))();
  }, []);

    const handleDocuments = async (data: any) => {
      data.sucursal = watch("sucursal")
      data.anexo = watch("anexo")
        try {
          setDocumentStatus(data.status);
            toast.success("Datos obtenidos correctamente");
            setDocumentsUrl(data);
            addLink(links, data, 'excel/electronic/', data.anexo ? [{name: "anexo", value: data.anexo } , { name: "sucursal", value: data.sucursal }] : null);
        } catch (error) {
          toast.error("Ha ocurrido un error!");
        }
      };

  return (
    <div className="grid grid-cols-1 md:grid-cols-10 pb-10">
        <div className="col-span-7 border-r md:border-sky-600">
        <ViewTitle text="REPORTES DE ANEXOS DE IVA Y DESCARGAS" />
          <Alert theme={PresetTheme.info} isDismisible={false} text="Descarga de documentos PDF y JSON en formato .zip" className="m-4" />

          <div className="m-4 p-4 border-2 rounded-md">
            <div className="uppercase flex justify-center font-bold">Documentos disponibles:</div>
            {
              downloads.data && downloads.data.length > 0 ?
              
              <ul className="mt-4 border-t border-teal-700" >
                {downloads.data.map((download: any) => (
                    <a href={`${API_URL}zip/download/${download?.id}`} target="_blank" title="Descargar" key={download?.id}>
                    <li className="flex justify-between p-3 hover:bg-blue-200 hover:text-blue-800">
                        {download.comments}
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24"
                            stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                    </li>
                    </a>
                ))}
              </ul> 
              :
              <p>No hay documentos disponibles para descargar.</p>
            }
            </div>
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
                <div className="w-full md:w-full px-3 mb-2">
                    <label htmlFor="sucursal" className={style.inputLabel}> Seleccione </label>
                    <select defaultValue={documentStatus} id="sucursal" {...register("sucursal")} className={style.input}>
                        <option value="0"> Esta Sucursal</option>
                        <option value="1"> Todas Las Sucursales</option>
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
