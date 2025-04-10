"use client";

import { Modal } from "flowbite-react";
import { Button, Preset } from "../button/button";

// Props del componente
interface ErrorTableProps {
  errors: string | any[]; // errors puede ser una cadena o un array
  onClose: () => void;
  isShow: boolean;
  description?: string;
}

// Función para enumerar los errores
function formatErrors(errorsArray: string[]): string[] {
  return errorsArray.map((error, index) => `${index + 1}. ${error.trim()}`);
}

export function ErrorsSVModal(props: ErrorTableProps) {
  const { onClose, errors, isShow, description } = props;

  let parsedErrors: string[] = [];

  // Verificar el tipo de errors y procesar en consecuencia
  if (typeof errors === 'string') {
    try {
      // Procesar el string de errores
      const cleanedErrors = errors
        .replace(/^\[|\]$/g, '') // Quitar corchetes al inicio y final
        .split('","') // Dividir los errores en base a la coma y comillas
        .map(error => error.replace(/^"|"$/g, '')); // Quitar comillas alrededor de cada error
      
      parsedErrors = cleanedErrors;
    } catch (error) {
      // console.error("Error al procesar los errores:", error);
      return <></>;
    }
  } else if (Array.isArray(errors)) {
    // Si errors es un array, simplemente convertir a string
    parsedErrors = errors.map(error => error.toString());
  } else {
    // Si errors no es un string ni un array, mostrar mensaje de error
    // console.error("El parámetro 'errors' no es una cadena de texto ni un array.");
    return <></>;
  }

  if (parsedErrors.length === 0) {
    // console.error("No hay errores para mostrar.");
    return <></>;
  }

  // Formatear los errores
  const formattedErrors = formatErrors(parsedErrors);

  
  function decodeUnicode(str: string): string {
    return str.replace(/\\u([\dA-Fa-f]{4})/g, (match, grp) => {
      return String.fromCharCode(parseInt(grp, 16));
    });
  }

  parsedErrors = formattedErrors.map(error => decodeUnicode(error));
  
  return (
    <Modal size="xl" show={isShow} position="center" onClose={onClose}>
      <Modal.Header>DETALLES DE ERRORES</Modal.Header>
      <Modal.Body>
        <div>
          {parsedErrors.length === 0 ? (
            <p>No hay errores para mostrar.</p>
          ) : (
            <ul className="list-disc pl-5">
              {parsedErrors.map((error, idx) => (
                <li key={idx} className="text-red-600">{error}</li>
              ))}
              { (description || description !== "RECIBIDO") && (<li className="text-red-600">{ description}</li>) }
            </ul>
          )}
        </div>
      </Modal.Body>
      <Modal.Footer className="flex justify-end gap-4">
        <Button onClick={onClose} preset={Preset.close} />
      </Modal.Footer>
    </Modal>
  );
}
