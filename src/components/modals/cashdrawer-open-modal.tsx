"use client";
import { useContext, useState } from "react";
import { Modal } from "flowbite-react";
import { Button, Preset } from "../button/button";
import toast, { Toaster } from 'react-hot-toast';
import { useForm } from "react-hook-form";
import {  postData } from "@/services/resources";
import { style } from "@/theme";
import { Alert } from "../alert/alert";
import { PresetTheme } from "@/services/enums";
import { ConfigContext } from "@/contexts/config-context";

export interface CashdrawerOpenModalProps {
  onClose: () => void;
  isShow?: boolean;
  drawer: string;
}

export function CashdrawerOpenModal(props: CashdrawerOpenModalProps) {
    const { onClose, isShow, drawer } = props;
    const { register, handleSubmit, resetField } = useForm();
    const [isSending, setIsSending] = useState(false);
    const [message, setMessage] = useState<any>({});
    const { setCashDrawer} = useContext(ConfigContext);



  const onSubmit = async (data: any) => {
    data.cash_id = drawer;
    try {
        setIsSending(true)
        const response = await postData("cashdrawers/open", "POST", data);
        if (response.type == "successful") {
            toast.success("Caja Aperturada");
            resetField("quantity");
            setMessage({});
            setCashDrawer(drawer);
            onClose();
        } else {
            toast.error("No se pudo aperturar la caja!");
            setMessage(response.message);
        }
    } catch (error) {
      console.error(error);
      toast.error("Ha Ocurrido un Error!");
    } finally {
      setIsSending(false)
    }
  };


  return (
    <Modal size="md" show={isShow} position="center" onClose={onClose}>
      <Modal.Header>Apertura de caja</Modal.Header>
      <Modal.Body>

        <div className="mx-4">
        <form className="max-w-lg mt-4" onSubmit={handleSubmit(onSubmit)} >
        
            <div className="w-full md:w-full px-3 mb-4">
                <label htmlFor="quantity" className={style.inputLabel} >Ingrese la cantidad de apertura </label>
                <input type="number" step="any" {...register("quantity", { min: 0 })} className={`${style.input} w-full`} />
            </div>

            <div className="flex justify-center">
            <Button type="submit" disabled={isSending} preset={isSending ? Preset.saving : Preset.save} />
            </div>
      </form>
        {message.errors && (
            <div className="mt-4">
                <Alert
                theme={PresetTheme.danger}
                info="Error"
                text={JSON.stringify(message.message)}
                isDismisible={false}
                />
            </div>
            )}
        </div>

      <Toaster position="top-right" reverseOrder={false} />
      </Modal.Body>
      <Modal.Footer className="flex justify-end gap-4">
        <Button onClick={onClose} preset={Preset.close} disabled={isSending} />
      </Modal.Footer>
    </Modal>
  );

}
