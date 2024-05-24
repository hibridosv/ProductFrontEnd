"use client";
import { Modal } from "flowbite-react";
import { Button, Preset } from "../button/button";
import { useState } from "react";
import toast, { Toaster } from 'react-hot-toast';
import { postData } from "@/services/resources";
import { getRandomInt, getTotalOfItem, getTotalPercentage, numberToMoney } from "@/utils/functions";
import { Loading } from "../loading/loading";
import { Alert } from "../alert/alert";
import { formatDateAsDMY, formatHourAsHM } from "@/utils/date-formats";
import { ButtonDownload } from "../button/button-download";
import { FaDownload } from "react-icons/fa";


export interface CommissionViewModalProps {
    onClose: () => void;
    isShow: boolean;
    record?: any;
    random?: (value: number) => void;
}

export function CommissionViewModal(props: CommissionViewModalProps) {
    const { onClose, isShow, record, random } = props;
    const [isSending, setIsSending] = useState(false);
    const products = record && record.linked


    const payReport = async () => {
      try {
        setIsSending(true);
        const response = await postData(`tools/commissions/pay/${record?.id}`, "PUT");
        if (response.type == "successful") {
          toast.success("Orden Guardada!");
          random && random(getRandomInt(100));
          onClose();
        } else {
          toast.error("Error al guardar!");
        }
      } catch (error) {
        console.error(error);
        toast.error("Ha ocurrido un error!");
      } finally {
        setIsSending(false);
      }
    }

    const deleteReport = async () => {
      try {
        setIsSending(true);
        const response = await postData(`tools/commissions/${record?.id}`, "DELETE");
        if (response.type == "successful") {
          toast.success("Orden Eliminada!");
          random && random(getRandomInt(100));
          onClose();
        } else {
          toast.error("Error al Eliminar!");
        }
      } catch (error) {
        console.error(error);
        toast.error("Ha ocurrido un error!");
      } finally {
        setIsSending(false);
      }
    }

    const listItems = products?.map((record: any, key: any) => (
        <tr key={key} className={`border-b`}>
          <td className="py-2 px-6 truncate">{ record?.product.cod } </td>
          <th className="py-2 px-6 text-gray-900 whitespace-nowrap dark:text-white" scope="row">{ record?.product.product }</th>
          <td className="py-2 px-6">{ record?.product.quantity }</td>
          <td className="py-2 px-6">{ numberToMoney(record?.product.unit_price ? record?.product.unit_price : 0) }</td>
          <td className="py-2 px-6">{ numberToMoney(record?.product.discount ? record?.product.discount : 0) }</td>
          <td className="py-2 px-6">{ record?.product.commission ? record?.product.commission : 0 } %</td>
          <td className="py-2 px-6">{ numberToMoney(getTotalPercentage(record?.product.total, record?.product.commission)) }</td>
          <td className="py-2 px-6">{ numberToMoney(record?.product.total ? record?.product.total : 0) }</td>
        </tr>
      ));


  return (
    <Modal size="6xl" show={isShow} position="center" onClose={onClose}>
      <Modal.Header>REPORTE DE COMISIONES</Modal.Header>
      <Modal.Body>
        { isSending ? <Loading /> :
          <div>
                  <div className="w-full overflow-auto">
                    <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                        <tr>
                        <th scope="col" className="py-3 px-4 border">Codigo</th>
                        <th scope="col" className="py-3 px-4 border">Producto</th>
                        <th scope="col" className="py-3 px-4 border">Cant</th>
                        <th scope="col" className="py-3 px-4 border">Precio</th>
                        <th scope="col" className="py-3 px-4 border">Descuento</th>
                        <th scope="col" className="py-3 px-4 border whitespace-nowrap">Comisión %</th>
                        <th scope="col" className="py-3 px-4 border whitespace-nowrap">Comisión $</th>
                        <th scope="col" className="py-3 px-4 border">Total</th>
                        </tr>
                    </thead>
                    <tbody>{listItems}</tbody>
                    </table>
                    { products ?
                    <div className="uppercase border-x-2 m-4 ">
                      <div>
                          <div className="py-1 pl-5 border border-b-2 ">Facturas afectadas: <span className=" font-semibold">{ record.invoices }</span></div>
                          <div className="py-1 pl-5 border border-b-2 ">Cantidad de productos: <span className=" font-semibold">{ record.products }</span></div>
                          <div className="py-1 pl-5 border border-b-2 ">Total de ventas: <span className=" font-semibold">{ numberToMoney(record.total) }</span></div>
                          <div className="py-1 pl-5 border border-b-2 ">Total de Comisión: <span className=" font-semibold">{ numberToMoney(record.commissions) }</span></div>
                          <div className="py-1 pl-5 border border-b-2 ">Total de Retenciones: <span className=" font-semibold">{ numberToMoney(record.commissions.toFixed(2) * 0.10) }</span></div>
                          <div className="py-1 pl-5 border border-b-2 bg-lime-200">Total a Pagar: <span className=" font-semibold">{ numberToMoney(record.commissions - (record.commissions * 0.10)) }</span></div>
                        </div> 
                    </div> : 
                    <div className="flex justify-center">
                      <Alert text="No se encuentran registros" isDismisible={false} />
                    </div> }
                </div>

                {
                  record && record.status == 0 && 
                  <div className="mt-4">
                    <span className="mx-2 font-semibold text-red-600 uppercase">ELIMINADO POR:</span> 
                    <span className="mx-2 font-semibold text-red-600 uppercase">{ record?.employee_deleted?.name }</span>  
                    <span className="mx-2 font-bold text-slate-800">{ formatDateAsDMY(record?.deleted_at) } { formatHourAsHM(record?.deleted_at) }</span>
                  </div>
                }
          </div>
          }
      </Modal.Body>
      <Modal.Footer className="flex justify-end gap-4">
        {
           record && record.status == 3 && <ButtonDownload href={`/download/pdf/commission/${record.id}`}><FaDownload  size={24}/></ButtonDownload>
        }
        {
          record && record.status == 2 && <Button onClick={deleteReport} preset={Preset.cancel} disabled={isSending} text="ELIMINAR REPORTE" />
        }
        <Button onClick={onClose} preset={Preset.close} disabled={isSending} />
        {
          record && record.status == 2 && <Button onClick={payReport} preset={isSending ? Preset.saving : Preset.save} disabled={isSending} text="PAGAR REPORTE" />
        }
      </Modal.Footer>
      <Toaster position="top-right" reverseOrder={false} />
    </Modal>
  );
}
