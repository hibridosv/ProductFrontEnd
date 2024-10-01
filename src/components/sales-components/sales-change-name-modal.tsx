"use client";
import { useState, useEffect } from "react";
import { Modal } from "flowbite-react";
import { Button, Preset } from "../button/button";
import toast, { Toaster } from 'react-hot-toast';

import { style } from "@/theme";
import { useForm } from "react-hook-form";
import { postData } from "@/services/resources";


export interface SalesChangeNameModalProps {
  onClose: () => void;
  product: any;
  isShow: boolean;
  order: any;
}



export function SalesChangeNameModal(props: SalesChangeNameModalProps) {
  const { onClose, product, isShow, order } = props;
  const { register, handleSubmit, resetField, setFocus, setValue } = useForm();
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    if (product) {
      setValue("product", product?.product)
      setFocus('product', {shouldSelect: true})      
    }
  }, [setFocus, isShow, product, setValue])

  const onSubmit = async (data: any) => {
    if (data.product == null) onClose();
    let values = {
        product_id: product.id,
        order_id: order,
        product: data.product,
      };

    try {
        setIsSending(true);
        const response = await postData(`sales/update-name`, "POST", values);
        if (response.type === "error") {
          toast.error(response.message);
        } else {
          resetField("product")
        } 
      } catch (error) {
        console.error(error);
      } finally {
       setIsSending(false);
       onClose()
      }
  };

  return (
    <Modal show={isShow} position="center" onClose={onClose} size="xl">
      <Modal.Header>Cambiar Descripción</Modal.Header>
      <Modal.Body>
        <div className="mx-4">

        <form className="max-w-lg mt-4" onSubmit={handleSubmit(onSubmit)} >

            <div className="w-full md:w-full px-3 mb-4">
              <label htmlFor="product" className={style.inputLabel} >Descripción del producto</label>
              <textarea rows={8} {...register("product", { required: true, max:250, min:5 })} className={`${style.input} w-full`} />
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
