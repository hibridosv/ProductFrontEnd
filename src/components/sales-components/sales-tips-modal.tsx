"use client";
import { useState, useEffect } from "react";
import { Modal } from "flowbite-react";
import { Button, Preset } from "../button/button";
import toast, { Toaster } from 'react-hot-toast';
import { style } from "@/theme";
import { useForm } from "react-hook-form";
import { postData } from "@/services/resources";
import { Button as Boton } from "flowbite-react";
import {  sumarCantidad } from "@/utils/functions";


export interface SalesTipsModalProps {
  onClose: () => void;
  isShow: boolean;
  order: any;
}



export function SalesTipsModal(props: SalesTipsModalProps) {
  const { onClose, isShow, order } = props;
  const { register, handleSubmit, resetField, setFocus } = useForm();
  const [isSending, setIsSending] = useState(false);
  const [typeOfDiscount, setTypeOfDiscount] = useState(1);


  useEffect(() => {
    setFocus('quantity', {shouldSelect: true})
  }, [setFocus, isShow, typeOfDiscount])

  
  const onSubmit = async (data: any) => {
    if (!data.quantity || data.quantity < 0) {
        toast.error("Debe ingresar una cantidad o porcentaje válido.");
        return; 
    }
    const total = sumarCantidad(order?.invoiceproducts);
    let tipValue: number;
    let percentageValue: number;

    if (typeOfDiscount === 2) {
        percentageValue = parseFloat(data.quantity);
        tipValue = (percentageValue / 100) * total;
    } else {
        tipValue = parseFloat(data.quantity);
        percentageValue = (tipValue / total) * 100;
    }
    
    let values = {
        order_id: order.id,
        type_tip: typeOfDiscount,
        tips: tipValue,
        percentage: percentageValue,
    };

    try {
        setIsSending(true);
        const response = await postData(`sales/tips/update`, "POST", values);
        if (response.type === "error") {
            toast.error(response.message);
        } else {
            resetField("quantity");
        }
    } catch (error) {
        console.error(error);
        toast.error("Ha Ocurrido un Error!");
    } finally {
        setIsSending(false);
        onClose();
    }
};

  if (!isShow) return <></>;

  return (
    <Modal show={isShow} position="center" onClose={onClose} size="md">
    <Modal.Header>Establecer Propina</Modal.Header>
      <Modal.Body>
        <Boton.Group className="w-full">
            <Boton color={ typeOfDiscount == 1 ? "dark" : "light" } fullSized={true} onClick={() => setTypeOfDiscount(1)} >
            Cantidad
            </Boton>
            <Boton color={ typeOfDiscount == 2 ? "dark" : "light" } fullSized={true} onClick={() => setTypeOfDiscount(2)} >
            Porcentaje
            </Boton>
        </Boton.Group>

        <div className="mx-4">

        <form className="max-w-lg mt-4" onSubmit={handleSubmit(onSubmit)} >

            <div className="w-full md:w-full px-3 mb-4">
              <label htmlFor="quantity" className={style.inputLabel} >{ typeOfDiscount == 1 ? "Cantidad" : "Porcentaje" }</label>
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
