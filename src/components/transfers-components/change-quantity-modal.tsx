"use client";
import {  useEffect, useState } from "react";
import { Modal } from "flowbite-react";
import { Button, Preset } from "../button/button";
import { useForm } from "react-hook-form";
import toast, { Toaster } from 'react-hot-toast';
import { postData } from "@/services/resources";
import { style } from "../../theme";


export interface ChangeQuantityModalProps {
  onClose: () => void;
  isShow: boolean;
  handleUpdateQuantity: (quantity: number) => void
}

export function ChangeQuantityModal(props: ChangeQuantityModalProps) {
  const { onClose, isShow, handleUpdateQuantity } = props;
  const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm();

  useEffect(() => {
    if (isShow) {
        setValue("quantity", null);
    }
  }, [isShow, setValue]);


  const onSubmit = async (data: any) => {
      if (!data.quantity) {
          toast.error("Ingrese la cantidad");
          return false; }
        handleUpdateQuantity(data.quantity);
        onClose();
  };



  return (
    <Modal size="sm" show={isShow} position="center" onClose={onClose}>
      <Modal.Header>AGREGAR NUEVO PRECIO</Modal.Header>
      <Modal.Body>
        <div className="mx-4">

        <form onSubmit={handleSubmit(onSubmit)} className="w-full">
              <div className="flex flex-wrap -mx-3">

                <div className="w-full md:w-full px-3 mb-2">
                    <label htmlFor="quantity" className={style.inputLabel}>Cantidad *</label>
                    <input type="text" id="quantity" {...register("quantity")} 
                    onBlur={(e) => setValue('taxpayer', e.target.value)} className={style.input} />
                </div>

            </div>

            <div className="flex justify-center mt-4">
                <Button type="submit" preset={Preset.save} />
            </div>
        </form>

        </div>
      <Toaster position="top-right" reverseOrder={false} />
      </Modal.Body>
      <Modal.Footer className="flex justify-end gap-4">
        <Button onClick={onClose} preset={Preset.close} />
      </Modal.Footer>
    </Modal>
  );
}
