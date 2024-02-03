"use client";
import { Modal } from "flowbite-react";
import { Button, Preset } from "../button/button";
import { Product } from "@/services/products";
import { MultiPrice } from "./multi-price";


export interface ProductPrecioMultipleProps {
  onClose: () => void;
  product?: Product | any;
  isShow?: boolean;
}

export function ProductPrecioMultipleModal(props: ProductPrecioMultipleProps) {
  const { onClose, product, isShow } = props;

  if (!product) {
    return <div></div>
  }
  return (
    <Modal size="lg" show={isShow} position="center" onClose={onClose}>
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
