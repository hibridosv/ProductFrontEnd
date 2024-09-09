"use client";

import { Modal } from "flowbite-react";
import { Button, Preset } from "../button/button";

// Props del componente
interface ErrorTableProps {
    errors: any; 
    onClose: () => void;
    isShow: boolean;
}

// Función para enumerar los errores
function formatErrors(errors: string[]): string[] {
  return errors.map((error, index) => `${index + 1}. ${error}`);
}

export function ErrorsSVModal(props: ErrorTableProps) {
  const { onClose, errors, isShow } = props;

  // Formatear errores
  const formattedErrors = formatErrors(errors);
    console.log(formatErrors)
  return <></>
  // return (
  //   <Modal size="xl" show={isShow} position="center" onClose={onClose}>
  //     <Modal.Header>DETALLES DE ERRORES</Modal.Header>
  //     <Modal.Body>
  //       <div>
  //         {formattedErrors.length === 0 ? (
  //           <p>No hay errores para mostrar.</p>
  //         ) : (
  //           <ul className="list-disc pl-5">
  //             {formattedErrors.map((error, idx) => (
  //               <li key={idx} className="text-red-600">{error}</li>
  //             ))}
  //           </ul>
  //         )}
  //       </div>
  //     </Modal.Body>
  //     <Modal.Footer className="flex justify-end gap-4">
  //       <Button onClick={onClose} preset={Preset.close} />
  //     </Modal.Footer>
  //   </Modal>
  // );
}
