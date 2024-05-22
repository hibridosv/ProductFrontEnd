'use client'
import {  useEffect, useState } from "react";
import { Modal } from "flowbite-react";
import { Button, Preset } from "../button/button";
import { getData, postData } from "@/services/resources";
import toast, { Toaster } from "react-hot-toast";
import { Order } from "@/services/order";
import { Loading } from "../loading/loading";
import { ArrowIcon} from "@/theme/svg"


export interface SalesSelectInvoiceTypeModalProps {
    onClose: () => void;
    isShow?: boolean;
    order: Order; // arreglo de la orden
}

export function SalesSelectInvoiceTypeModal(props: SalesSelectInvoiceTypeModalProps){
const { onClose, isShow, order } = props;
const [isSending, setIsSending] = useState(false);
const [invoiceType, setInvoiceType] = useState([]);


const loadInvoiceTypes = async () => {
    try {
      const response = await getData(`invoice/type/active`);
      setInvoiceType(response.data);
    } catch (error) {
      console.error(error);
    } 
  };

  useEffect(() => {
    if (isShow) {
        (async () => { await loadInvoiceTypes(); })();
    }
    // eslint-disable-next-line
  }, [isShow]);



const onSubmit = async (invoice_type_id: any) => {
    
    let values = {
        invoice_type_id: invoice_type_id,
        order_id: order.id,
    };

    try {
      setIsSending(true);
      const response = await postData(`invoice/type/update`, "POST", values);
      if (response.type === "error") {
        toast.error(response.message);
      } else {
        setInvoiceType(response.data);
      }
    } catch (error) {
      console.error(error);
      toast.error("Ha Ocurrido un Error!");
    } finally {
        setIsSending(false);
    }
  };

  const style = "flex justify-between p-3 hover:bg-blue-200 hover:text-blue-800 cursor-pointer"
  const styleSelect = "flex justify-between p-3 hover:bg-blue-200 hover:text-blue-800 cursor-pointer bg-cyan-200"
  
  const listItems = invoiceType?.map((type: any):any => (
    <div key={type.id} onClick={()=>onSubmit(type.id)}>
        <li className={ type.status == 1 ? styleSelect : style}>
              {type.name}  { ArrowIcon }
        </li>
    </div>
))

return (
<Modal show={isShow} position="center" onClose={onClose} size="md">
  <Modal.Header>Seleccionar tipo de Factura</Modal.Header>
  <Modal.Body>
    <div className="mx-4">
        {
          isSending ? <Loading text="Actualizando" /> : invoiceType && listItems         
        }
      <Toaster position="top-right" reverseOrder={false} />
    </div>
  </Modal.Body>
  <Modal.Footer className="flex justify-end">
    <Button onClick={onClose} preset={Preset.close} isFull disabled={isSending} /> 
  </Modal.Footer>
</Modal>)
}