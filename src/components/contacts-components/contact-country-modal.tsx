"use client";
import { Modal } from "flowbite-react";
import { Button, Preset } from "../button/button";

export interface Country {
    code: string;
    country: string;
}

export interface ContactCountryModalProps {
    onClose: () => void;
    isShow: boolean;
    countries?: Country[]; // Cambié el nombre de `record` a `countries` para mayor claridad
    setCountry: (item: string) => void;
}

export function ContactCountryModal(props: ContactCountryModalProps) {
    const { onClose, isShow, countries = [], setCountry } = props; // Valor predeterminado de un arreglo vacío
    if (!countries) return <></>
    
    return (
        <Modal size="lg" show={isShow} position="center" onClose={onClose}>
            <Modal.Header>AGREGAR PAIS</Modal.Header>
            <Modal.Body>
                {
                    Array.isArray(countries) && countries.map((country: Country) => (
                        <button
                            key={country.code}
                            className="w-full divide-y-2 mt-1 rounded-md divide-gray-400 bg-white border border-cyan-700"
                            onClick={() => { setCountry(country.code); onClose(); }}
                        >
                            <div className="flex justify-between p-2 hover:bg-blue-200 hover:text-blue-800">
                                <div>{country.country}</div>
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 cursor-pointer" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                </svg>
                            </div>
                        </button>
                    ))
                }
            </Modal.Body>
            <Modal.Footer className="flex justify-end gap-4">
                <Button onClick={onClose} preset={Preset.close} />
            </Modal.Footer>
        </Modal>
    );
}
