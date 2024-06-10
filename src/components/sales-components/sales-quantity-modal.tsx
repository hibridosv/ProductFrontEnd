"use client";
import { useState, useEffect } from "react";
import { Modal } from "flowbite-react";
import { Button, Preset } from "../button/button";
import toast, { Toaster } from 'react-hot-toast';

import { style } from "@/theme";
import { useForm } from "react-hook-form";
import { postData } from "@/services/resources";
import { Product } from "@/services/products";


export interface SalesQuantityModalProps {
  onClose: () => void;
  product: Product;
  isShow: boolean;
  order: any;
  priceType: number;
}



export function SalesQuantityModal(props: SalesQuantityModalProps) {
  const { onClose, product, isShow, order, priceType } = props;
  const { register, handleSubmit, resetField, setFocus, setValue } = useForm();
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    if (product) {
      setValue("quantity", product?.quantity)
      setFocus('quantity', {shouldSelect: true})      
    }
  }, [setFocus, isShow, product, setValue])

  const onSubmit = async (data: any) => {
    if (product.quantity == data.quantity || data.quantity == null) onClose();
    
    let quantity = 0;
    let addOrSubtract = 0;
    if(product.quantity < data.quantity) {
       quantity = data.quantity - product.quantity;
       addOrSubtract = 1;
    } else {
       quantity = product.quantity - data.quantity;
       addOrSubtract = 2;
    }

    let values = {
      product_id: product.cod,
      order_id: order,
      request_type: 2,
      delivery_type: 1,
      order_type: 1,
      price_type: priceType,
      addOrSubtract: addOrSubtract, // 1 sumar 2 restar
      quantity: quantity,
    };
console.log(values)

    try {
      setIsSending(true);
      const response = await postData(`sales`, "POST", values);
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
      <Modal.Header>Cambiar cantidad</Modal.Header>
      <Modal.Body>
        <div className="mx-4">

        <form className="max-w-lg mt-4" onSubmit={handleSubmit(onSubmit)} >

            <div className="w-full md:w-full px-3 mb-4">
              <label htmlFor="quantity" className={style.inputLabel} >Cantidad</label>
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
