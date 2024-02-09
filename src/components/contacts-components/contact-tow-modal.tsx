"use client";
import { Modal } from "flowbite-react";
import { Button, Preset } from "../button/button";
import { getMunicipioNameById } from "@/utils/functions";
import { Loading } from "../loading/loading";

export interface ContactTownModalProps {
    onClose: () => void;
    isShow: boolean;
    record: any;
    departament: string;
    setTown: (item: string)=> void
}

export function ContactTownModal(props: ContactTownModalProps) {
    const { onClose, isShow, record, setTown, departament } = props;


    
  return (
    <Modal size="lg" show={isShow} position="center" onClose={onClose}>
      <Modal.Header>AGREGAR MUNICIPIO</Modal.Header>
      <Modal.Body>
            { record ?
            (record.departamentos && record.departamentos.find((depto: any) => depto.id === departament))?.municipios.map((municipio: any, index: any) => (
                <div key={municipio.id_mun} className=" border border-teal-600 clickeable" 
              onClick={()=>{setTown(municipio.id_mun.substring(municipio.id_mun.length - 2)); onClose()}}>
                <div className="px-4 py-2 font-semibold bg-slate-300 uppercase">{municipio.nombre}</div>
              </div>
            )) : <div></div>
            }
    
      </Modal.Body>
      <Modal.Footer className="flex justify-end gap-4">
        <Button onClick={onClose} preset={Preset.close} />
      </Modal.Footer>
    </Modal>
  );
}
