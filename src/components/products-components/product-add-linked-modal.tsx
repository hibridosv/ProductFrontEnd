"use client";
import { useState, useEffect, useRef } from "react";
import { Modal } from "flowbite-react";
import { Button, Preset } from "../button/button";
import { Product } from "@/services/products";
import { useSearchTerm } from "@/hooks/useSearchTerm";
import { getData, postData } from "@/services/resources";
import { SearchInput } from "../form/search";
import { style } from "@/theme";
import toast, { Toaster } from 'react-hot-toast';

import { DeleteModal } from "../modals/delete-modal";
import { Loading } from "../loading/loading";


export interface ProductLinkedProps {
  onClose: () => void;
  product?: Product | any;
  isShow?: boolean;
}

export function ProductLinkedModal(props: ProductLinkedProps) {
  const { onClose, product, isShow } = props;
  const { searchTerm, handleSearchTerm } = useSearchTerm(["cod", "description"], 500);
  const [isLoading, setIsLoading] = useState(false);
  const [products, setProducts] = useState([]);
  const [productSelected, setProductSelected] = useState<any>()
  const [ handleQuantity, setHandleQuantity] = useState<any>()
  const focusInQuantity = useRef<any>();
  const [isSending, setIsSending] = useState(false);
  const [lastProductsLinked, setLastProductsLinked] = useState<any>([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectProduct, setSelectProduct] = useState<Product>({} as Product);


  const loadProductsBySearch = async () => {
    try {
      const response = await getData(`products?sort=description&filterWhere[is_restaurant]==0&selected=id,cod,description,product_type${searchTerm}`);
      setProducts(response.data);
    } catch (error) {
      console.error(error);
    } 
  };

const loadProductsLinked = async () => {
    setIsLoading(true);
    try {
      const response = await getData(`linked/${product.id}`);
      setLastProductsLinked(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
};

useEffect(() => {
  if (searchTerm && isShow) {
    (async () => { await loadProductsBySearch() })();
  }
  // eslint-disable-next-line
}, [searchTerm]);


useEffect(() => {
  if (product && isShow) {
    (async () => { await loadProductsLinked() })();
  }
  // eslint-disable-next-line
}, [product]);

const handleProductSelected = (product: any)=>{
  setProductSelected(product)
  setProducts([])
}

const cancelSelected = ()=>{
  setProductSelected(null)
  setProducts([])
}

useEffect(() => {
  if (productSelected && isShow) {
    focusInQuantity.current.focus();
  }
  // eslint-disable-next-line
},[handleQuantity])

  const isDeleteProduct = (product:Product) => {
    setSelectProduct(product);
    setShowDeleteModal(true);
  }
  
  const handleDeleteProduct = () => {
    deleteProduct(selectProduct.id);
    setShowDeleteModal(false);
    setSelectProduct({} as Product);
    
  }
  
  const deleteProduct = async (iden: number) => {
    try {
      const response = await postData(`linked/${iden}`, 'DELETE');
      toast.success( response.message);
      await loadProductsLinked()
    } catch (error) {
      console.error(error);
      toast.error("Ha ocurrido un error!");
    } 
  }
  
  
  const onSubmit = async ()=>{
    let data:any = {};
    data.product_id = product.id
    data.quantity = handleQuantity
    data.added_product_id = productSelected.id
    try {
      setIsSending(true)
      const response = await postData(`linked`, "POST", data);
      if (!response.message) {
        toast.success( "Producto agregado correctamente");
        await loadProductsLinked()
        cancelSelected()
      } else {
        toast.error("Faltan algunos datos importantes!");
      }
    } catch (error) {
      console.error(error);
      toast.error("Ha ocurrido un error!");
    } finally{
      setIsSending(false)
    }
  }
  
  const listItems = products?.map((product: any):any => (
    <li onClick={()=>handleProductSelected(product)} key={product.id} className="text-ellipsis flex justify-between p-3 hover:bg-blue-200 hover:text-blue-800">
        {product.cod} | {product.description}
            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24"
                stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
        </li>
))

const listProducts = lastProductsLinked?.map((product: any):any => (
    <li  key={product.id} className="flex justify-between p-3 hover:bg-blue-100 hover:text-blue-800 w-full">
    <span className="font-semibold w-2/12">{product.qty}</span>
    <span className="text-left w-7/12">{product.composed}</span>
    <span className="text-right w-3/12"><Button onClick={()=>isDeleteProduct(product)} preset={Preset.smallClose} noText /></span>
    </li>
))



  return (
    <Modal size="lg" show={isShow} position="center" onClose={onClose}>
      <Modal.Header>{ product?.description }</Modal.Header>
      <Modal.Body>
        { isLoading ? <Loading /> : (<>

        { (!productSelected && lastProductsLinked.length > 0) ? 
            (<div>
                <div className="text-2xl justify-self-center font-semibold">PRODUCTOS AGREGADOS</div>
                    <ul className="divide-y-2 divide-gray-400 mb-4">
                        {listProducts}
                    </ul>
                </div>) : 
           ( <div className="divide-y-2 divide-gray-400 my-4">Ingrese un producto</div>) }
   
        { productSelected ? 
        (<div>
            <div className="w-full p-4">
                <div className="flex flex-wrap -mx-3 mb-6">
                    <div className="w-full md:w-2/3 px-3 mb-4">
                        <input
                        type="number"
                        id="quantity"
                        className={style.input}
                        placeholder="Cantidad"
                        onChange={(e) => setHandleQuantity(e.target.value)}
                        ref={focusInQuantity}
                    />
                    </div>
                    <div className="w-full md:w-1/3 px-3 mb-4">
                        { isSending ? <Button disabled={true} preset={Preset.saving} /> : handleQuantity ? <Button onClick={onSubmit} preset={Preset.save} /> : <Button onClick={cancelSelected} preset={Preset.cancel} />}
                    </div>
                </div>
            </div>
            <div className="uppercase font-light text-teal-700">Producto a agregar</div>
            <div className="flex justify-between p-3 bg-blue-100 hover:bg-blue-300">
                <span>{productSelected.description}</span> 
                <Button onClick={cancelSelected} preset={Preset.smallClose} noText />
            </div>

        </div>) :
        (<div className=" border border-slate-100 p-2 mt-2 rounded-md shadow-lg"><SearchInput handleSearchTerm={handleSearchTerm} placeholder="Buscar Producto" />
        <div className="w-full bg-white rounded-lg shadow-lg lg:w-2/3 mt-4">
            <ul className="divide-y-2 divide-gray-400">
            { listItems }
            </ul>
        </div></div>)
        }

        </>)}


          <DeleteModal isShow={showDeleteModal}
          text="¿Estas seguro de eliminar este elemento?"
          onDelete={handleDeleteProduct} 
          onClose={()=>setShowDeleteModal(false)} /> 
      <Toaster position="top-right" reverseOrder={false} />
      </Modal.Body>
      <Modal.Footer className="flex justify-end gap-4">
        <Button onClick={onClose} preset={Preset.close} />
      </Modal.Footer>
    </Modal>
  );

}
