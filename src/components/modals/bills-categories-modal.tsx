"use client";
import { useEffect, useState } from "react";
import { Modal } from "flowbite-react";
import { Button, Preset } from "../button/button";
import toast, { Toaster } from 'react-hot-toast';
import { useForm } from "react-hook-form";
import { getData, postData } from "@/services/resources";
import { style } from "@/theme";
import { Provider } from "@/services/products";
import { Alert } from "../alert/alert";
import { Loading } from "../loading/loading";
import { getRandomInt } from "@/utils/functions";
import { PresetTheme } from "@/services/enums";

export interface BillsCategoriesModalProps {
  onClose: () => void;
  isShow?: boolean;
}

export function BillsCategoriesModal(props: BillsCategoriesModalProps) {
  const { onClose, isShow } = props;
  const { register, handleSubmit, resetField, setFocus } = useForm();
  const [isSending, setIsSending] = useState(false);
  const [message, setMessage] = useState<any>({});


  const onSubmit = async (data: any) => {
    try {
      setIsSending(true)
      const response = await postData("cash/categories", "POST", data);
      if (response.type == "successful") {
        toast.success( "Categoria Agregada correctamente");
        resetField("name")
        onClose()
      } else {
        toast.error("Faltan algunos datos importantes!");
        setMessage(response);
      }
    } catch (error) {
      console.error(error);
      toast.error("Ha Ocurrido un Error!");
    } finally {
      setIsSending(false)
    }
  };

  return (
    <Modal size="sm" show={isShow} position="center" onClose={onClose}>
      <Modal.Header>Agregar nueva categoria</Modal.Header>
      <Modal.Body>

      <form className="max-w-lg mt-4" onSubmit={handleSubmit(onSubmit)} >
        <div className="w-full md:w-full px-3 mb-4">
            <label htmlFor="name" className={style.inputLabel} >Categoria</label>
            <input {...register("name", {})} className={`${style.input} w-full`} />
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
      <Toaster position="top-right" reverseOrder={false} />
      </Modal.Body>
      <Modal.Footer className="flex justify-end gap-4">
        <Button onClick={onClose} preset={Preset.close} />
      </Modal.Footer>
    </Modal>
  );

}
