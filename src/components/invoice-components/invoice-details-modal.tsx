"use client";
import { useContext, useEffect, useState } from "react";
import { Modal } from "flowbite-react";
import { Button, Preset } from "../button/button";
import { Alert } from "../alert/alert";
import { getConfigStatus, getPaymentTypeName, numberToMoney } from "@/utils/functions";
import { ConfigContext } from "@/contexts/config-context";
import { formatDateAsDMY } from "@/utils/date-formats";
import { getData } from "@/services/resources";
import toast, { Toaster } from 'react-hot-toast';
import { Loading } from "../loading/loading";


export interface InvoiceDetailsModalProps {
  onClose: () => void;
  isShow: boolean;
  record?: string;
}

export function InvoiceDetailsModal(props: InvoiceDetailsModalProps) {
  const { onClose, record, isShow } = props;
  const [showCodeStatus, setShowCodeStatus] = useState<boolean>(false);
  const { config } = useContext(ConfigContext);
  const [records, setRecords] = useState([]) as any;
  const [isSending, setIsSending] = useState(false);




  useEffect(() => {
    const handleFormSubmit = async (iden: string) => {
        try {
          setIsSending(true)
          const response = await getData(`sales/${iden}`);
          if (!response.message) {
            setRecords(response)
            // toast.success("Petición realizada correctamente");
          } else {
            toast.error("Faltan algunos datos importantes!");
          }
        } catch (error) {
          console.error(error);
          toast.error("Ha ocurrido un error!");
        } finally {
          setIsSending(false)
        }
      };
      
    setShowCodeStatus(getConfigStatus("sales-show-code", config));
    if (record && isShow) {
        (async () => { await handleFormSubmit(record) })();
    }
    // eslint-disable-next-line
  }, [config, record, isShow]);



  const listProducts = records?.data?.products.map((record: any, key: any) => (
    <tr key={record.id} className="border-b">
      <td className="py-2 px-6 truncate">{ record?.quantity} </td>
      { showCodeStatus &&
      <td className="py-2 px-6 truncate">{ record?.cod} </td>
      }
      <th className="py-2 px-6 text-gray-900 whitespace-nowrap dark:text-white" scope="row">{ record?.product } </th>
      <td className="py-2 px-6">{ numberToMoney(record?.unit_price ? record?.unit_price : 0) }</td>
      <td className="py-2 px-6">{ numberToMoney(record?.subtotal ? record?.subtotal : 0) }</td>
      <td className="py-2 px-6">{ numberToMoney(record?.taxes ? record?.taxes : 0) }</td>
      <td className="py-2 px-6">{ numberToMoney(record?.discount ? record?.discount : 0) }</td>
      <td className="py-2 px-6">{ numberToMoney(record?.total ? record?.total : 0) }</td>
    </tr>
  ));


  return (
    <Modal size="5xl" show={isShow} position="center" onClose={onClose}>
      <Modal.Header>Agregar nueva categoria</Modal.Header>
      <Modal.Body>
      { isSending ? <Loading text="Cargado datos" /> :
      <div className="mx-3 my-8 ">

            <div className="grid grid-cols-4 md:grid-cols-8 gap-3 bg-white dark:bg-gray-900">
                    <div className={`col-span-2 border-2 border-slate-600 shadow-md shadow-cyan-500 rounded-md w-full`}>
                        <div className="w-full text-center">Cajero</div>
                        <div className="w-full text-center text-xl my-2 font-bold">{records?.data?.employee?.name}</div>
                    </div>
                    <div className={`col-span-2 border-2 border-slate-600 shadow-md shadow-cyan-500 rounded-md w-full`}>
                        <div className="w-full text-center">Fecha</div>
                        <div className="w-full text-center text-xl my-2 font-bold">{ formatDateAsDMY(records?.data?.charged_at) }</div>
                    </div>
                    <div className={`col-span-2 border-2 border-slate-600 shadow-md shadow-cyan-500 rounded-md w-full`}>
                        <div className="w-full text-center">Tipo</div>
                        <div className="w-full text-center text-xl my-2 font-bold">{ records?.data?.invoice_assigned?.name }</div>
                    </div>
                    <div className={`col-span-2 border-2 border-slate-600 shadow-md shadow-cyan-500 rounded-md w-full`}>
                        <div className="w-full text-center">Pago</div>
                        <div className="w-full text-center text-xl my-2 font-bold">{ getPaymentTypeName(records?.data?.payment_type) }</div>
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
                    <tr>
                    <th scope="col" className="py-3 px-4 border" colSpan={showCodeStatus ? 4 : 3} ></th>
                    <th scope="col" className="py-3 px-4 border">{ numberToMoney(records?.data?.subtotal) }</th>
                    <th scope="col" className="py-3 px-4 border">{ numberToMoney(records?.data?.taxes) }</th>
                    <th scope="col" className="py-3 px-4 border">{ numberToMoney(records?.data?.discount) }</th>
                    <th scope="col" className="py-3 px-4 border">{ numberToMoney(records?.data?.total) }</th>
                    </tr>
                </tbody>
                </table>
            </div>
                {
                records?.data?.invoice_assigned?.type == 9 && 
                <Alert text="Este Documento tiene una numeración temporal" />
                }
                {
                records?.data?.invoice_assigned?.is_electronic == 1 && 
                <Alert info="Atención: " text="Este Documento se envió electronicamente" isDismisible={false}  />
                }
        </div> }
        <Toaster position="top-right" reverseOrder={false} />
      </Modal.Body>
      <Modal.Footer className="flex justify-end gap-4">
        <Button onClick={onClose} preset={Preset.close} />
      </Modal.Footer>
    </Modal>
  );

}
