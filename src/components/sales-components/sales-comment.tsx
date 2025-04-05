'use client'
import {  useEffect, useState } from "react";
import { Modal } from "flowbite-react";
import { Button, Preset } from "../button/button";
import { postData } from "@/services/resources";
import toast, { Toaster } from "react-hot-toast";
import { useForm } from "react-hook-form";
import { style } from "@/theme";

export interface SalesCommentModalProps {
    onClose: () => void;
    isShow?: boolean;
    order: any; // arreglo de la orden
}

export function SalesCommentModal(props: SalesCommentModalProps){
const { onClose, isShow, order } = props;
const [isSending, setIsSending] = useState(false);
const { register, handleSubmit, reset, setValue } = useForm();



const onSubmit = async (data: any) => {
    
    let values = {  comment: data.comment, order_id: order.id };
    try {
      setIsSending(true);
      const response = await postData(`order/comment/update`, "POST", values);
      if (response.type === "error") {
        toast.error(response.message);
      } else {
        reset()
        onClose()
      }
    } catch (error) {
      console.error(error);
      toast.error("Ha Ocurrido un Error!");
    } finally {
        setIsSending(false);
    }
  };

  useEffect(() => {
    if (isShow && order) {
      setValue('comment', order?.comment);
    }
  }, [isShow, setValue, order]);


return (
<Modal show={isShow} position="center" onClose={onClose} size="md">
  <Modal.Header>Agregar Comentario a la orden</Modal.Header>
  <Modal.Body>
    <div className="mx-4">
        <form className="max-w-lg mt-4" onSubmit={handleSubmit(onSubmit)} >
            <div className="w-full md:w-full px-3 mb-4">
                <label htmlFor="comment" className={style.inputLabel} >Comentario</label>
                <textarea rows={5} {...register("comment", { required: true })} className={`${style.input} w-full`} />
            </div>
            <div className="flex justify-center">
            <Button type="submit" disabled={isSending} preset={isSending ? Preset.saving : Preset.save} />
            </div>
        </form>
      <Toaster position="top-right" reverseOrder={false} />
    </div>
  </Modal.Body>
  <Modal.Footer className="flex justify-end">
    <Button onClick={onClose} preset={Preset.close} isFull disabled={isSending} /> 
  </Modal.Footer>
</Modal>)
}