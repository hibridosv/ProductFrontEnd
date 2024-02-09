"use client";
import { Modal } from "flowbite-react";
import { Button, Preset } from "../button/button";


export interface ContactDepartamentModalProps {
    onClose: () => void;
    isShow: boolean;
    record?: any;
    setDepartament: (item: string)=> void
    setTown: (item: string)=> void
}

export function ContactDepartamentModal(props: ContactDepartamentModalProps) {
    const { onClose, isShow, record, setDepartament, setTown } = props;


  return (
    <Modal size="lg" show={isShow} position="center" onClose={onClose}>
      <Modal.Header>AGREGAR DEPARTAMENTO</Modal.Header>
      <Modal.Body>
        {
          record?.departamentos?.map((departament: any)=>{
              return (<div key={departament.id} className=" border border-teal-600 clickeable" 
              onClick={()=>{setDepartament(departament.id); setTown("01"); onClose()}}>
                <div className="px-4 py-2 font-semibold bg-slate-300 uppercase">{departament.nombre}</div>
              </div>)
          })
        }
        

      </Modal.Body>
      <Modal.Footer className="flex justify-end gap-4">
        <Button onClick={onClose} preset={Preset.close} />
      </Modal.Footer>
    </Modal>
  );
}
