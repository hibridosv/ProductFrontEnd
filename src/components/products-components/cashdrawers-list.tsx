"use client";
import { useState, useEffect } from "react";
import { postData } from "@/services/resources";
import toast, { Toaster } from 'react-hot-toast';
import { ToggleSwitch } from "flowbite-react";
import { ViewTitle } from "../view-title/view-title";
import { loadData } from "@/utils/functions";

export interface CashDrawersListProps {
  option: number;
  name: string;
  changes: boolean;
}

export function CashDrawersList(props: CashDrawersListProps) {
    const { option, name, changes } = props;
    const [isLoading, setIsLoading] = useState(false);
    const [cashDrawers, setCashDrawers] = useState<any>([]);
    const [selectId, setSelectId] = useState("");
  
  
    useEffect(() => {
      if (option == 5) { 
        (async () => setCashDrawers(await loadData(`cashdrawers?included=employee`)) )();
      }
      // eslint-disable-next-line
    }, [option]);
  
    console.log("changes: ", changes)
    
    // invoice/type/{id}
  
    const updateStatus = async (iden : string, status: any) => {
      setIsLoading(true)
      setSelectId(iden)
        try {
            const response = await postData(`cashdrawers/${iden}`, 'PUT', status);
            if (response.type === "error") {
              toast.error(response.message);
            } else {
                setCashDrawers(response);
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
        }
    }
  
  
  if (option != 6) return null

  
  const isStatus = (status: number): React.ReactNode =>{
    switch (status) {
      case 0: return <span className="status-info uppercase">Inactivo</span>;
      case 1: return <span className="status-success uppercase">Activo</span>;
      case 2: return <span className="status-danger uppercase">Aperturada</span>;
      default: return <span className="status-info uppercase">Inactivo</span>;
    }
  }
  
  
  const listItems = cashDrawers?.data?.map((record: any) => (
    <tr key={record.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
      <td className="py-2 px-2 truncate uppercase">{ record?.name }</td>
      <td className="py-2 px-2">{ record?.employee?.name ? record?.employee?.name : "Caja no aperturada" }</td>
      <td className="py-2 px-2">{ changes && record?.status != "2" ?                    
                        <div className='col-span-2 my-2'>
                          <ToggleSwitch
                          disabled={record?.type == 0 || record?.type == 1 || record?.type == 8 || isLoading}
                          checked={record?.status}
                          label={selectId == record.id ? "Espere" : record?.status ? 'Activo' : 'Inactivo'}
                          onChange={() => updateStatus(record.id, {"status": record?.status===1?0:1})}
                        />
                    </div> : 
                    isStatus(record?.status) }</td>
    </tr>
  ));
  
    return (<>
          <ViewTitle text={name} />
          <div className="w-full p-4">
          <div className="w-full overflow-auto">
              <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                  <tr>
                    <th scope="col" className="py-2 px-2 border">Caja</th>
                    <th scope="col" className="py-2 px-2 border">Apertura</th>
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
  