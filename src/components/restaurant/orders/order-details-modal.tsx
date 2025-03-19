"use client";
import { Button, Preset } from "@/components/button/button";
import { ConfigContext } from "@/contexts/config-context";
import { useRelativeTime } from "@/hooks/useRelativeTime";
import { formatDateAsDMY, formatHourAsHM } from "@/utils/date-formats";
import { deliveryType, numberToMoney, orderStatus, orderType } from "@/utils/functions";
import { Modal } from "flowbite-react";
import { useContext, useEffect, useState } from "react";
import { TbPointFilled } from "react-icons/tb";

export interface OrderDetailsModalProps {
  onClose: () => void;
  isShow: boolean;
  order: any;
}

export function OrderDetailsModal(props: OrderDetailsModalProps) {
  const { onClose, isShow, order} = props;
  const [orderProducts, setOrderProducts] = useState([] as any);
  const relativeTime = useRelativeTime(order?.created_at);
  const { systemInformation } = useContext(ConfigContext);
  
  useEffect(() => {
      if(order && isShow){ 
          setOrderProducts(order?.invoiceproducts?.length > 0 ? order?.invoiceproducts : order?.products.length > 0 ? order?.products : [])
        }
    }, [order, isShow]);

      const listItems = orderProducts?.map((record: any) => (
        <>
        <tr key={record.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700" >
          <td className="py-3 px-6">{ record.quantity }</td>
          <td className="py-3 px-6">{ record.product }</td>
          <td className="py-3 px-6">{ numberToMoney(record.unit_price, systemInformation) }</td>
          <td className="py-3 px-6">{ numberToMoney(record.discount, systemInformation) }</td>
          <td className="py-3 px-6">{ numberToMoney(record.total, systemInformation) }</td>
        </tr>
            {record?.options?.length > 0 && 
            <tr className="bg-slate-100 border-y-2 border-slate-600">
                <td colSpan={5} className=" font-medium px-2 py-1 bg-red-100">
                    {record.options.map((option: any)=> <span key={option.id} className='flex'>
                            <TbPointFilled className='mt-1 text-red-600' /><span className='mr-1 text-black'>{option?.option?.name}</span>
                        </span>)}
                </td>
            </tr>
            }
        </>
      ));
    


  return (
    <Modal size="2xl" show={isShow} position="center" onClose={onClose}>
      <Modal.Header>ORDEN NUMERO: {order?.number}</Modal.Header>
      <Modal.Body>
        <div className="mx-4">
            <div className="flex justify-between">
                <div>
                <span className=" uppercase">Usuario:</span>
                <span className="ml-2 font-semibold">{ order?.employee?.name }</span>
                </div>
                <div>
                <span className=" uppercase">clientes:</span>
                <span className="ml-2 font-semibold">{ order?.attributes?.clients_quantity }</span>
                </div>
            </div>
            <div className="flex justify-between font-semibold border border-gray-300 py-2 rounded-full px-4 mt-4 shadow-lg">
                <span>Inicio: { formatDateAsDMY(order?.created_at)} {formatHourAsHM(order?.created_at)} </span>
                <span className=" text-red-600">Hace: { relativeTime }</span>
            </div>

            <div className="w-full overflow-auto mt-3">
                <table className="text-sm text-left text-gray-500 dark:text-gray-400">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                    <tr>
                    <th scope="col" className="py-3 px-4 border">Cant</th>
                    <th scope="col" className="py-3 px-4 border">Producto</th>
                    <th scope="col" className="py-3 px-4 border">Precio</th>
                    <th scope="col" className="py-3 px-4 border">Descuento</th>
                    <th scope="col" className="py-3 px-4 border">Total</th>
                    </tr>
                </thead>
                <tbody>{listItems}</tbody>
                <tfoot>
                    <tr>
                        <td colSpan={3} className="py-3 px-4 text-right font-semibold">Total</td>
                        <td className="py-3 px-4 font-semibold">{ numberToMoney(order?.discount, systemInformation) }</td>
                        <td className="py-3 px-4 font-semibold">{ numberToMoney(order?.total, systemInformation) }</td>
                    </tr>
                </tfoot>
                </table>
            </div>

            <div className="flex justify-between font-semibold">
                <span className="w-full text-center border border-gray-300 py-2 rounded-tl-full rounded-bl-full mt-4 shadow-lg bg-lime-100 text-lime-800">{orderType(order?.order_type)} </span>
                <span className="w-full text-center border border-gray-300 py-2 mt-4 shadow-xl">{orderStatus(order?.status)} </span>
                <span className="w-full text-center border border-gray-300 py-2 rounded-tr-full rounded-br-full mt-4 shadow-lg bg-teal-100 text-teal-800">{deliveryType(order?.delivery_type)}</span>
            </div>


        <div className="mt-4 text-sm text-red-600">
           * La propina no se encuentra incluida en el total
        </div>
        </div>
      </Modal.Body>
      <Modal.Footer className="flex justify-end gap-4">
        <Button onClick={onClose} preset={Preset.close} />
      </Modal.Footer>
    </Modal>
  );
}
