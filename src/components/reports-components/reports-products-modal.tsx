"use client";
import {  useEffect, useState } from "react";
import { Modal } from "flowbite-react";
import { Button, Preset } from "../button/button";
import { useForm } from "react-hook-form";
import toast, { Toaster } from 'react-hot-toast';


import { style } from "../../theme";

export interface ReportsProductsModalProps {
  onClose: () => void;
  isShow: boolean;
  setDocument: (value: number) => void;
}

export function ReportsProductsModal(props: ReportsProductsModalProps) {
  const { onClose, isShow, setDocument } = props;
  const { register, handleSubmit } = useForm();
  const [isSending, setIsSending] = useState(false);

  const onSubmit = async (data: any) => {
    if (!data.id_document) { 
        toast.error("Ingrese un numero de documento"); 
        return false; }
    setIsSending(true)
    try {
      setDocument(data.id_document)
      onClose();
    } catch (error) {
      console.error(error);
      toast.error("Ha ocurrido un error!");
    } finally {
      setIsSending(false)
    }
  };
  

  return (
    <Modal size="md" show={isShow} position="center" onClose={onClose}>
      <Modal.Header>BUSCAR DOCUMENTO</Modal.Header>
      <Modal.Body>
        <div className="mx-4">
        <form onSubmit={handleSubmit(onSubmit)} className="w-full">
            <div className="flex flex-wrap -mx-3">

            <div className="w-full px-3 mb-2">
                <label htmlFor="id_document" className={style.inputLabel}>Numero de documento</label>
                <input type="number" min={1} id="id_document" {...register("id_document")} className={`${style.input}`} />
            </div> 

              <div className="flex justify-center mt-4">
              <Button type="submit" disabled={isSending} preset={isSending ? Preset.saving : Preset.save} text="Buscar..." />
              </div>
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
