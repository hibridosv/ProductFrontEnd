'use client'
import { Modal } from "flowbite-react";
import { Button, Preset } from "../button/button";
import { Product } from "@/services/products";
import { ProductDetails } from "../products-components/product-details";
import { getData } from "@/services/resources";
import { useEffect, useState } from "react";
import { Loading } from "../loading/loading";


export interface SalesProductViewModalProps {
  onClose: () => void;
  product: any;
  isShow: boolean;
}



export function SalesProductViewModal(props: SalesProductViewModalProps) {
  const { onClose, product, isShow } = props;
  const [selectedProduct, setSelectedProdcut] = useState<any>({});
  const [isLoading, setIsLoading] = useState(false);

  const loadProduct = async () => {
    try {
      setIsLoading(true)
      const products = await getData(`products/${product?.product_id}`);       
      setSelectedProdcut(products.data)
    } catch (error) {
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }


  useEffect(() => {
    if (isShow) {
    (async () => await loadProduct())();
  }
    // eslint-disable-next-line
  }, [isShow]);

  const handleClose =() =>{
    setSelectedProdcut({})
    onClose()
  }

  return (
    <Modal show={isShow} position="center" onClose={handleClose} size={isLoading ? "sm" : "2xl"}>
      <Modal.Header>Detalles del producto</Modal.Header>
      <Modal.Body>
        { 
        isLoading 
        ? 
        <Loading /> 
        :
        <ProductDetails product={selectedProduct} isShow={isShow} />
        }
      </Modal.Body>
      <Modal.Footer className="flex justify-end">
        <Button onClick={handleClose} preset={Preset.close} isFull /> 
      </Modal.Footer>
    </Modal>
  );
}
