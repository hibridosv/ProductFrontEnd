'use client'

import {  useContext, useState } from "react";
import { Alert, Loading, NothingHere, ProductsTable, ViewTitle } from "@/components"
import {  postDataFile } from "@/services/resources";
import toast, { Toaster } from 'react-hot-toast';
import { useForm } from "react-hook-form";
import { style } from "@/theme";
import { Button, Preset } from "@/components/button/button";
import { ConfigContext } from "@/contexts/config-context";
import { RowTable } from "@/components/products-components/products-table";
import { PresetTheme } from "@/services/enums";
import { ContactListTable } from "@/components/contacts-components/contact-list-table";

export default function Page() {
  const [isSending, setIsSending] = useState(false);
  const { register, handleSubmit, reset } = useForm();
  const [ uploads, setUploads ] = useState([] as any);
  const { systemInformation } = useContext(ConfigContext);


  const onSubmit = async (data: any) => {
    data.user = systemInformation?.user?.id;
    try {
      setIsSending(true)
      setUploads([])
      const response = await postDataFile("imports/clients", "POST", data);
      if (response.type == "error") {
        toast.error(response.message);
      } else {
        toast.success("Clientes Insertados correctamente");
        setUploads(response)
        reset();
      }
    } catch (error) {
      console.error(error);
      toast.error("Ha ocurrido un error!");
    } finally {
      setIsSending(false)
    }
  };


  return (
    <div className="grid grid-cols-1 md:grid-cols-10 pb-10">
        <div className={`col-span-7 border-r md:border-sky-600`}>
          <ViewTitle text="IMPORTAR CLIENTES" />
          {
            isSending &&
            <Alert info="Importante" theme={PresetTheme.danger} text="En este momento se estan importanto los clientes, por favor no salga de esta pagina y espere que el proceso haya finalizado, es probable que esto tarde unos pocos minutos"  isDismisible={false} className="m-4"  />
          }
          {
           !isSending && !uploads?.data &&
            <div>
              <NothingHere text="No se encuentran clientes ingresados en este momento"/> 
              <Alert info="Importante" theme={PresetTheme.info} text="La importación de clientes debe ser desde un documento de Excel y debe llevar el formato correcto, de lo contrario fallará o la información no se agregaran los clientes correctamente" isDismisible={false} className="m-4" />
            </div>
          }

          {
          uploads?.data && uploads.data.length > 0 &&
          <div>
            <Alert info="Clientes Importados" theme={PresetTheme.info} text="Al salir de esta pagina o refrescarla los clientes ya no seran visibles en esta pagina" isDismisible={false} className="m-4" />
            <ContactListTable records={uploads} random={console.log} onDelete={()=>{}} />
          </div>
          }

{
          uploads?.data && uploads.data.length === 0 &&
            <Alert info="Clientes Importados" theme={PresetTheme.info} text="La importacion finalizo pero sin nuevos clientes agregados, es posible que estos clientes ya esten registrados en su sistema, por favor revise su inventario" isDismisible={false} className="m-4" />
          }

        </div>
        <div className={`col-span-3`}>
        <ViewTitle text={`AGREGAR ARCHIVO`} />
          <div className="m-3">
            { isSending ? <Loading text="Importando clientes" /> :
            <form className="max-w-lg" onSubmit={handleSubmit(onSubmit)} >
                <div className="mb-4">
                  <label htmlFor="file" className="block text-lg font-medium text-gray-700">
                    Documento Excel
                  </label>
                  <input
                    type="file"
                    accept=".xlsx"
                    id="file"
                    {...register("file")}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </div>
                <div className="w-full md:w-full px-3 mb-4">
                      <label htmlFor="description" className={style.inputLabel} >Información </label>
                      <textarea {...register("description", {})} rows={2} className={`${style.input} w-full`} />
                      </div>
        
                      <div className="flex justify-center">
                      <Button type="submit" disabled={isSending} preset={isSending ? Preset.saving : Preset.save} text="Subir Archivo" />
                      </div>
              </form>
            }
          </div>


        </div>
      <Toaster position="top-right" reverseOrder={false} />
    </div>
  )
}
