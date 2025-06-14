"use client";
import { useState } from "react";
import { Modal } from "flowbite-react";
import { Button, Preset } from "../button/button";
import { postData } from "@/services/resources";
import toast, { Toaster } from 'react-hot-toast';
import { Loading } from "../loading/loading";
import { useForm } from "react-hook-form";
import { style } from "@/theme";
import { Alert } from "../alert/alert";
import { PresetTheme } from "@/services/enums";



export interface ConfigNameUserModalProps {
  onClose: () => void;
  isShow: boolean;
  user: any; 
  random: (value: number) => void;
}

export function ConfigNameUserModal(props: ConfigNameUserModalProps) {
  const { onClose, isShow, user, random } = props;
  const [isSending, setIsSending] = useState(false);
  const [message, setMessage] = useState<any>({});
  const { register, handleSubmit, reset} = useForm();


      const onSubmit = async (data: any) => {
        try {
          setIsSending(true)
          const response = await postData(`users/${user.id}/name`, "PUT", data);
          if (response.type == "successful") {
            toast.success("Nombre de usuario actualizado correctamente");
            reset()
            setMessage({});
            random && random(Math.random());
            onClose()
          } else {
            toast.error("Faltan algunos datos importantes!");
            setMessage(response);
          }
        } catch (error) {
          console.error(error);
          toast.error("Ha ocurrido un error!");
        } finally {
          setIsSending(false)
        }
      }

  return (
    <Modal size="md" show={isShow} position="center" onClose={onClose}>
      <Modal.Header>CAMBIAR NOMBRE DE USUARIO</Modal.Header>
      <Modal.Body>
      <div className="mx-4"> 
          <form onSubmit={handleSubmit(onSubmit)} className="w-full">
            <div className="flex flex-wrap -mx-3 mb-6">

              <div className="w-full md:w-full px-3 mb-2">
                <label htmlFor="name" className={style.inputLabel}>Nombre de usuario *</label>
                <input  type="text"  id="name" {...register("name")} className={style.input} />
              </div>

            </div>

            {message.errors && (
              <div className="mb-4">
                <Alert
                  theme={PresetTheme.danger}
                  info="Error"
                  text={JSON.stringify(message.message)}
                  isDismisible={false}
                />
              </div>
            )}

            <div className="flex justify-center">
              <Button type="submit" disabled={isSending} preset={isSending ? Preset.saving : Preset.save} />
            </div>

          </form>

      </div>
      <Toaster position="top-right" reverseOrder={false} />
      </Modal.Body>
      <Modal.Footer className="flex justify-end gap-4">
        <Button onClick={onClose} preset={Preset.close} disabled={isSending} />
      </Modal.Footer>
    </Modal>
  );
}
