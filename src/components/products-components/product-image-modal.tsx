'use client'
import { Product } from "@/services/products";
import { Modal} from "flowbite-react";
import { Button, Preset } from "../button/button"
import { ProductUploadImage } from "./upload-image";


export interface ProductImageModalProps {
  onClose: () => void;
  product?: Product;
  isShow?: boolean;
}

export function ProductImageModal(props: ProductImageModalProps) {
  const { product, onClose, isShow } = props;

  return (
    <Modal show={isShow} position="center" onClose={onClose}>
      <Modal.Header>Imagenes del producto</Modal.Header>
      <Modal.Body>
        <div className="mx-4">

        <ProductUploadImage product={product} isShow={isShow} />
          
        </div>
      </Modal.Body>
      <Modal.Footer className="flex justify-end gap-4">
        <Button onClick={onClose} preset={Preset.close} />
      </Modal.Footer>
    </Modal>
  );
}
