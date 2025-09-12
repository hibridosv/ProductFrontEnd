'use client'
import { Modal } from "flowbite-react";
import { Button, Preset } from "../button/button";
import { ArrowIcon} from "@/theme/svg"


export interface SalesSelectRemissionTypeModalProps {
    onClose: () => void;
    isShow?: boolean;
    saveAsRemission: (type: string) => void;
}

interface SalesSelectRemissionType {
    code: "01" | "02" | "03" | "04" | "05";
}

export function SalesSelectRemissionTypeModal(props: SalesSelectRemissionTypeModalProps){
const { onClose, isShow, saveAsRemission } = props;

const handleSelect = (type: SalesSelectRemissionType["code"]) => {
    saveAsRemission(type);
    onClose();
}

return (
    <Modal show={isShow} position="center" onClose={onClose} size="sm">
        <Modal.Header>Seleccione el tipo de Remisión</Modal.Header>
        <Modal.Body>
            <div className="mx-4">
                <div onClick={() => handleSelect("01")} className="flex justify-between p-3 hover:bg-blue-200 hover:text-blue-800 cursor-pointer">Deposito  { ArrowIcon }</div>
                <div onClick={() => handleSelect("02")} className="flex justify-between p-3 hover:bg-blue-200 hover:text-blue-800 cursor-pointer">Propiedad  { ArrowIcon }</div>
                <div onClick={() => handleSelect("03")} className="flex justify-between p-3 hover:bg-blue-200 hover:text-blue-800 cursor-pointer">Consignación  { ArrowIcon }</div>
                <div onClick={() => handleSelect("04")} className="flex justify-between p-3 hover:bg-blue-200 hover:text-blue-800 cursor-pointer">Traslado  { ArrowIcon }</div>
                <div onClick={() => handleSelect("05")} className="flex justify-between p-3 hover:bg-blue-200 hover:text-blue-800 cursor-pointer">Otros  { ArrowIcon }</div>
            </div>
        </Modal.Body>
        <Modal.Footer className="flex justify-end">
            <Button onClick={onClose} preset={Preset.close} isFull  /> 
        </Modal.Footer>
    </Modal>
)
}