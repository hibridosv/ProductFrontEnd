"use client";

import { Modal } from "flowbite-react";
import { Button, Preset } from "../button/button";

// Props del componente
interface EmailSendModalProps {
  record: any;
  onClose: () => void;
  isShow: boolean;
}


export function EmailSendModal(props: EmailSendModalProps) {
  const { onClose, record, isShow } = props;

  return (
    <Modal size="xl" show={isShow} position="center" onClose={onClose}>
      <Modal.Header>REENVIAR EMAIL</Modal.Header>
      <Modal.Body>
            {
                JSON.stringify(record)
            }
      </Modal.Body>
      <Modal.Footer className="flex justify-end gap-4">
        <Button onClick={onClose} preset={Preset.close} />
      </Modal.Footer>
    </Modal>
  );
}
