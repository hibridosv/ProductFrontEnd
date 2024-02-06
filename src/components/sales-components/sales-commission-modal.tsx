"use client";
import { useState, useEffect } from "react";
import { Modal } from "flowbite-react";
import { Button, Preset } from "../button/button";
import toast, { Toaster } from 'react-hot-toast';

import { style } from "@/theme";
import { useForm } from "react-hook-form";
import { postData } from "@/services/resources";
import { Product } from "@/services/products";


export interface SalesCommissionModalProps {
  onClose: () => void;
  product: Product;
  isShow: boolean;
}



export function SalesCommissionModal(props: SalesCommissionModalProps) {
  const { onClose, product, isShow } = props;
  const { register, handleSubmit, resetField, setFocus, setValue } = useForm();
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    if (product) {
      setValue("quantity", product?.default_commission)
      setFocus('quantity', {shouldSelect: true})      
    }
  }, [setFocus, isShow, product, setValue])

  const onSubmit = async (data: any) => {
    if (product.default_commission == data.quantity || data.quantity == null || data.quantity < 0) onClose();
    
    let values = {
      product_id: product.id,
      commission: data.quantity,
    };

    try {
      setIsSending(true);
      const response = await postData(`sales/update/commision`, "POST", values);
      if (response.type === "error") {
        toast.error(response.message);
      } else {
        resetField("quantity")
      } 
    } catch (error) {
      console.error(error);
    } finally {
     setIsSending(false);
     onClose()
    }
  };

  return (
    <Modal show={isShow} position="center" onClose={onClose} size="md">
      <Modal.Header>Cambiar comisión</Modal.Header>
      <Modal.Body>
        <div className="mx-4">

        <form className="max-w-lg mt-4" onSubmit={handleSubmit(onSubmit)} >

            <div className="w-full md:w-full px-3 mb-4">
              <label htmlFor="quantity" className={style.inputLabel} >Porcentaje Comisión</label>
              <input type="number" step="any" {...register("quantity", { required: true })} className={`${style.input} w-full`} />
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
