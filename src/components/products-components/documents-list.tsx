"use client";
import { useState, useEffect } from "react";
import { getData, postData } from "@/services/resources";
import toast, { Toaster } from 'react-hot-toast';

import { Loading } from "../loading/loading";
import { ToggleSwitch } from "flowbite-react";
import { ViewTitle } from "../view-title/view-title";
import { loadData } from "@/utils/functions";

export interface DocumentsListProps {
  option: number;
  name: string;
  changes: boolean;
}

export function DocumentsList(props: DocumentsListProps) {
  const { option, name, changes } = props;
  const [isLoading, setIsLoading] = useState(false);
  const [invoiceTypes, setInvoiceTypes] = useState<any>([]);
  const [selectId, setSelectId] = useState("");
  const [selectType, setSelectType] = useState("");


  useEffect(() => {
    if (option == 5) { 
      (async () => setInvoiceTypes(await loadData(`invoice/type`)) )();
    }
    // eslint-disable-next-line
  }, [option]);

  console.log("changes: ", changes)
  
  // invoice/type/{id}

  const updateStatus = async (iden : string, status: any, type: string) => {
    setIsLoading(true)
    setSelectId(iden)
    setSelectType(type)
      try {
          const response = await postData(`invoice/type/${iden}`, 'PUT', status);
          if (response.type === "error") {
            toast.error(response.message);
          } else {
            setInvoiceTypes(response);
            toast.success("Actualizado correctamente");
          }
      } 
      catch (error) {
          console.error(error);
          toast.error("Error al actualizar!");
          }  
      finally {
        setIsLoading(false)
        setSelectId("")
        setSelectType("")
      }
  }


if (option != 5) return null

const isStatusOption = (status: number): string =>{
  if (status == 1) {
    return "Activo";
  }
  return "Inactivo";
}

const isStatus = (status: number): string =>{
  switch (status) {
    case 0: return "Inactivo";
    case 1: return "Activo";
    case 2: return "Terminado";
    case 3: return "Deshabilitado";
    default: return "Inactivo";
  }
}


const listItems = invoiceTypes?.data?.map((record: any) => (
  <tr key={record.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
    <td className="py-2 px-2">{ record?.type }</td>
    <td className="py-2 px-2 truncate uppercase">{ record?.name }</td>
    <td className="py-2 px-2">{ changes ?                    
                      <div className='col-span-2 my-2'>
                        <ToggleSwitch
                        disabled={record?.type == 0 || record?.type == 1 || record?.type == 8 || isLoading}
                        checked={record?.is_electronic}
                        label={selectId == record.id && selectType == "is_electronic" ? "Espere" : record?.is_electronic ? 'Activo' : 'Inactivo'}
                        onChange={() => updateStatus(record.id, {"is_electronic": record?.is_electronic===1?0:1}, "is_electronic")}
                      />
                  </div> : 
                  isStatusOption(record?.is_electronic) }</td>
    <td className="py-2 px-2">{ changes ?                     
                      <div className='col-span-2 my-2'>
                        <ToggleSwitch
                        disabled={isLoading}
                        checked={record?.is_printable}
                        label={selectId == record.id && selectType == "is_printable" ? "Espere" : record?.is_printable ? 'Activo' : 'Inactivo'}
                        onChange={() => updateStatus(record.id, {"is_printable": record?.is_printable===1?0:1}, "is_printable")}
                      />
                  </div> : 
                  isStatusOption(record?.is_printable) }</td>
    <td className="py-2 px-2">{ isStatus(record?.status) }</td>
  </tr>
));

  return (<>
        <ViewTitle text={name} />
        <div className="w-full p-4">
        <div className="w-full overflow-auto">
            <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                  <th scope="col" className="py-2 px-2 border">Tipo</th>
                  <th scope="col" className="py-2 px-2 border">Nombre</th>
                  <th scope="col" className="py-2 px-2 border">Electronico</th>
                  <th scope="col" className="py-2 px-2 border">Imprimible</th>
                  <th scope="col" className="py-2 px-2 border">Estado</th>
                </tr>
              </thead>
              <tbody>{listItems}</tbody>
            </table>
        </div>

      <Toaster position="top-right" reverseOrder={false} />
      </div>
  </>);
}
