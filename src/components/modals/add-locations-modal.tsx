"use client";
import { useEffect, useState } from "react";
import { Modal } from "flowbite-react";
import { Button, Preset } from "../button/button";
import toast, { Toaster } from 'react-hot-toast';
import { useForm } from "react-hook-form";
import { postData } from "@/services/resources";
import { style } from "@/theme";
import { Alert } from "../alert/alert";
import { Loading } from "../loading/loading";
import { getRandomInt } from "@/utils/functions";
import { PresetTheme } from "@/services/enums";

export interface AddLocationsModalProps {
  onClose: () => void;
  isShow?: boolean;
}

export function AddLocationsModal(props: AddLocationsModalProps) {
  const { onClose, isShow } = props;
  const { register, handleSubmit, setFocus, reset } = useForm();
  const [isSending, setIsSending] = useState(false);

  const [message, setMessage] = useState<any>({});
  const [submited, setSubmited] = useState(getRandomInt(100));


      
      const onSubmit = async (data: any) => {
        try {
          setIsSending(true)
          const response = await postData("locations", "POST", data);
          if (response.type == "successful") {
            toast.success( "Ubicación Agregada correctamente");
            reset()
            onClose()
        } else {
          toast.error("Faltan algunos datos importantes!");
        }
        setMessage(response);
      } catch (error) {
        console.error(error);
        toast.error("Ha Ocurrido un Error!");
      } finally {
        setIsSending(false)
        setSubmited(getRandomInt(100))
      }
    };
    
    useEffect(() => {
      setFocus('name', {shouldSelect: true})
    }, [setFocus, isShow, submited])
    
  if (!isShow) return null;
  return (
    <Modal size="lg" show={isShow} position="center" onClose={onClose}>
      <Modal.Header>Agregar nueva ubicación</Modal.Header>
      <Modal.Body>

    { isSending ? <Loading /> : <>

      <form className="max-w-lg mt-4" onSubmit={handleSubmit(onSubmit)} >
        <div className="w-full md:w-full px-3 mb-4">
            <label htmlFor="name" className={style.inputLabel} >Nombre</label>
            <input {...register("name", {})} className={`${style.input} w-full`} />
        </div>

        <div className="w-full md:w-full px-3 mb-4">
            <label htmlFor="description" className={style.inputLabel} >Descripción</label>
            <input {...register("description", {})} className={`${style.input} w-full`} />
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
    </>
    }
      <Toaster position="top-right" reverseOrder={false} />
      </Modal.Body>
      <Modal.Footer className="flex justify-end gap-4">
        <Button onClick={onClose} preset={Preset.close} />
      </Modal.Footer>
    </Modal>
  );

}
