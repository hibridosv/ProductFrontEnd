"use client";
import { useState, useEffect } from "react";
import { Modal } from "flowbite-react";
import { Button, Preset } from "../button/button";
import toast, { Toaster } from 'react-hot-toast';
import { style } from "@/theme";
import { useForm } from "react-hook-form";
import { postData } from "@/services/resources";


export interface SalesNameOrderModalProps {
  onClose: () => void;
  isShow: boolean;
  order: any;
}



export function SalesNameOrderModal(props: SalesNameOrderModalProps) {
  const { onClose, isShow, order } = props;
  const { register, handleSubmit, resetField, setFocus, setValue } = useForm();
  const [isSending, setIsSending] = useState(false);

  console.log("order", order?.attributes?.table?.name);

  useEffect(() => {
    setFocus('name_table', {shouldSelect: true})
    setValue("name_table", order?.attributes?.table?.identification || "");
  }, [setFocus, setValue, isShow])

  
  const onSubmit = async (data: any) => {
    data.order_id = order.id;
    try {
        setIsSending(true);
        const response = await postData(`orders/restaurant/name-table/update`, "POST", data);
        if (response.type === "error") {
            toast.error(response.message);
        } else {
            resetField("name_table");
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
    <Modal.Header>Establecer nombre de mesa</Modal.Header>
      <Modal.Body>
        <div className="mx-4">
        <form className="max-w-lg mt-4" onSubmit={handleSubmit(onSubmit)} >

            <div className="w-full md:w-full px-3 mb-4">
              <label htmlFor="name_table" className={style.inputLabel} >Nombre de la mesa</label>
              <input type="text" {...register("name_table", { required: true })} className={`${style.input} w-full`} />
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
