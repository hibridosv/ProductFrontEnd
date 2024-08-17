"use client";
import { useState, useEffect } from "react";
import { Modal } from "flowbite-react";
import toast, { Toaster } from 'react-hot-toast';

import { style } from "@/theme";
import { useForm } from "react-hook-form";
import { postData } from "@/services/resources";
import { Product } from "@/services/products";
import { Button, Preset } from "@/components/button/button";


export interface SalesSetQuantityModalProps {
  onClose: () => void;
  product: any;
  isShow: boolean;
  sendProduct: (producId: string, quantity: number)=>void
}



export function SalesSetQuantityModal(props: SalesSetQuantityModalProps) {
  const { onClose, product, isShow, sendProduct } = props;
  const { register, handleSubmit, resetField, setFocus, setValue } = useForm();
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    if (product && isShow) {
      setFocus('quantity', {shouldSelect: true})      
    }
  }, [setFocus, isShow, product])


  const onSubmit = async (data: any) => {
    setIsSending(true)
    if (data.quantity < 1) return
    sendProduct(product?.product_id, data.quantity)
    resetField('quantity')
    setIsSending(false)
    onClose()
  };


  return (
    <Modal show={isShow} position="center" onClose={onClose} size="md">
      <Modal.Header>Cambiar cantidad</Modal.Header>
      <Modal.Body>
        <div className="mx-4">

        <form className="max-w-lg mt-4" onSubmit={handleSubmit(onSubmit)} >

            <div className="w-full md:w-full px-3 mb-4">
              <label htmlFor="quantity" className={style.inputLabel} >Cantidad extra a agregar</label>
              <input type="number" step="any" min={1} {...register("quantity", { required: true })} className={`${style.input} w-full`} />
            </div>

              <div className="flex justify-center">
              <Button type="submit" disabled={isSending} preset={isSending ? Preset.saving : Preset.save} />
              </div>
        </form>
        </div>
      <Toaster position="top-right" reverseOrder={false} />
      </Modal.Body>
      <Modal.Footer className="flex justify-end">
        <Button onClick={onClose} preset={Preset.close} isFull disabled={isSending} /> 
      </Modal.Footer>
    </Modal>
  );
}
