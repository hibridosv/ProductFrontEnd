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

export interface ProductSearchModalProps {
  onClose: () => void;
  isShow?: boolean;
}

export function ProductSearchModal(props: ProductSearchModalProps) {
  const { onClose, isShow } = props;

      

  return (
    <Modal size="lg" show={isShow} position="top-center" onClose={onClose}>
      <Modal.Header>BUSCAR PRODUCTO</Modal.Header>
      <Modal.Body>



      </Modal.Body>
      <Modal.Footer className="flex justify-end gap-4">
        <Button onClick={onClose} preset={Preset.close} />
      </Modal.Footer>
    </Modal>
  );

}
