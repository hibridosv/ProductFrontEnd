"use client";
import { useState, useEffect } from "react";
import { Modal } from "flowbite-react";
import { Button, Preset } from "../button/button";
import toast, { Toaster } from 'react-hot-toast';

import { style } from "@/theme";
import { useForm } from "react-hook-form";
import { postData } from "@/services/resources";


export interface SalesChangeCommentModalProps {
  onClose: () => void;
  product: any;
  isShow: boolean;
  order: any;
}



export function SalesChangeCommentModal(props: SalesChangeCommentModalProps) {
  const { onClose, product, isShow, order } = props;
  const { register, handleSubmit, resetField, setFocus, setValue } = useForm();
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    if (product) {
      setValue("comment", product?.comment)
      setFocus('comment', {shouldSelect: true})      
    }
  }, [setFocus, isShow, product, setValue])

  const onSubmit = async (data: any) => {
    if (data.comment == null) onClose();
    let values = {
        product_id: product.id,
        order_id: order,
        comment: data.comment,
      };

    try {
        setIsSending(true);
        const response = await postData(`sales/update-comment`, "POST", values);
        if (response.type === "error") {
          toast.error(response.message);
        } else {
          resetField("comment")
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
      <Modal.Header>Cambiar Comentario del Producto</Modal.Header>
      <Modal.Body>
        <div className="mx-4">

        <form className="max-w-lg mt-4" onSubmit={handleSubmit(onSubmit)} >

            <div className="w-full md:w-full px-3 mb-4">
              <label htmlFor="comment" className={style.inputLabel} >Comentario del producto</label>
              <textarea rows={8} {...register("comment", { required: true, max:250, min:5 })} className={`${style.input} w-full`} />
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
