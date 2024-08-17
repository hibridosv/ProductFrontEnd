"use client";
import { Modal } from "flowbite-react";
import { Button, Preset } from "../button/button";
import { style } from "@/theme";
import { useForm } from "react-hook-form";
import { useState } from "react";
import toast, { Toaster } from 'react-hot-toast';
import { postData } from "@/services/resources";


export interface AdjustmentUpdateModalProps {
    onClose: () => void;
    isShow: boolean;
    record?: any;
    sendAdjustment?: (value: any) => void
    random?: (value: number) => void;
}

export function AdjustmentUpdateModal(props: AdjustmentUpdateModalProps) {
    const { onClose, isShow, record, random } = props;
    const [sales, setSales] = useState(null as any);
    const [isSending, setIsSending] = useState(false);
    const [isPaying, setIsPaying] = useState(false);
    const { register, handleSubmit, resetField, setFocus } = useForm();

    const onSubmit = async (data: any) => {
        record.stablished = data.stablished
        try {
          setIsSending(true);
          const response = await postData(`adjustment/update`, "POST", record);
            if (response.type == "successful") {
                random && random(Math.random());
                toast.success("Ajuste completado correctamente");  
                onClose()
            } else {
              toast.error("Error al finalizar!");
            }
        } catch (error) {
          console.error(error);
          toast.error("Ha ocurrido un error!");
        } finally {
          setIsSending(false);
        }
      };


  return (
    <Modal size="md" show={isShow} position="center" onClose={onClose}>
      <Modal.Header>ACTUALIZAR CANTIDAD</Modal.Header>
      <Modal.Body>
      <form className="max-w-lg mt-4" onSubmit={handleSubmit(onSubmit)} >
        
        <div className="w-full md:w-full px-3 mb-4">
            <label htmlFor="stablished" className={style.inputLabel} >Cantidad </label>
            <input {...register("stablished", {})} className={`${style.input} w-full`} />
        </div>

            <div className="flex justify-center">
            <Button type="submit" disabled={isSending} preset={isSending ? Preset.saving : Preset.save} />
            </div>
      </form>
      </Modal.Body>
      <Modal.Footer className="flex justify-end gap-4">
        <Button onClick={onClose} preset={Preset.close} />
      </Modal.Footer>
    </Modal>
  );
}
