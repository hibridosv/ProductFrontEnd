"use client";
import { useState, useEffect, useContext } from "react";
import { Modal } from "flowbite-react";
import { Button, Preset } from "../button/button";
import { useForm } from "react-hook-form";
import { postData } from "@/services/resources";
import toast, { Toaster } from 'react-hot-toast';
import { numberToMoney } from "@/utils/functions";
import { ShowTotal } from "./show-total";
import { Alert } from "../alert/alert";
import { PresetTheme } from "@/services/enums";
import { ConfigContext } from "@/contexts/config-context";




export interface SalesPayModalProps {
  onClose: () => void;
  invoice?: any;
  onFinish?: () => void;
  isShow?: boolean;
  config: string[];
}

export const nameOfPaymentType = (type: number) => {
  switch (type) {
    case 1: return "Efectivo"
    case 2: return "Tarjeta"
    case 3: return "Transferencia"
    case 4: return "Cheque"
    case 5: return "Credito"
  }
}

export function SalesPayModal(props: SalesPayModalProps) {
  const { onClose, invoice, onFinish, isShow, config } = props;
  const [paymentType, setPaymentType] = useState(1);
  const { register, handleSubmit, reset, setFocus } = useForm();
  const [isSending, setIsSending] = useState(false);
  const [isPayInvoice, setIsPayInvoice] = useState(false);
  const [dataInvoice, setDataInvoice] = useState({}) as any;
  const { systemInformation } = useContext(ConfigContext);


  useEffect(() => {
    setFocus('cash')
  }, [setFocus, isShow, paymentType])

  const handleFinish = ()=> {
    setIsPayInvoice(false)
    setDataInvoice({})
    if (onFinish) {
      onFinish()
    }
  }

  const onSubmit = async (data: any) => {
    let values = {
      order_id: invoice?.id,
      payment_type: paymentType,
      cash: data.cash,
      invoice_type_id: invoice?.invoice_type_id,
    };

    try {
      setIsSending(true);
      const response = await postData(`sales/pay`, "POST", values);
      if (response.type === 'successful') {
        setIsPayInvoice(true)
        setDataInvoice(response.data)
      } else {
        toast.error(response.message);
          handleFinish()
      }
    } catch (error) {
      console.error(error);
      toast.error("Ha Ocurrido un Error!");
    } finally {
      setIsSending(false);
      reset();
    }
  };

  return (
    <Modal show={isShow} position="center" onClose={onClose} size="md">
      <Modal.Body>
        <div className="mx-4">
      { isPayInvoice ? 
      <div onClick={handleFinish} className='cursor-pointer'>
        <div className="w-full my-4">
          { invoice?.invoice_assigned?.type != 8 &&
          <div  className='flex justify-between  border-y-4'>
            <div><span className="flex justify-center">Descuentos</span> <span className="flex justify-center">{numberToMoney(dataInvoice?.discount, systemInformation)}</span></div>
            <div><span className="flex justify-center">Impuestos</span> <span className="flex justify-center">{numberToMoney(dataInvoice?.taxes, systemInformation)}</span></div>
            <div><span className="flex justify-center">Sub Total</span> <span className="flex justify-center">{numberToMoney(dataInvoice?.subtotal, systemInformation)}</span></div>
          </div>
          }

          <div className="flex justify-center mt-4">TOTAL</div>
          <div className="flex justify-center text-7xl mb-4 font-bold">{numberToMoney(dataInvoice?.total - dataInvoice?.retention, systemInformation)}</div>
          { paymentType === 1 && invoice?.invoice_assigned?.type != 8 ? <>
          <div className="flex justify-center">CAMBIO</div>
          <div className="flex justify-center text-7xl mb-4 text-red-600 font-bold">{numberToMoney(dataInvoice?.change, systemInformation)}
          </div></> : 
          <div className='flex justify-center text-lg font-semibold uppercase text-blue-600'>
            { paymentType === 5 ? 
            <span>Credito Otorgado correctamente</span> : invoice?.invoice_assigned?.type == 8 ? <span>Nota de envío realizada</span> :
            <span>Pago realizado con {nameOfPaymentType(paymentType)}</span> }
          </div>}
        
        </div>
      </div> :
        (<div><ShowTotal
              isSending={isSending}
              records={invoice}
            />
            <div>
              <form onSubmit={handleSubmit(onSubmit)} className="w-full">
              {paymentType === 1 ? (
              <div>
                  <label htmlFor="default-search" className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white" >Search</label>
                  <div className="relative">
                    <input
                      type={`${invoice?.invoice_assigned?.type == 8 ? "hidden" : "number"}`}
                      step="any"
                      id="cash"
                      className="block w-full p-4 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      placeholder="Ingrese la cantidad de efectivo"
                      {...register("cash")}
                    />
                  </div>
                    <div className="flex justify-center mt-2">
                      <Button type="submit" text={`${invoice?.invoice_assigned?.type == 8 ? "Crear nota de Envío" : "Cobrar"}`} disabled={isSending} preset={isSending ? Preset.saving : Preset.save} isFull />
                    </div>
                </div>
                ) :
                (
                  <div className="flex justify-center">
                    { paymentType === 5 && !invoice?.client_id ?
                     <Alert text="Debe agregar un cliente para continuar con el credito" theme={PresetTheme.danger} isDismisible={false} /> : 
                     paymentType === 5 && invoice?.client_id && invoice?.client?.is_credit_block == 1 ?
                      <Alert text="Cliente bloqueado para otrorgar credito" theme={PresetTheme.danger} isDismisible={false} /> :
                      <Button type="submit" preset={isSending ? Preset.saving : Preset.primary} 
                      text={ paymentType === 5  ? `Asignar Credito` : `Pagar con ${nameOfPaymentType(paymentType)}`} disabled={isSending} />
                    }
                  </div>
                )}
              </form>
            </div>
            </div>) }
        </div>
      <Toaster position="top-right" reverseOrder={false} />
      </Modal.Body>
             { !isPayInvoice && !isSending && invoice?.invoice_assigned?.type != 8 &&<div className='flex justify-between border-2 border-sky-500 mt-4 mx-1'>
                <span className='mx-1 text-sm font-bold animatex' onClick={()=>setPaymentType(1)}>Efectivo</span> 
                <span className='mx-1 text-sm font-bold animatex' onClick={()=>setPaymentType(2)}>Tarjeta</span>
                <span className='mx-1 text-sm font-bold animatex' onClick={()=>setPaymentType(3)}>Transferencia</span>
                <span className='mx-1 text-sm font-bold animatex' onClick={()=>setPaymentType(4)}>Cheque</span>
                {
                  config.includes("sales-credit") && 
                  <span className='mx-1 text-sm font-bold animatex' onClick={()=>setPaymentType(5)}>Credito</span>
                }
              </div> }
      <Modal.Footer className="flex justify-end">
        { isPayInvoice ?
        <Button onClick={handleFinish} text="Terminar" preset={Preset.close} isFull disabled={isSending} /> :
        <Button onClick={onClose} preset={Preset.close} isFull disabled={isSending} /> }
      </Modal.Footer>
    </Modal>
  );
}
