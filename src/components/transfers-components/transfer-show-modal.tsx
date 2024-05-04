"use client";
import { Modal } from "flowbite-react";
import { Button, Preset } from "../button/button";
import { statusOfTransfer } from "./transfers-receive-table";
import { formatDateAsDMY, formatHourAsHM } from "@/utils/date-formats";
import { statusOfProductTransfer } from "./transfers-receive-details-table";


export interface TransferShowModalProps {
  onClose: () => void;
  isShow: boolean;
  transfer?: any; 
}

export function TransferShowModal(props: TransferShowModalProps) {
  const { onClose, isShow, transfer} = props;

  function countRequestedProducts(transfer: any) {
    if(!transfer) return
    const requestedProducts = transfer.products.filter((product: any) => product.requested_exists === 1);
    return requestedProducts.length;
 }

 function countRequestedProductsStatus(transfer: any) {
    if(!transfer) return
    const requestedProducts = transfer.products.filter((product : any) => product.requested_exists === 1 && product.status === 2);
    return requestedProducts.length;
}


  const listItems = transfer && transfer?.products.map((record: any) => (
    <tr key={record.id} className={`border-b ${record.requested_exists == 0 ? "bg-orange-100" : "bg-white"}`} title={`${record.requested_exists == 0 ? "El producto no existe en el inventario de quien envia la transferencia" : ""}`} >
      <td className="py-3 px-6">{ record?.cod }</td>
      <td className="py-3 px-6 whitespace-nowrap">{ record?.description }</td> 
      {
        transfer.requested_at && <td className="py-3 px-6 truncate">{ record?.requested }</td>
      }
      <td className="py-3 px-6 truncate">{ record?.quantity }</td>
      <td className="py-2 px-6 truncate"> { record.requested_exists == 0 ? <span className="status-danger uppercase">No Enviado</span> :statusOfProductTransfer(record.status) } </td>
    </tr>
  ));


  return (
    <Modal size="3xl" show={isShow} position="center" onClose={onClose}>
      <Modal.Header>DETALLES DE LA TRANSFERENCIA</Modal.Header>
      <Modal.Body>
        <div className="mx-4">
            <div className="grid grid-cols-2 mx-4 font-semibold uppercase">
                <div className="col-span-1"> Estado: { statusOfTransfer(transfer?.status)} </div>
                <div className="col-span-1 text-right"> Fecha: { formatDateAsDMY(transfer?.created_at) } { formatHourAsHM(transfer?.created_at) } </div>
            </div>
                <div className="mx-4 font-semibold">
                    Envia: { transfer?.to?.description } | { transfer?.send }
                </div>
           
                { transfer?.request_at && 
                 <div className="grid grid-cols-2 mx-4 font-semibold">
                    {transfer.request_by && 
                    <div className="col-span-1"> Solicitado por: { transfer?.request_by} </div> }
                    { transfer?.request_at && 
                    <div className="col-span-1 text-right"> Solicitado: { formatDateAsDMY(transfer?.request_at) } { formatHourAsHM(transfer?.request_at) } </div> }
                </div>
                }
                { transfer?.canceled_at && 
                 <div className="grid grid-cols-2 mx-4 font-semibold">
                    {transfer.canceled_by && 
                    <div className="col-span-1"> Cancelado por: { transfer?.canceled_by} </div> }
                    { transfer?.canceled_at && 
                    <div className="col-span-1 text-right"> Cancelado: { formatDateAsDMY(transfer?.canceled_at) } { formatHourAsHM(transfer?.canceled_at) } </div> }
                </div>
                }
                { transfer?.received_at && 
                 <div className="grid grid-cols-2 mx-4 font-semibold">
                    {transfer?.receive && 
                    <div className="col-span-1"> Recibido por: { transfer?.receive} </div> }
                    { transfer?.received_at && 
                    <div className="col-span-1 text-right"> Recibido: { formatDateAsDMY(transfer?.received_at) } { formatHourAsHM(transfer?.received_at) } </div> }
                </div>
                }

                <div className="w-full overflow-auto mt-4">
                    <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                        <tr>
                        <th scope="col" className="py-3 px-4 border">Codigo</th>
                        <th scope="col" className="py-3 px-4 border">Descripción</th>
                        {
                            transfer.requested_at && <th scope="col" className="py-3 px-4 border">Solicitado</th>
                        }
                        <th scope="col" className="py-3 px-4 border">Cantidad</th>
                        <th scope="col" className="py-3 px-4 border">Estado</th>
                        </tr>
                    </thead>
                    <tbody>{listItems}</tbody>
                    </table>
                </div>


                { transfer.requested_at && 
                 <div className="text-right mx-4 mt-4 font-semibold">
                    Cantidad solicitada: {transfer?.products.length}
                </div>
                }

                 <div className="text-right mx-4 mt-2 font-semibold">
                   Cantidad enviada: {countRequestedProducts(transfer)}
                </div>    
            
                 <div className="text-right mx-4 mt-2 font-semibold">
                    Cantidad Aceptada: { countRequestedProductsStatus(transfer) }
                </div>
        

        </div>
      </Modal.Body>
      <Modal.Footer className="flex justify-end gap-4">
        <Button onClick={onClose} preset={Preset.close} />
      </Modal.Footer>
    </Modal>
  );
}
