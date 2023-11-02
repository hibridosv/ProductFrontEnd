"use client";
import { useState, useEffect } from "react";
import { Modal } from "flowbite-react";
import { Button, Preset } from "../button/button";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { style } from "@/theme";
import { useForm } from "react-hook-form";
import { postData } from "@/services/resources";
import { Product } from "@/services/products";
import { Button as Boton } from "flowbite-react";


export interface SalesDiscountProductModalProps {
  onClose: () => void;
  product: Product;
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
        order: order,
        typeOfDiscount: typeOfDiscount,
        quantityDiscount: data.quantity,
      };
      try {
        setIsSending(true);
        const response = await postData(discountType == 1 ? `sales/update-discount` :  `sales/update-discount-all`, "POST", values);
        if (response.type === "error") {
            toast.error(response.message, { autoClose: 2000 });
          } else {
            resetField("quantity")
          } 
      } catch (error) {
        console.error(error);
        toast.error("Ha Ocurrido un Error!", { autoClose: 2000 });
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

        </div>
      </Modal.Body>
      <Modal.Footer className="flex justify-end">
        <Button onClick={onClose} preset={Preset.close} isFull /> 
      </Modal.Footer>
      <ToastContainer />
    </Modal>
  );
}
