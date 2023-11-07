"use client";
import { useState, useEffect } from "react";
import { Modal } from "flowbite-react";
import { Button, Preset } from "../button/button";
import { useForm } from "react-hook-form";
import { postData } from "@/services/resources";
import toast, { Toaster } from 'react-hot-toast';

import { SalesShowTotal } from "../sales-components/sales-show-total";
import { numberToMoney } from "@/utils/functions";

export interface SalesPayModalProps {
  onClose: () => void;
  invoice?: any;
  editable?: boolean;
  onFinish?: () => void;
  isShow?: boolean;
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
  const { onClose, invoice, editable = false, onFinish, isShow } = props;
  const [paymentType, setPaymentType] = useState(1);
  const { register, handleSubmit, reset, setFocus } = useForm();
  const [isSending, setIsSending] = useState(false);
  const [isPayInvoice, setIsPayInvoice] = useState(false);
  const [dataInvoice, setDataInvoice] = useState({}) as any;

  useEffect(() => {
    setFocus('cash')
  }, [setFocus, isShow, paymentType])

  if (!isShow) return <></>
  
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
    };

    try {
      setIsSending(true);
      const response = await postData(`sales/pay`, "POST", values);
      if (response.type === 'successfull') {
        setIsPayInvoice(true)
        setDataInvoice(response.data)
      } else {
        toast.error(response.message);
        if (onFinish) {
          onFinish()
        }
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
          <div  className='flex justify-between  border-y-4'>
            <div><span className="flex justify-center">Descuentos</span> <span className="flex justify-center">{numberToMoney(dataInvoice?.discount)}</span></div>
            <div><span className="flex justify-center">Impuestos</span> <span className="flex justify-center">{numberToMoney(dataInvoice?.taxes)}</span></div>
            <div><span className="flex justify-center">Sub Total</span> <span className="flex justify-center">{numberToMoney(dataInvoice?.subtotal)}</span></div>
          </div>

          <div className="flex justify-center mt-4">TOTAL</div>
          <div className="flex justify-center text-7xl mb-4 font-bold">{numberToMoney(dataInvoice?.total)}</div>
          { paymentType === 1 ? <>
          <div className="flex justify-center">CAMBIO</div>
          <div className="flex justify-center text-7xl mb-4 text-red-600 font-bold">{numberToMoney(dataInvoice?.change)}
          </div></> : 
          <div className='flex justify-center text-lg font-semibold uppercase text-blue-600'>
            { paymentType === 5 ? 
            <span>Credito Otorgado correctamente</span> :
            <span>Pago realizado con {nameOfPaymentType(paymentType)}</span> }
          </div>}
        
        </div>
      </div> :
        (<div><SalesShowTotal
              isSending={isSending}
              records={invoice?.invoiceproducts}
              showAllData
            />
            <div>
              <form onSubmit={handleSubmit(onSubmit)} className="w-full">
              {paymentType === 1 ? (
              <div>
                  <label htmlFor="default-search" className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white" >Search</label>
                  <div className="relative">
                    <input
                      type="number"
                      step="any"
                      id="cash"
                      className="block w-full p-4 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      placeholder="Ingrese la cantidad de efectivo"
                      {...register("cash")}
                    />
                  </div>
                </div>
                ) :
                (
                  <div className="flex justify-center">
                    <Button type="submit" preset={Preset.primary} text={
                      paymentType === 5  ? `Asignar Credito` :
                      `Pagar con ${nameOfPaymentType(paymentType)}`
                      } />
                  </div>
                )}
              </form>
            </div>
            </div>) }
        </div>
      <Toaster position="top-right" reverseOrder={false} />
      </Modal.Body>
             { !isPayInvoice && <div className='flex justify-between border-2 border-sky-500 mt-4 mx-1'>
                <span className='mx-1 text-sm font-bold animatex' onClick={()=>setPaymentType(1)}>Efectivo</span> 
                <span className='mx-1 text-sm font-bold animatex' onClick={()=>setPaymentType(2)}>Tarjeta</span>
                <span className='mx-1 text-sm font-bold animatex' onClick={()=>setPaymentType(3)}>Transferencia</span>
                <span className='mx-1 text-sm font-bold animatex' onClick={()=>setPaymentType(4)}>Cheque</span>
                <span className='mx-1 text-sm font-bold animatex' onClick={()=>setPaymentType(5)}>Credito</span>
              </div> }
      <Modal.Footer className="flex justify-end">
        { isPayInvoice ?
        <Button onClick={handleFinish} preset={Preset.close} isFull /> :
        <Button onClick={onClose} preset={Preset.close} /> }
      </Modal.Footer>
    </Modal>
  );
}
