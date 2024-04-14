'use client'
import { getPaymentTypeName, getTotalOfItem, numberToMoney } from "@/utils/functions";
import { NothingHere } from "../nothing-here/nothing-here";
import { Loading } from "../loading/loading";
import { formatDate, formatHourAsHM } from "@/utils/date-formats";
import { useState } from "react";
import { Button, Preset } from "../button/button";
import toast, { Toaster } from 'react-hot-toast';
import { postData } from "@/services/resources";
import { AdjustmentUpdateModal } from "./adjustment-update-modal";


interface AdjustmentTableProps {
  records?:  any;
  isLoading?: boolean;
  random?: (value: number) => void;
}

export function AdjustmentTable(props: AdjustmentTableProps) {
  const { records, isLoading, random } = props;
  const [isSending, setIsSending] = useState(false);
  const [isModalUpdate, setIsModalUpdate] = useState(false);
  const [recordSelected, setRecordSelected] = useState({} as any);


  if (isLoading) return <Loading />;
  if (!records.data) return <NothingHere width="164" height="98" />;
  if (records.data.length == 0) return <NothingHere text="No se encontraron datos" width="164" height="98" />;


  const sendAdjustment = async(product: any) =>{
    product.stablished = product.quantity
    try {
      setIsSending(true);
      const response = await postData(`adjustment/update`, "POST", product);
        if (response.type == "successful") {
            random && random(Math.random());
          toast.success("Ajuste completado correctamente");  
        } else {
          toast.error("Error al finalizar!");
        }
    } catch (error) {
      console.error(error);
      toast.error("Ha ocurrido un error!");
    } finally {
      setIsSending(false);
    }
  }

  const listItems = records.data.map((record: any, key: any) => (
    <tr key={record.id} className={`border-b ${record?.status == 0 && 'bg-red-200'}`}>
      <td className="py-2 px-6">{ record?.cod } </td>
      <td className="py-2 px-6">{ record?.name } </td>
      <td className="py-2 px-6">{ record?.quantity } </td>
      <td className="py-2 px-6"><Button text="Cambiar" onClick={()=>setModal(record)} disabled={isSending}/> </td>
      <td className="py-2 px-6"><Button preset={isSending ? Preset.saving : Preset.save} text="Aceptar" onClick={()=>sendAdjustment(record)} disabled={isSending}/> </td>
    </tr>
  ));

  const setModal = (record: any)=> {
    setRecordSelected(record)
    setIsModalUpdate(true)
  }

  return (<div>
  <div className="w-full overflow-auto">
    <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
      <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
        <tr>
          <th scope="col" className="py-3 px-4 border">Cod</th>
          <th scope="col" className="py-3 px-4 border">Producto</th>
          <th scope="col" className="py-3 px-4 border">Cantidad</th>
          <th scope="col" className="py-3 px-4 border">Cambiar</th>
          <th scope="col" className="py-3 px-4 border">Aceptar</th>
        </tr>
      </thead>
      <tbody>{listItems}</tbody>
    </table>
 </div>
 <AdjustmentUpdateModal random={random} isShow={isModalUpdate} record={recordSelected} onClose={()=>setIsModalUpdate(false)} />

 <Toaster position="top-right" reverseOrder={false} />
 </div>);
}
