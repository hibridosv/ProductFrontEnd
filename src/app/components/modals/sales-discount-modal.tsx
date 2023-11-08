"use client";
import { useState, useEffect } from "react";
import { Modal } from "flowbite-react";
import { Button, Preset } from "../button/button";
import toast, { Toaster } from 'react-hot-toast';

import { style } from "@/theme";
import { useForm } from "react-hook-form";
import { postData } from "@/services/resources";
import { Button as Boton } from "flowbite-react";
import { sumarDiscount, sumarTotales, sumarTotalesWithoutDIscount } from "@/utils/functions";


export interface SalesDiscountProductModalProps {
  onClose: () => void;
  product: any;
  isShow: boolean;
  order: any;
  discountType: number;
}



export function SalesDiscountProductModal(props: SalesDiscountProductModalProps) {
  const { onClose, product, isShow, order, discountType } = props;
  const { register, handleSubmit, resetField, setFocus } = useForm();
  const [isSending, setIsSending] = useState(false);
  const [typeOfDiscount, setTypeOfDiscount] = useState(1);

  useEffect(() => {
    setFocus('quantity', {shouldSelect: true})
  }, [setFocus, isShow, typeOfDiscount])

  const onSubmit = async (data: any) => {
    let values = {
        product_id: product.id,
        order: order.id,
        typeOfDiscount: typeOfDiscount,
        quantityDiscount: data.quantity,
      };
      try {
        setIsSending(true);
        const response = await postData(discountType == 1 ? `sales/update-discount` :  `sales/update-discount-all`, "POST", values);
        if (response.type === "error") {
            toast.error(response.message);
          } else {
            resetField("quantity")
          } 
      } catch (error) {
        console.error(error);
        toast.error("Ha Ocurrido un Error!");
      } finally {
        setIsSending(false);
        onClose()
      }
  };

  return (
    <Modal show={isShow} position="center" onClose={onClose} size="md">
    <Modal.Header>Descuento a {discountType == 1 ? "Producto" : "Orden"}</Modal.Header>
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
                { isSending ? <Button disabled={true} preset={Preset.saving} /> : <Button type="submit" preset={Preset.save} /> }
              </div>
        </form>

        <div className="mt-4  border-b-2 flex justify-between">
          <span>Precio sin descuento:</span> $ {discountType == 1 ? (parseFloat(product?.discount ? product?.discount : 0) + parseFloat(product?.total ? product.total : 0)).toFixed(2) : sumarTotalesWithoutDIscount(order?.invoiceproducts)}
        </div>
        <div className="mt-1 border-b-2 flex justify-between">
          <span>Descuento aplicado:</span> $ {discountType == 1 ? (product?.discount ? product?.discount : 0).toFixed(2)  : sumarDiscount(order?.invoiceproducts)}
        </div>
        <div className="mt-1 border-b-2 flex justify-between">
          <span>Total con descuento:</span> $ {discountType == 1 ? (product?.total ? product?.total : 0).toFixed(2)  : sumarTotales(order?.invoiceproducts)}
        </div>
        </div>
      <Toaster position="top-right" reverseOrder={false} />
      </Modal.Body>
      <Modal.Footer className="flex justify-end">
        <Button onClick={onClose} preset={Preset.close} isFull /> 
      </Modal.Footer>
    </Modal>
  );
}
