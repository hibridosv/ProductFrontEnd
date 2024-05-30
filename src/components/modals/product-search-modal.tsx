"use client";
import { useEffect, useState } from "react";
import { Modal } from "flowbite-react";
import { Button, Preset } from "../button/button";
import { getData } from "@/services/resources";
import { Loading } from "../loading/loading";
import { ProductDetails } from "../products-components/product-details";
import { SearchInputProduct } from "../form/search-product";

export interface ProductSearchModalProps {
  onClose: () => void;
  isShow?: boolean;
}

export function ProductSearchModal(props: ProductSearchModalProps) {
  const { onClose, isShow } = props;
  const [selectedProduct, setSelectedProdcut] = useState<any>({});
  const [productData, setProductData] = useState({} as any);
  const [isLoading, setIsLoading] = useState(false);


// const loadProduct = async () => {
//   console.log("productSelected: ", productSelected?.id)
//   try {
//     setIsLoading(true)
//     const product = await getData(`products/${productSelected?.id}`);       
//     setSelectedProdcut(product.data)
//     setProductSelected({})
//   } catch (error) {
//     console.error(error)
//   } finally {
//     setIsLoading(false)
//   }
// }
  
const getProduct = (product: any)=> {
  setProductData(product)
  setSelectedProdcut({})
}

const resetSearch =()=>{
  setProductData(null)
  setSelectedProdcut(null)
}
  
  return (
    <Modal size={isLoading ? "sm" : "2xl"} show={isShow} position="top-center" onClose={onClose}>
      <Modal.Header>BUSCAR PRODUCTO</Modal.Header>
      <Modal.Body>

          { productData ? 
          <>
          {isLoading ? <Loading /> :
            <ProductDetails product={productData} isShow={isShow} state={isShow} />
          }
          </> 
          :
          <div className="m-4">
            <SearchInputProduct recordSelected={getProduct} placeholder="Buscar Producto" url="products?sort=description" />
          </div>
          }
      </Modal.Body>
      <Modal.Footer className="flex justify-end gap-4">
        { productData && <>
          <Button onClick={resetSearch} text={isLoading ? "Cancelar" : "Buscar Otro"} preset={Preset.accept} />
        </> }
        <Button onClick={onClose} preset={Preset.close} />
      </Modal.Footer>
    </Modal>
  );

}
