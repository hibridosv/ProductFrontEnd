"use client";
import { Modal } from "flowbite-react";
import { Button, Preset } from "../button/button";
import { ContactDetails } from "./contact-details.";


export interface ContactViewModalProps {
    onClose: () => void;
    isShow: boolean;
    record?: any;
}

export function ContactViewModal(props: ContactViewModalProps) {
    const { onClose, isShow, record } = props;


  return (
    <Modal size="lg" show={isShow} position="center" onClose={onClose}>
      <Modal.Header>DETALLES DEL CONTACTO</Modal.Header>
      <Modal.Body>
        <ContactDetails record={record} /> 
      </Modal.Body>
      <Modal.Footer className="flex justify-end gap-4">
        <Button onClick={onClose} preset={Preset.close} />
      </Modal.Footer>
    </Modal>
  );
}
