'use client'
import { Product } from "@/services/products";
import { Modal} from "flowbite-react";
import { Button, Preset } from "../button/button"
import { ProductUploadImage } from "../products-components/upload-image";


export interface ProductImageModalProps {
  onClose: () => void;
  product?: Product;
}

export function ProductImageModal(props: ProductImageModalProps) {
  const { product, onClose } = props;

  return (
    <Modal show={true} position="center" onClose={onClose}>
      <Modal.Header>Imagenes del producto</Modal.Header>
      <Modal.Body>
        <div className="mx-4">

        <ProductUploadImage product={product} />
          
        </div>
      </Modal.Body>
      <Modal.Footer className="flex justify-end gap-4">
        <Button onClick={onClose} preset={Preset.close} />
      </Modal.Footer>
    </Modal>
  );
}
