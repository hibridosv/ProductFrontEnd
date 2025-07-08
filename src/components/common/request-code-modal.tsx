'use client'
import {  useEffect } from "react";
import { Modal } from "flowbite-react";
import { Button, Preset } from "../button/button";
import toast, { Toaster } from "react-hot-toast";
import { useForm } from "react-hook-form";
import { style } from "@/theme";
import { Alert } from "../alert/alert";
import { PresetTheme } from "@/services/enums";

export interface RequestCodeModalProps {
    onClose: () => void;
    isShow?: boolean;
    verifiedCode: (code: string)=>void; // arreglo de la orden
    isShowError: boolean;
    setIsShowError: ()=>void;
}

export function RequestCodeModal(props: RequestCodeModalProps){
const { onClose, isShow, verifiedCode, isShowError, setIsShowError } = props;
const { register, handleSubmit, setValue } = useForm();



const onSubmit = async (data: any) => {
    if (!data.code){
        toast.error("Ingrese su código");
        return
    }
    if (data.code.length < 4){
        toast.error("El código debe tener al menos 4 digitos");
        return
    }
    verifiedCode(data.code)
  };

  useEffect(() => {
    if (isShow) {
      setValue('code', null);
    }
    if (isShowError) {
        toast.error("Código incorrecto!");
        setIsShowError();
    }
  }, [isShow, setValue, isShowError, setIsShowError]);

return (
<Modal show={isShow} position="center" onClose={onClose} size="sm">
  <Modal.Header>INGRESE SU CODIGO</Modal.Header>
  <Modal.Body>
    <Alert info="Importante: " text="Necesita permisos para usar esta opción, ingrese el código de seguridad" theme={PresetTheme.danger} isDismisible={false} />
    <div className="mx-4">
        <form className="max-w-lg mt-4" onSubmit={handleSubmit(onSubmit)} >
            <div className="w-full md:w-full px-3 mb-4">
                <label htmlFor="code" className={style.inputLabel} >Código</label>
                <input type="text" autoComplete="off" maxLength={4} {...register("code")} className={`${style.input} w-full`} />
            </div>
            <div className="flex justify-center">
            <Button type="submit"  preset={Preset.save} />
            </div>
        </form>
    </div>
    <Toaster position="top-right" reverseOrder={false} />
  </Modal.Body>
  <Modal.Footer className="flex justify-end">
    <Button onClick={onClose} preset={Preset.close} isFull /> 
  </Modal.Footer>
</Modal>)
}