"use client";

import { Modal } from "flowbite-react";
import { Button, Preset } from "../button/button";
import { useState } from "react";
import toast, { Toaster } from 'react-hot-toast';
import { getData, postData } from "@/services/resources";
import { useForm } from "react-hook-form";
import { style } from "@/theme";


// Props del componente
interface EmailSendModalProps {
  record: any;
  onClose: () => void;
  isShow: boolean;
}


export function EmailSendModal(props: EmailSendModalProps) {
  const { onClose, record, isShow } = props;
  const [showEmailDefault, setShowEmailDefault] = useState<boolean>(true);
  const [isSending, setIsSending] = useState(false);
  const { register, handleSubmit } = useForm();

  const sendMail = async(email: any) => {
    let payload = {
        clientId: record?.client_id,
        codigo: record?.codigo_generacion,
        email: email
    }
    try {
        setIsSending(true);
        const response = await postData(`electronic/send/email`, 'POST', payload);
        if (response?.type == "error") {
          toast.error("Ocurrio un error");
        } else {
          toast.success("Email enviado correctamente");
        }
      } catch (error) {
        console.error(error);
        toast.error("Ha ocurrido un error!");
      } finally {
        setIsSending(false);
      }
  }

  const onSubmit = async(data: any) => {
    if (!data.email) {
        toast.error("Ingrese un email");
        return;
    }
    sendMail(data.email)
  }



  return (
    <Modal size="xl" show={isShow} position="center" onClose={onClose}>
      <Modal.Header>REENVIAR EMAIL</Modal.Header>
      <Modal.Body>
             <div>
                <div className="w-full flex justify-between">
                    <div onClick={!showEmailDefault ? ()=>setShowEmailDefault(!showEmailDefault) : ()=>{}} className={`w-full p-2 text-center ${!showEmailDefault ? ' bg-slate-200 clickeable' : ' bg-slate-600 text-white'}`}>Enviar al Cliente</div>
                    <div onClick={showEmailDefault ? ()=>setShowEmailDefault(!showEmailDefault) : ()=>{}} className={`w-full p-2 text-center ${showEmailDefault ? ' bg-slate-200 clickeable' : ' bg-slate-600 text-white'}`}>Enviar a Otro</div>
                </div>
                <div>
                    {
                        showEmailDefault ? 
                        <div className="m-4">
                            <Button disabled={isSending} isFull preset={isSending ? Preset.saving : Preset.save} text={isSending ? "Enviando Email" : "Reenviar email"} onClick={()=>sendMail(null)} />
                        </div> :
                        <div>
                            
                        <form onSubmit={handleSubmit(onSubmit)} className="pb-4 border-2 shadow-lg rounded-md">
                            <div className="flex flex-wrap mx-3 mb-2 ">
                                <div className="w-full md:w-full px-3 mb-2">
                                    <label htmlFor="email" className={style.inputLabel}> Numero de Nota de credito *</label>
                                    <input type="email" id="email" {...register("email")} className={style.input} />
                                </div>
                            </div>
                            <div className="flex justify-center">
                            <Button type="submit" isFull disabled={isSending} preset={isSending ? Preset.saving : Preset.save} text={isSending ? "Enviando Email" : "Reenviar email"} />
                            </div>
                        </form>


                        </div>
                    }
                </div>
            </div>
      </Modal.Body>
      <Modal.Footer className="flex justify-end gap-4"> 
        <Button onClick={onClose} preset={Preset.close} />
      </Modal.Footer>
      <Toaster position="top-right" reverseOrder={false} />
    </Modal>
  );
}
