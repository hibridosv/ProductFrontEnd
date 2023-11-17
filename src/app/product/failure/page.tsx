"use client";
import { useEffect, useState } from "react";
import { Loading, ViewTitle } from "@/components";
import { getData, postData } from "@/services/resources";
import { numberToMoney } from "@/utils/functions";
import { useForm } from "react-hook-form";
import toast, { Toaster } from 'react-hot-toast';

import { Button, Preset } from "@/components/button/button";
import { style } from "@/theme";
import { ProductFailureTable } from "@/components/products-components/product-failure-table";
import { useSearchTerm } from "@/hooks/useSearchTerm";
import { SearchInput } from "@/components/form/search";

export default function InsertProduct() {
  const [selectedProduct, setSelectedProdcut] = useState<any>({});
  const [failure, setFailure] = useState<any>({});
  const [isLoading, setIsLoading] = useState(false);
  const { register, handleSubmit, reset, watch, setValue } = useForm();
  const [isSending, setIsSending] = useState(false);
  const { searchTerm, handleSearchTerm } = useSearchTerm()
  const [products, setProducts] = useState([]);
  const [productSelected, setProductSelected] = useState(null);

  
  const loadData = async () => {
    try {
      const response = await getData(`products?sort=-created_at${searchTerm}`);
      setProducts(response.data);
    } catch (error) {
      console.error(error);
    }
};
  

useEffect(() => {
    if (searchTerm) {
        (async () => { await loadData() })();
    }
  // eslint-disable-next-line
}, [searchTerm]);


  useEffect(() => {
    if (productSelected) {
      (async () => {
        setIsLoading(true);
        try {
          const product = await getData(`products/${productSelected}`);
          const failures = await getData(`failures`);
          setSelectedProdcut(product.data);
          setFailure(failures);
        } catch (error) {
          console.error(error);
        } finally {
          setIsLoading(false);
        }
      })();
    }
    // eslint-disable-next-line
  }, [productSelected]);

  const onSubmit = async (data: any) => {
    data.product_id = selectedProduct?.id
    try {
      setIsSending(true);
      const response = await postData(`failures`, "POST", data);
      if (!response.message) {
        setFailure(response);
        const product = await getData(`products/${productSelected}`);
        setSelectedProdcut(product.data);
        toast.success("Producto agregado correctamente");
        reset();
      } else {
        toast.error("Faltan algunos datos importantes!");
      }
    } catch (error) {
      console.error(error);
      toast.error("Ha ocurrido un error!");
    } finally {
      setIsSending(false);
    }
  };


  const deleteRecord = async (iden: string) => {
    try {
      const response = await postData(`failures/${iden}`, 'DELETE');
      if(response?.type === "error"){
        toast.error(response.message);
      } else {
        toast.success("Registro Eliminado");
        setFailure(response);
        const product = await getData(`products/${productSelected}`);
        setSelectedProdcut(product.data);
      }
    } catch (error) {
      console.error(error);
      toast.error("Ha ocurrido un error!");
    } 
    
  }


  const handleNewProduct = () => {
    setProductSelected(null)
    setProducts([])
  }

  if (isLoading) return (<Loading />)

  const listItems = products?.map((product: any):any => (
    <div key={product.id} onClick={()=>setProductSelected(product.id)}>
        <li className="flex justify-between p-3 hover:bg-blue-200 hover:text-blue-800 cursor-pointer">
        {product.cod} | {product.description}
            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24"
                stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
        </li>
    </div>
))


  return (
    <div className="grid grid-cols-1 md:grid-cols-6 pb-10">
       {productSelected ? <>
      <div className="col-span-2">
        <ViewTitle text="DESCONTAR AVERIAS" />
        {isLoading && <Loading />}
        <div className="w-full px-4">
            <form onSubmit={handleSubmit(onSubmit)} className="w-full">
              <div className="flex flex-wrap -mx-3 mb-6">

              <div className="w-full px-3 mb-2">
                    <label htmlFor="prescription" className={style.inputLabel}>
                      Cantidad{" "}
                    </label>
                    <input
                    type="number"
                    id="quantity"
                    {...register("quantity")}
                    className={style.input}
                    step="any"
                    min={0}
                    />
                  </div>
                  <div className="w-full md:w-full px-3 mb-4">
                  <label htmlFor="reason" className={style.inputLabel}>
                    Razón de averia{" "}
                  </label>
                  <textarea
                    {...register("reason", {})}
                    rows={2}
                    className={`${style.input} w-full`}
                  />
                </div>

                <div className='w-full'>
                <span className="float-right">
                <Button type="submit" disabled={isSending} preset={isSending ? Preset.saving : Preset.save} />
                </span>
              </div>

              </div>
            </form>
          </div>

      </div>

      <div  className="col-span-2">
        <ViewTitle text="ULTIMAS AVERIAS" />
        <ProductFailureTable records={failure?.data} onDelete={deleteRecord} />
      </div>


      <div className="col-span-2 px-3">
        <ViewTitle text="PRODUCTO" />

        <h3 className="text-2xl">{selectedProduct?.description}</h3>
            <div className="border-t border-gray-200">

                <div className='flex justify-between px-4 py-2 bg-gray-50 border border-slate-200'>
                  <div className="text-lg font-medium text-gray-500">Codigo</div>
                  <div className="mt-1 text-lg text-gray-900 font-bold">{selectedProduct?.cod}</div>
                </div>
                <div className='flex justify-between px-4 py-2 bg-gray-50 border border-slate-200'>
                  <div className="text-lg font-medium text-gray-500">Cantidad</div>
                  <div className={`mt-1 text-lg font-bold ${selectedProduct?.quantity <= selectedProduct?.minimum_stock ? 'text-red-600' : 'text-gray-900'}`}>{selectedProduct?.quantity}</div>
                </div>
                <div className='flex justify-between px-4 py-2 bg-gray-50 border border-slate-200'>
                  <div className="text-lg font-medium text-gray-500">Precio por Unidad</div>
                  <div className="mt-1 text-lg text-gray-900 font-bold">
                      {selectedProduct?.prices && selectedProduct.prices.length > 0
                        ? numberToMoney(selectedProduct.prices[0].price)
                        : numberToMoney(0)}</div>
                </div>
                <div className='flex justify-between px-4 py-2 bg-gray-50 border border-slate-200'>
                  <div className="text-lg font-medium text-gray-500">Minimo Stock</div>
                  <div className="mt-1 text-lg text-gray-900 font-bold">{selectedProduct?.minimum_stock}</div>
                </div>

            </div>
          <div className="mt-4">
              <Button text='Nueva busqueda' isFull type="submit" preset={Preset.cancel} onClick={()=>handleNewProduct()} />
          </div>
      </div>
      </> : 
        <div className="col-span-4 m-4">
          <ViewTitle text="DESCONTAR AVERIAS"  />
          <SearchInput handleSearchTerm={handleSearchTerm} placeholder="Buscar Producto" />
          <div className="w-full bg-white rounded-lg shadow-lg lg:w-2/3 mt-4">
              <ul className="divide-y-2 divide-gray-400">
              { listItems }
              </ul>
          </div>
        </div>
      }
      <Toaster position="top-right" reverseOrder={false} />
    </div>
  );
}
