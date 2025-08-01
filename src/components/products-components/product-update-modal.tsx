"use client";
import { useState } from "react";
import { Modal } from "flowbite-react";
import { Button, Preset } from "../button/button";
import { useForm } from "react-hook-form";
import toast, { Toaster } from 'react-hot-toast';

import { postData } from "@/services/resources";
import { Product } from "@/services/products";
import { style } from "../../theme";

export interface ProductUpdateModalProps {
  onClose: () => void;
  field?: any;
  type?: string;
  text?: string;
  product?: Product | any;
  isShow?: boolean;
}

export function ProductUpdateModal(props: ProductUpdateModalProps) {
  const { onClose, text, field, type, product, isShow } = props;
  const { register, handleSubmit, reset } = useForm();
  const [isSending, setIsSending] = useState(false);

  

  const onSubmit = async (data: any) => {
    product[field] = data[field];
    try {
      setIsSending(true)
      const response = await postData(`products/${product?.id}`, "PUT", product);
      if (!response.message) {
        toast.success( "Producto Actualizado correctamente");
        onClose()
        reset();
      } else {
        toast.error("Faltan algunos datos importantes");
      }
    } catch (error) {
      console.error(error);
      toast.error("Ha ocurrido un error!");
    } finally {
      setIsSending(false)
    }
  };
  if (!text && !field && !type) {
    return <div></div>
  }

  return (
    <Modal size="lg" show={isShow} position="center" onClose={onClose}>
      <Modal.Header>{text}</Modal.Header>
      <Modal.Body>
        <div className="mx-4">

          <div className="flex justify-center my-4">
            <form onSubmit={handleSubmit(onSubmit)} className="w-full mx-6">
              <div className="flex flex-wrap -mx-3 mb-6">
                <div className="w-full px-3 mb-2">
                  <label htmlFor={field} className={style.inputLabel} >
                    {text}
                  </label>
                  <input
                    type={type}
                    id={field}
                    {...register(field)}
                    className={style.input}
                    step="any"
                  />
                </div>
              </div>
              <div className="flex justify-center">
              <Button type="submit" disabled={isSending} preset={isSending ? Preset.saving : Preset.save} />
              </div>
            </form>
          </div>
        </div>
      <Toaster position="top-right" reverseOrder={false} />
      </Modal.Body>
      <Modal.Footer className="flex justify-end gap-4">
        <Button onClick={onClose} preset={Preset.close} />
      </Modal.Footer>
    </Modal>
  );
}
