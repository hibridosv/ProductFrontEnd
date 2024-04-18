"use client";
import { Modal } from "flowbite-react";
import { Button, Preset } from "../button/button";
import {  numberToMoney, sumarTotales } from "@/utils/functions";
import { getUrlFromCookie } from "@/services/oauth";
import { formatDate } from "@/utils/date-formats";
import { ButtonDownload } from "../button/button-download";
import { FaDownload } from "react-icons/fa";


export interface QuotesViewModalProps {
    onClose: () => void;
    isShow: boolean;
    record?: any;
    sendQuotes: (quote: any)=> void;
    isSending: boolean;
}

export function QuotesViewModal(props: QuotesViewModalProps) {
    const { onClose, isShow, record, sendQuotes, isSending } = props;



    const listItems = record?.products?.map((record: any, key: any) => (
        <tr key={key} className={`border-b`}>
          <td className="py-2 px-6 truncate">{ record?.cod } </td>
          <th className="py-2 px-6 text-gray-900 whitespace-nowrap dark:text-white" scope="row">{ record?.product }</th>
          <td className="py-2 px-6">{ record?.quantity }</td>
          <td className="py-2 px-6">{ numberToMoney(record?.unit_price ? record?.unit_price : 0) }</td>
          <td className="py-2 px-6">{ numberToMoney(record?.discount ? record?.discount : 0) }</td>
          <td className="py-2 px-6">{ numberToMoney(record?.total ? record?.total : 0) }</td>
        </tr>
      ));



  return (
    <Modal size="5xl" show={isShow} position="center" onClose={onClose}>
      {/* <Modal.Header>DETALLES DE COTIZACION</Modal.Header> */}
      <Modal.Body>

          <div>
            <div className="w-full grid grid-cols-10 mb-4 text-lg">
                <div className="col-span-7">
                    <div><span className="font-bold uppercase">Cliente:</span> { record?.client?.name }</div>
                    <div><span className="font-bold uppercase">Dirección:</span> { record?.client?.address }</div>
                </div>
                <div className="col-span-3">
                    <div><span className="font-bold uppercase">Creada:</span> { formatDate(record?.created_at) }</div>
                    <div><span className="font-bold uppercase">Cotización:</span> { record?.quote_number }</div>
                </div>
            </div>
                  <div className="w-full overflow-auto">
                    <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                        <tr>
                            <th scope="col" className="py-3 px-4 border">Codigo</th>
                            <th scope="col" className="py-3 px-4 border">Producto</th>
                            <th scope="col" className="py-3 px-4 border">Cant</th>
                            <th scope="col" className="py-3 px-4 border">Precio</th>
                            <th scope="col" className="py-3 px-4 border">Descuento</th>
                            <th scope="col" className="py-3 px-4 border">Total</th>
                        </tr>
                    </thead>
                    <tbody>{listItems}</tbody>
                    <tfoot>
                        <tr>
                            <th scope="col"></th>
                            <th scope="col"></th>
                            <th scope="col"></th>
                            <th scope="col"></th>
                            <th scope="col" className="py-3 px-4 border">Total: </th>
                            <th scope="col" className="py-3 px-4 border">{ numberToMoney(sumarTotales(record?.products)) }</th>
                        </tr>
                    </tfoot>
                    </table>
                </div>

                <div className="w-full font-bold text-lg uppercase mt-10">
                Cotización válida hasta el: { formatDate(record?.expiration)}
                </div>

          </div>
  
      </Modal.Body>
      <Modal.Footer className="flex justify-end gap-4">
        {
           record && !isSending && 
           <ButtonDownload href={`/download/pdf/quote/${record.id}`}><FaDownload  size={24}/></ButtonDownload>
        }
        <Button onClick={()=>sendQuotes(record)} preset={isSending ? Preset.saving : Preset.save} text="Facturar" disabled={isSending} />
        <Button onClick={onClose} preset={Preset.close} disabled={isSending} />
      </Modal.Footer>
    </Modal>
  );
}
