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
              return (<div key={departament.id} className="divide-y-2 mt-1 rounded-md divide-gray-400 bg-white border border-cyan-700" 
              onClick={()=>{setDepartament(departament.id); setTown("01"); onClose()}}>
                
                <div className="flex justify-between hover:bg-blue-200 hover:text-blue-800 cursor-pointer">
                  <div className="p-1">{departament.nombre}</div>
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </div>

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
