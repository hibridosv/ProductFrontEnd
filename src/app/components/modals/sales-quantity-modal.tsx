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


export interface SalesQuantityModalProps {
  onClose: () => void;
  product: Product;
  isShow: boolean;
  order: any;
}



export function SalesQuantityModal(props: SalesQuantityModalProps) {
  const { onClose, product, isShow, order } = props;
  const { register, handleSubmit, resetField, setFocus, setValue } = useForm();
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    setValue("quantity", product.quantity)
    setFocus('quantity', {shouldSelect: true})
  }, [setFocus, isShow])


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
    console.log(quantity)

    let values = {
      product_id: product.cod,
      order_id: order,
      request_type: 2,
      delivery_type: 1,
      order_type: 1,
      price_type: 1,
      addOrSubtract: addOrSubtract, // 1 sumar 2 restar
      quantity: quantity,
    };

    try {
      setIsSending(true);
      const response = await postData(`sales`, "POST", values);
      if (response.type === "error") {
        toast.error(response.message, { autoClose: 2000 });
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
