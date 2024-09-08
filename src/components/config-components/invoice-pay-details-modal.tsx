"use client";
import { useContext, useState } from "react";
import { Modal } from "flowbite-react";
import { Button, Preset } from "../button/button";
import { numberToMoney } from "@/utils/functions";
import { ConfigContext } from "@/contexts/config-context";
import { formatDateAsDMY } from "@/utils/date-formats";
import toast, { Toaster } from 'react-hot-toast';


export interface InvoicePayDetailsModalProps {
  onClose: () => void;
  isShow: boolean;
  record?: any;
}

export function InvoicePayDetailsModal(props: InvoicePayDetailsModalProps) {
  const { onClose, record, isShow } = props;
  const { systemInformation } = useContext(ConfigContext);

  
    if (!record?.items || record?.items.length == 0) return <></>

  const listProducts = record.items.map((record: any, key: any) => (
    <tr key={record.id} className="border-b">
      <td className="py-2 px-6 truncate">{ record?.quantity} </td>
      <th className="py-2 px-6 text-gray-900 whitespace-nowrap dark:text-white" scope="row">{ record?.payment?.concept } </th>
      <td className="py-2 px-6">{ numberToMoney(record?.unit_price ? record?.unit_price : 0, systemInformation) }</td>
      <td className="py-2 px-6">{ numberToMoney(record?.subtotal ? record?.subtotal : 0, systemInformation) }</td>
      <td className="py-2 px-6">{ numberToMoney(record?.total ? record?.total : 0, systemInformation) }</td>
    </tr>
  ));


  return (
    <Modal size="3xl" show={isShow} position="center" onClose={onClose}>
      <Modal.Header>DETALLES DEL DOCUMENTO EMITIDO</Modal.Header>
      <Modal.Body>
      <div className="mx-3 my-8 ">

            <div className="grid grid-cols-4 md:grid-cols-8 gap-3 bg-white dark:bg-gray-900">
                    <div className={`col-span-4 border-2 border-slate-600 shadow-md shadow-cyan-500 rounded-md w-full`}>
                        <div className="w-full text-center">Fecha Facturación</div>
                        <div className="w-full text-center text-xl my-2 font-bold">{formatDateAsDMY(record?.billing_day)}</div>
                    </div>
                    { record?.payed_at ?
                    <div className={`col-span-4 border-2 border-slate-600 shadow-md shadow-cyan-500 rounded-md w-full`}>
                        <div className="w-full text-center">Fecha pagada</div>
                        <div className="w-full text-center text-xl my-2 font-bold">{ formatDateAsDMY(record?.payed_at) }</div>
                    </div> :
                        <div className={`col-span-4 border-2 border-slate-600 shadow-md shadow-red-500 rounded-md w-full`}>
                        <div className="w-full text-center">Vencimiento</div>
                        <div className="w-full text-center text-xl my-2 font-bold">{ formatDateAsDMY(record?.expires_at) }</div>
                    </div>
                    }
            </div>

            <div className="w-full overflow-auto mt-4">
                <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                    <tr>
                    <th scope="col" className="py-3 px-4 border">Cant</th>
                    <th scope="col" className="py-3 px-4 border">Producto</th>
                    <th scope="col" className="py-3 px-4 border">Precio</th>
                    <th scope="col" className="py-3 px-4 border">Subtotal</th>
                    <th scope="col" className="py-3 px-4 border">Total</th>
                    </tr>
                </thead>
                <tbody>
                    {listProducts}
                    <tr>
                    <th scope="col" className="py-3 px-4 border text-right" colSpan={4}>Total</th>
                    <th scope="col" className="py-3 px-4 border">{ numberToMoney(record?.total, systemInformation) }</th>
                    </tr>
                </tbody>
                </table>
                <div className="mt-2 uppercase font-medium">
                  <div className="mr-2">Periodo:</div>
                  <div>del { formatDateAsDMY(record?.started_at)} al { formatDateAsDMY(record?.billing_day)}</div>
                </div>
            </div>

        </div> 
        <Toaster position="top-right" reverseOrder={false} />
      </Modal.Body>
      <Modal.Footer className="flex justify-end gap-4">
        <Button onClick={onClose} preset={Preset.close} />
      </Modal.Footer>
    </Modal>
  );

}
