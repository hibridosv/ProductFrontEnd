"use client";
import { useContext, useState } from "react";
import { Modal } from "flowbite-react";
import { Button, Preset } from "../button/button";
import { Alert } from "../alert/alert";
import {  numberToMoney } from "@/utils/functions";
import { ConfigContext } from "@/contexts/config-context";
import { formatDateAsDMY } from "@/utils/date-formats";
import toast, { Toaster } from 'react-hot-toast';
import { PresetTheme } from "@/services/enums";
import { useRouter } from "next/navigation";
import { postData } from "@/services/resources";


export interface RemissionsViewModalProps {
  onClose: () => void;
  isShow: boolean;
  record?: any;
}

export function RemissionsViewModal(props: RemissionsViewModalProps) {
    const { onClose, record, isShow} = props;
    const [showCodeStatus, setShowCodeStatus] = useState<boolean>(false);
    const { config, systemInformation } = useContext(ConfigContext);
    const [isSending, setIsSending] = useState(false);
    const router = useRouter();


  console.log(record);

  if (!isShow && !record) {
    return null;
  }

    const sendRemissions = async () => {
      setIsSending(true)
      try {
          const response = await postData(`remissions/charge/${record.id}`, 'PUT');
          if (response.type === "error") {
          toast.error("Ha Ocurrido un Error!");
          } else {
          toast.success( "Cotización enviada a facturar");
          router.push("/sales/quick");
          }
      } catch (error) {
          console.error(error);
          toast.error("Ha Ocurrido un Error!");
      } finally {
          setIsSending(false)
      }
    }
  

  const listProducts = record?.products.map((record: any, key: any) => (
    <tr key={record.id} className="border-b">
      <td className="py-2 px-6 truncate">{ record?.quantity} </td>
      { showCodeStatus &&
      <td className="py-2 px-6 truncate">{ record?.cod} </td>
      }
      <th className="py-2 px-6 text-gray-900 whitespace-nowrap dark:text-white" scope="row">{ record?.product } </th>
      <td className="py-2 px-6">{ numberToMoney(record?.unit_price ? record?.unit_price : 0, systemInformation) }</td>
      <td className="py-2 px-6">{ numberToMoney(record?.subtotal ? record?.subtotal : 0, systemInformation) }</td>
      <td className="py-2 px-6">{ numberToMoney(record?.taxes ? record?.taxes : 0, systemInformation) }</td>
      <td className="py-2 px-6">{ numberToMoney(record?.discount ? record?.discount : 0, systemInformation) }</td>
      <td className="py-2 px-6">{ numberToMoney(record?.total ? record?.total : 0, systemInformation) }</td>
    </tr>
  ));


  return (
    <Modal size="5xl" show={isShow} position="center" onClose={onClose}>
      <Modal.Header>DETALLES DEL DOCUMENTO EMITIDO</Modal.Header>
      <Modal.Body>
      <div className="mx-3 my-8 ">

            <div className="grid grid-cols-2 md:grid-cols-6 gap-3 bg-white dark:bg-gray-900">
                    <div className={`col-span-2 border-2 border-slate-600 shadow-md shadow-cyan-500 rounded-md w-full`}>
                        <div className="w-full text-center">Cajero</div>
                        <div className="w-full text-center text-xl my-2 font-bold">{record?.employee?.name}</div>
                    </div>
                    <div className={`col-span-2 border-2 border-slate-600 shadow-md shadow-cyan-500 rounded-md w-full`}>
                        <div className="w-full text-center">Fecha</div>
                        <div className="w-full text-center text-xl my-2 font-bold">{ formatDateAsDMY(record?.created_at) }</div>
                    </div>
                    <div className={`col-span-2 border-2 border-slate-600 shadow-md shadow-cyan-500 rounded-md w-full`}>
                        <div className="w-full text-center">Tipo</div>
                        <div className="w-full text-center text-xl my-2 font-bold">{ record?.invoice_assigned?.name }</div>
                    </div>
            </div>

            <div className="w-full overflow-auto mt-4">
                <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                    <tr>
                    <th scope="col" className="py-3 px-4 border">Cant</th>
                    { showCodeStatus &&
                    <th scope="col" className="py-3 px-4 border">Codigo</th>
                    }
                    <th scope="col" className="py-3 px-4 border">Producto</th>
                    <th scope="col" className="py-3 px-4 border">Precio</th>
                    <th scope="col" className="py-3 px-4 border">Subtotal</th>
                    <th scope="col" className="py-3 px-4 border">Imp</th>
                    <th scope="col" className="py-3 px-4 border">Descuento</th>
                    <th scope="col" className="py-3 px-4 border">Total</th>
                    </tr>
                </thead>
                <tbody>
                    {listProducts}
                </tbody>
                </table>
            </div>

            <div className="uppercase shadow-lg border-x-2 ml-4 my-4 p-2">
                {record?.employee && <div>Atendido por: <span className="font-semibold">{record?.employee?.name}</span></div>}
                {record?.referred && <div>Nombre de referido: <span className="font-semibold">{record?.referred?.name}</span></div>}
                {record?.client && <div>Nombre del cliente: <span className="font-semibold">{record?.client?.name}</span></div>}
                {record?.delivery && <div>Nombre del repartidor: <span className="font-semibold">{record?.delivery?.name}</span></div>}
            </div>
                {   
                record?.invoice_assigned?.is_electronic == 1 && 
                <Alert theme={PresetTheme.info} info="Atención: " text="Este Documento se envió electronicamente" isDismisible={false}  />
                }

        </div> 
        <Toaster position="top-right" reverseOrder={false} />
      </Modal.Body>
      <Modal.Footer className="flex justify-end gap-4">
        <Button text="Facturar" onClick={sendRemissions} preset={isSending ? Preset.saving : Preset.save} disabled={isSending} />
        <Button onClick={onClose} preset={Preset.close} disabled={isSending} />
      </Modal.Footer>
    </Modal>
  );

}
