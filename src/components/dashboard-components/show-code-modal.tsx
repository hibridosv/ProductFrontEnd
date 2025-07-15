'use client'
import { Modal } from "flowbite-react";
import { Button, Preset } from "../button/button";
import { md5 } from "js-md5";
import { dateToNumberValidate } from "@/utils/functions";
import { useEffect, useState } from "react";


export interface ShowCodeModalProps {
    onClose: () => void;
    isShow?: boolean;
}

export function ShowCodeModal(props: ShowCodeModalProps){
const { onClose, isShow} = props;
const [generatedCode, setGeneratedCode] = useState<string>('');

// Generar el código de seguridad
// Aquí puedes usar la función md5 para generar un código basado en la fecha actual
// y luego tomar los primeros 4 caracteres en mayúsculas.
useEffect(() => {
  if (!isShow){
    const code = md5(dateToNumberValidate()).substring(0, 4).toUpperCase();
    setGeneratedCode(code);
  }
  
}, [isShow]);

if (!isShow) return <></>;

return (
<Modal show={isShow} position="center" onClose={onClose} size="sm">
  <Modal.Header>CODIGO DE SEGURIDAD</Modal.Header>
  <Modal.Body>
        <div className=" text-3xl text-cyan-950 font-bold text-center"> { generatedCode } </div>
  </Modal.Body>
  <Modal.Footer className="flex justify-end">
    <Button onClick={onClose} preset={Preset.close} isFull /> 
  </Modal.Footer>
</Modal>)
}