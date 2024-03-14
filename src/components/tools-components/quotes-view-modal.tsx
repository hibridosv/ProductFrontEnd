"use client";
import { Modal } from "flowbite-react";
import { Button, Preset } from "../button/button";
import {  getTotalPercentage, numberToMoney, sumarTotales } from "@/utils/functions";
import { getUrlFromCookie } from "@/services/oauth";
import { formatDate } from "@/utils/date-formats";


export interface QuotesViewModalProps {
    onClose: () => void;
    isShow: boolean;
    record?: any;
}

export function QuotesViewModal(props: QuotesViewModalProps) {
    const { onClose, isShow, record } = props;
    const remoteUrl = getUrlFromCookie();



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
                            <th scope="col" className="py-3 px-4 border">{ sumarTotales(record?.products) }</th>
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
           record && <a target="_blank" href={`${remoteUrl}/download/pdf/quote/${record.id}`} className="py-2 px-4 flex justify-center items-center text-white transition ease-in duration-200 text-center text-base font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2  rounded-lg  bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500 focus:ring-offset-indigo-200 clickeable">DESCARGAR PDF</a>
        }
        <Button onClick={onClose} preset={Preset.close} />
      </Modal.Footer>
    </Modal>
  );
}
