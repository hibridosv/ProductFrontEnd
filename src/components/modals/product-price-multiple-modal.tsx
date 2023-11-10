"use client";
import { Modal } from "flowbite-react";
import { Button, Preset } from "../button/button";
import { Product } from "@/services/products";
import { MultiPrice } from "../products-components/multi-price";


export interface ProductPrecioMultipleProps {
  onClose: () => void;
  product?: Product | any;
}

export function ProductPrecioMultipleModal(props: ProductPrecioMultipleProps) {
  const { onClose, product } = props;
  return (
    <Modal size="lg" show={true} position="center" onClose={onClose}>
      <Modal.Header>Agregar nuevos precios</Modal.Header>
      <Modal.Body>
        <MultiPrice product={product} />
      </Modal.Body>
      <Modal.Footer className="flex justify-end gap-4">
        <Button onClick={onClose} preset={Preset.close} />
      </Modal.Footer>
    </Modal>
  );
}
