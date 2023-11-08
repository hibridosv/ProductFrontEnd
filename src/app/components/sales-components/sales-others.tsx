'use client'
import {  useState } from "react";
import { Modal } from "flowbite-react";
import { Button, Preset } from "../button/button";
import { postData } from "@/services/resources";
import toast, { Toaster } from "react-hot-toast";
import { useForm } from "react-hook-form";
import { style } from "@/theme";

export interface SalesOthersProps {
    onClose: () => void;
    isShow?: boolean;
    order: any; // arreglo de la orden
}

export function SalesOthers(props: SalesOthersProps){
const { onClose, isShow, order } = props;
const [isSending, setIsSending] = useState(false);
const { register, handleSubmit, reset } = useForm();



const onSubmit = async (data: any) => {
    
    if (!data.quantity || !data.description){
        toast.error("Ingrese ambos datos");
        return
    }
    let values = {
        description: data.description,
        quantity: data.quantity,
        order_id: order.id,
    };
    try {
      setIsSending(true);
      const response = await postData(`sales/other/sales`, "POST", values);
      if (response.type === "error") {
        toast.error(response.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("Ha Ocurrido un Error!");
    } finally {
        setIsSending(false);
        reset()
        onClose()
    }
  };



return (
<Modal show={isShow} position="center" onClose={onClose} size="md">
  <Modal.Header>Otras ventas</Modal.Header>
  <Modal.Body>
    <div className="mx-4">
        <form className="max-w-lg mt-4" onSubmit={handleSubmit(onSubmit)} >
            <div className="w-full md:w-full px-3 mb-4">
                <label htmlFor="description" className={style.inputLabel} >Descripción</label>
                <input type="text" {...register("description", { required: true })} className={`${style.input} w-full`} />
            </div>
            <div className="w-full md:w-full px-3 mb-4">
                <label htmlFor="quantity" className={style.inputLabel} >Precio</label>
                <input type="number" step="any" {...register("quantity", { required: true })} className={`${style.input} w-full`} />
            </div>
            <div className="flex justify-center">
                { isSending ? <Button disabled={true} preset={Preset.saving} /> : <Button type="submit" preset={Preset.save} /> }
            </div>
        </form>
      <Toaster position="top-right" reverseOrder={false} />
    </div>
  </Modal.Body>
  <Modal.Footer className="flex justify-end">
    <Button onClick={onClose} preset={Preset.close} isFull /> 
  </Modal.Footer>
</Modal>)
}