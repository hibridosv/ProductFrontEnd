"use client";
import { useEffect, useState } from "react";
import { Modal } from "flowbite-react";
import { Button, Preset } from "../button/button";
import { getData } from "@/services/resources";
import { SearchInput } from "../form/search";
import { useSearchTerm } from "@/hooks/useSearchTerm";
import { Loading } from "../loading/loading";
import { ProductDetails } from "../products-components/product-details";
import { getRandomInt, numberToMoney } from "@/utils/functions";

export interface ProductSearchModalProps {
  onClose: () => void;
  isShow?: boolean;
}

export function ProductSearchModal(props: ProductSearchModalProps) {
  const { onClose, isShow } = props;
  const [selectedProduct, setSelectedProdcut] = useState<any>({});
  const { searchTerm, handleSearchTerm } = useSearchTerm(["cod", "description"], 500);
  const [products, setProducts] = useState([]);
  const [productSelected, setProductSelected] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [randomNumber, setRandomNumber] = useState(0);

  const loadData = async () => {
    try {
      const response = await getData(`products?sort=description${searchTerm}`);
      setProducts(response.data);
    } catch (error) {
      console.error(error);
    }
};

const loadProduct = async () => {
  try {
    setIsLoading(true)
    const product = await getData(`products/${productSelected}`);       
    setSelectedProdcut(product.data)
  } catch (error) {
    console.error(error)
  } finally {
    setIsLoading(false)
  }
}
  

useEffect(() => {
    if (searchTerm && isShow) {
        (async () => { await loadData() })();
    }
  // eslint-disable-next-line
}, [searchTerm, isShow]);
  
useEffect(() => {
  if (productSelected && isShow) {
  (async () => await loadProduct())();
}
  // eslint-disable-next-line
}, [productSelected, isShow]);

const handleNewProduct = () => {
  setRandomNumber(getRandomInt(100))
  setProductSelected(null)
  setProducts([])
  handleSearchTerm("")
}

useEffect(() => {
  if (!isShow) {
    handleNewProduct()
  }
// eslint-disable-next-line
}, [isShow]);



const listItems = products?.map((product: any):any => (
  <li key={product.id} onClick={()=>setProductSelected(product.id)} className="flex justify-between p-3 hover:bg-blue-200 hover:text-blue-800 cursor-pointer">
  <div>
    {product.cod} | {product.description} 
    <span className="text-xs font-normal border border-slate-500 ml-3 shadow-md rounded-md px-1">{ numberToMoney(product?.prices[0]?.price ? product?.prices[0]?.price : 0) }</span>
  </div>
      <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24"
          stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
      </svg>
  </li>
))


  return (
    <Modal size={isLoading ? "sm" : "2xl"} show={isShow} position="top-center" onClose={onClose}>
      <Modal.Header>BUSCAR PRODUCTO</Modal.Header>
      <Modal.Body>

          {productSelected ? 
          <>
          {isLoading ? <Loading /> :
            <ProductDetails product={selectedProduct} isShow={isShow} state={isShow} />
          }
        </> 
          :
          <div className="m-4">
            <SearchInput handleSearchTerm={handleSearchTerm} placeholder="Buscar Producto" randNumber={randomNumber} />
            <div className="w-full bg-white rounded-lg shadow-lg mt-4">
              <ul className="w-full divide-y-2 divide-gray-400">
              { listItems }
              { listItems.length > 0 &&
                <li className="flex justify-between p-3 hover:bg-red-200 hover:text-red-800 cursor-pointer" onClick={handleNewProduct}>
                  CANCELAR
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24"
                        stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                </li>
              }
              </ul>
            </div>
          </div>
          }
      </Modal.Body>
      <Modal.Footer className="flex justify-end gap-4">
        { productSelected && <>
          <Button onClick={handleNewProduct} text={isLoading ? "Cancelar" : "Buscar Otro"} preset={Preset.accept} />
        </> }
        <Button onClick={onClose} preset={Preset.close} />
      </Modal.Footer>
    </Modal>
  );

}
