"use client";

import { Modal } from "flowbite-react";
import { Button, Preset } from "../button/button";


// Props del componente
interface ErrorTableProps {
    errors: any;
    onClose: () => void;
    isShow: boolean;
}


export function ErrorsGtModal(props: ErrorTableProps) {
  const { onClose, errors, isShow } = props;
  let parsedErrors: Error[] = [];

  try {
    // Analiza el JSON solo si es una cadena
    if (typeof errors === 'string') {
      parsedErrors = JSON.parse(errors);
    } else {
      parsedErrors = errors;
    }
  } catch (error) {
    console.error("Error parsing errors:", error);
    return <></>;
  }

  if (!Array.isArray(parsedErrors)) return <></>;
  

  const organizedErrors = parsedErrors
    .map((error: any) => ({
      categoria: error.categoria,
      mensaje_error: error.mensaje_error
    }))
    .reduce((acc: Record<string, string[]>, { categoria, mensaje_error }) => {
      if (!acc[categoria]) {
        acc[categoria] = [];
      }
      acc[categoria].push(mensaje_error);
      return acc;
    }, {});


  return (
    <Modal size="xl" show={isShow} position="center" onClose={onClose}>
      <Modal.Header>DETALLES DE ERRORES</Modal.Header>
      <Modal.Body>
      <div>
            {Object.keys(organizedErrors).length === 0 ? (
                <p>No errors to display.</p>
            ) : (
                Object.keys(organizedErrors).map((categoria, index) => (
                    <div key={index} className="mb-4">
                        <h2 className="font-bold">{categoria}</h2>
                        <ul className="list-disc pl-5">
                            {organizedErrors[categoria].map((mensaje: any, idx: any) => (
                                <li key={idx} className="text-red-600">{mensaje}</li>
                            ))}
                        </ul>
                    </div>
                ))
            )}
        </div>
      </Modal.Body>
      <Modal.Footer className="flex justify-end gap-4">
        <Button onClick={onClose} preset={Preset.close} />
      </Modal.Footer>
    </Modal>
  );

}
