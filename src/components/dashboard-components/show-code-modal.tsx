'use client'
import { Modal } from "flowbite-react";
import { Button, Preset } from "../button/button";
import { md5 } from "js-md5";
import { dateToNumberValidate } from "@/utils/functions";


export interface ShowCodeModalProps {
    onClose: () => void;
    isShow?: boolean;
}

export function ShowCodeModal(props: ShowCodeModalProps){
const { onClose, isShow} = props;
const code = md5(dateToNumberValidate()).substring(0, 4).toUpperCase()

return (
<Modal show={isShow} position="center" onClose={onClose} size="sm">
  <Modal.Header>CODIGO DE SEGURIDAD</Modal.Header>
  <Modal.Body>
        <div className=" text-3xl text-cyan-950 font-bold text-center"> { code } </div>
  </Modal.Body>
  <Modal.Footer className="flex justify-end">
    <Button onClick={onClose} preset={Preset.close} isFull /> 
  </Modal.Footer>
</Modal>)
}