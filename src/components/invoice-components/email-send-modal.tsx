"use client";

import { Modal } from "flowbite-react";
import { Button, Preset } from "../button/button";
import { useState } from "react";

// Props del componente
interface EmailSendModalProps {
  record: any;
  onClose: () => void;
  isShow: boolean;
}


export function EmailSendModal(props: EmailSendModalProps) {
  const { onClose, record, isShow } = props;
  const [showEmailDefault, setShowEmailDefault] = useState<boolean>(true);

  return (
    <Modal size="xl" show={isShow} position="center" onClose={onClose}>
      <Modal.Header>REENVIAR EMAIL</Modal.Header>
      <Modal.Body>
            {
                JSON.stringify(record)
            }

            <div>
                <div className="w-full">
                    <div onClick={showEmailDefault ? ()=>setShowEmailDefault(!showEmailDefault) : ()=>{}} className={`${showEmailDefault ? ' bg-slate-200' : ' bg-slate-600 clickeable'}`}>Enviar al Cliente</div>
                    <div onClick={!showEmailDefault ? ()=>setShowEmailDefault(!showEmailDefault) : ()=>{}} className={`${showEmailDefault ? 'bg-slate-600 clickeable' : 'bg-slate-200'}`}>Enviar a Otro</div>
                </div>
                <div>
                    {
                        showEmailDefault ? 
                        <div>Email del cliente</div> :
                        <div>Otro email</div>
                    }
                </div>
            </div>
      </Modal.Body>
      <Modal.Footer className="flex justify-end gap-4">
        <Button onClick={onClose} preset={Preset.close} />
      </Modal.Footer>
    </Modal>
  );
}
