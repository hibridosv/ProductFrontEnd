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



export interface ConfigPasswordUserModalProps {
  onClose: () => void;
  isShow: boolean;
  user: any; 
}

export function ConfigPasswordUserModal(props: ConfigPasswordUserModalProps) {
  const { onClose, isShow, user } = props;
  const [isSending, setIsSending] = useState(false);
  const [message, setMessage] = useState<any>({});
  const { register, handleSubmit, reset} = useForm();


      const onSubmit = async (data: any) => {
        data.user = user.id
        try {
          setIsSending(true)
          const response = await postData(`register`, "PUT", data);
          if (response.type == "successful") {
            toast.success("Password actualizado correctamente");
            reset()
            setMessage({});
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
      <Modal.Header>CAMBIAR PASSWORD</Modal.Header>
      <Modal.Body>
      <div className="mx-4"> 
          <form onSubmit={handleSubmit(onSubmit)} className="w-full">
            <div className="flex flex-wrap -mx-3 mb-6">

              <div className="w-full md:w-full px-3 mb-2">
                <label htmlFor="password" className={style.inputLabel}>Password *</label>
                <input  type="password"  id="password" {...register("password")} className={style.input} />
              </div>

              <div className="w-full md:w-full px-3 mb-2">
                <label htmlFor="password_confirmation" className={style.inputLabel}>Repeat Password *</label>
                <input type="password" id="password_confirmation" {...register("password_confirmation")} className={style.input} />
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


      </Modal.Body>
      <Modal.Footer className="flex justify-end gap-4">
        <Button onClick={onClose} preset={Preset.close} disabled={isSending} />
      </Modal.Footer>
    <Toaster position="top-right" reverseOrder={false} />
    </Modal>
  );
}
