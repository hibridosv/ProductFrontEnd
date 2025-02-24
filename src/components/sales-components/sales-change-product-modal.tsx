"use client";
import { useState, useEffect } from "react";
import { Modal } from "flowbite-react";
import { Button, Preset } from "../button/button";
import toast, { Toaster } from 'react-hot-toast';

import { style } from "@/theme";
import { useForm } from "react-hook-form";
import { postData } from "@/services/resources";


export interface SalesChangeProductModalProps {
  onClose: () => void;
  product: any;
  isShow: boolean;
  rowToUpdate: "comment" | "product";
  order: any;
}



export function SalesChangeProductModal(props: SalesChangeProductModalProps) {
  const { onClose, product, isShow, order, rowToUpdate } = props;
  const { register, handleSubmit, resetField, setFocus, setValue } = useForm();
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    if (product) {
      if (rowToUpdate) {
        setValue("value", product[rowToUpdate]);
        setFocus('value', { shouldSelect: true });
      }
    }
  }, [setFocus, isShow, product, setValue, rowToUpdate]);

  const onSubmit = async (data: any) => {
    if (data.value == null) onClose();
    let values = {
        product_id: product.id,
        order_id: order,
        value: data.value,
        row_to_update: rowToUpdate
      };

    try {
        setIsSending(true);
        const response = await postData(`sales/product/update`, "POST", values);
        if (response.type === "error") {
          toast.error(response.message);
        } else {
          resetField("value")
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
      <Modal.Header>Cambiar {rowToUpdate == "comment" ? "comentario" : "nombre"} del Producto</Modal.Header>
      <Modal.Body>
        <div className="mx-4">

        <form className="max-w-lg mt-4" onSubmit={handleSubmit(onSubmit)} >

            <div className="w-full md:w-full px-3 mb-4">
              <label htmlFor="value" className={style.inputLabel} >Comentario del producto</label>
              <textarea rows={8} {...register("value", { required: true, max:250, min:5 })} className={`${style.input} w-full`} />
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
