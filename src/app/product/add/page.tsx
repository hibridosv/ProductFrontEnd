"use client";
import React, { useState, useEffect } from "react";
import { Alert, ViewTitle } from "@/components";
import { useForm } from "react-hook-form";
import { postData, getData } from "@/services/resources";
import { Button, Preset } from "@/components/button/button";
import { style } from "@/theme";
import { useSearchTerm } from "@/hooks/useSearchTerm";
import toast, { Toaster } from 'react-hot-toast';

import { SearchIcon } from "@/theme/svg";
import { Product } from "@/services/products";
import { Contacts } from "@/services/Contacts";
import { ProductRegisterTable } from "@/components/products-components/product-register-table";
import { PresetTheme } from "@/services/enums";
import { ProductRegisterPrincipalTable } from "@/components/products-components/product-register-principal-table";
import { documentType } from "@/utils/functions";

export default function ProductAdd() {
  const [lastProductsPrincipal, setLastProductsPrincipal] = useState<any>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<any>({});
  const [isSending, setIsSending] = useState(false);
  const { searchTerm, handleSearchTerm } = useSearchTerm(["cod", "description"], 500);
  const [products, setProducts] = useState([]);
  const [productPrincipal, setProductPrincipal] = useState([]) as any;
  const [productSelected, setProductSelected] = useState<Product>({} as Product);
  const [providers, setProviders] = useState<Contacts>([] as Contacts);


  const { register, handleSubmit, reset, watch, setValue } = useForm();
  
  const onSubmit = async (data: any) => {
    data.product_id = productSelected.id
    data.actual_stock = data.quantity
    data.provider_id = productPrincipal.provider_id
    data.employee_id = productPrincipal.employee_id
    data.document_type = productPrincipal.document_type
    data.lot = productPrincipal.lot
    data.comment = productPrincipal.comment
    data.product_register_principal = productPrincipal.id

    try {
      setIsSending(true)
      const response = await postData(`products/add`, "POST", data);
      if (!response.message) {
        setProductSelected({} as Product)
        setValue("quantity", null)
        setValue("unit_cost", null)
        toast.success("Producto agregado correctamente");
        await loadLastRegistersPrincipal();
        setMessage({});
      } else {
        toast.error("Faltan algunos datos importantes!");
        setMessage(response);
      }
    } catch (error) {
      console.error(error);
      toast.error("Ha ocurrido un error!");
    } finally {
      setIsSending(false)
    }
  }


  const addRegisterPrincipal = async (data: any) => {
    try {
      setIsSending(true)
      const response = await postData(`products/add/principal`, "POST", data);
      if (!response.message) {
        setProductPrincipal(response.data);
        toast.success("Producto agregado correctamente");
        setMessage({});
      } else {
        toast.error("Faltan algunos datos importantes!");
        setMessage(response);
      }
    } catch (error) {
      console.error(error);
      toast.error("Ha ocurrido un error!");
    } finally {
      setIsSending(false)
      await loadLastRegistersPrincipal();
    }
  }



  const loadProviders = async () => {
    try {
      const response = await getData(`contacts/providers`);
      setProviders(response);
    } catch (error) {
      console.error(error);
    } 
};



const loadLastRegistersPrincipal = async () => {
  try {
    setIsLoading(true);
    const response = await getData(`registers/principal`);
    setLastProductsPrincipal(response.data);
  } catch (error) {
    console.error(error);
  }  finally {
    setIsLoading(false);
  }
};


const loadLastRegistersPrincipalOpen = async () => {
  try {
    const response = await getData(`registers/principal/last`);
    setProductPrincipal(response.data);
  } catch (error) {
    console.error(error);
  }
};



const loadProductsSearch = async () => {
  try {
    const response = await getData(`sales/get-products?sort=-created_at${searchTerm}`);
    setProducts(response.data);
  } catch (error) {
    console.error(error);
  } 
};

useEffect(() => {
  if (searchTerm) {
      (async () => { await loadProductsSearch() })();
  } else {
    setProducts([])
  }
// eslint-disable-next-line
}, [searchTerm]);


useEffect(() => {
      (async () => { 
        await loadProviders(); 
        await loadLastRegistersPrincipal();
        await loadLastRegistersPrincipalOpen();
      })();
// eslint-disable-next-line
}, []);

useEffect(() => {
  handleSearchTerm(watch('search'))
// eslint-disable-next-line
}, [watch('search')]);


  const handleClickOnProduct = async (productId: string) =>{
    try {
      const response = await getData(`products/${productId}`);
      if (!response.message) {
        setProductSelected(response.data)
        setProducts([]);
        setValue("search", null)
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("Ha Ocurrido un Error!");
    }
  }



  const finishRegister = async () => {
    try {
      setIsSending(true)
      setMessage({});
      const response = await postData(`registers/principal/${productPrincipal.id}`, "PUT");
      if (!response.message) {
        setProductPrincipal([]);
        reset();
        setLastProductsPrincipal(response.data);
        toast.success("Actualizado correctamente!");
      }
    } catch (error) {
      console.error(error);
      toast.error("Ha ocurrido un error!");
    } finally {
      setIsSending(false)
    }
  }

  
 
  const listItems = products?.map((product: any):any => (
    <div key={product.id} onClick={()=>handleClickOnProduct(product.id)}>
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
    <div className="grid grid-cols-1 md:grid-cols-10 pb-10">
           <div className="col-span-5 border-r md:border-sky-600">
             <ViewTitle text="AGREGAR PRODUCTOS" />
            <div className="w-full px-4">

          { !productPrincipal?.id ? (
            <form onSubmit={handleSubmit(addRegisterPrincipal)} className="w-full">
              <div className="flex flex-wrap -mx-3 mb-6">

                <div className="w-full md:w-1/2 px-3 mb-2">
                    <label htmlFor="document_number" className={style.inputLabel}>Numero de Documento</label>
                    <input
                          type="number"
                          id="document_number"
                          {...register("document_number")}
                          className={style.input}
                          step="any"
                          min={0}
                        />
                </div>

                <div className="w-full md:w-1/2 px-3 mb-2">
                    <label htmlFor="document_type" className={style.inputLabel}> Tipo de Documento </label>
                    <select
                          id="document_type"
                          {...register("document_type")}
                          className={style.input}
                        >
                        <option value="0">Ninguno</option>
                        <option value="1">Ticket</option>
                        <option value="2">Factura</option>
                        <option value="3">Credito Fiscal</option>
                    </select>
                </div>

                <div className="w-full md:w-1/2 px-3 mb-2">
                    <label htmlFor="provider_id" className={style.inputLabel}> Proveedor </label>
                    <select
                          defaultValue={providers && providers.data && providers.data.length > 0 ? providers.data[0].id : 0}
                          id="provider_id"
                          {...register("provider_id")}
                          className={style.input}
                        >
                        {providers?.data?.map((value: any) => {
                          return (
                            <option key={value.id} value={value.id}> {value.name}</option>
                          );
                        })}
                    </select>
                </div>

                <div className="w-full md:w-1/2 px-3 mb-2">
                    <label htmlFor="lot" className={style.inputLabel}> Lote </label>
                    <input
                          type="number"
                          id="lot"
                          {...register("lot")}
                          className={style.input}
                          step="any"
                          min={0}
                        />
                </div>

                <div className="w-full md:w-full px-3 mb-4">
                  <label htmlFor="comment" className={style.inputLabel}> Comentario{" "} </label>
                  <textarea
                    {...register("comment", {})}
                    rows={2}
                    className={`${style.input} w-full`}
                  />
                </div>
                
              </div>

              {message.errors && (
                <div className="mb-4">
                  <Alert
                    theme={PresetTheme.danger}
                    info="Error"
                    text={JSON.stringify(message.message)}
                    isDismisible={false}
                  />
                </div>
              )}

              <div className="flex justify-center">
              <Button type="submit" disabled={isSending} preset={isSending ? Preset.saving : Preset.save} />
              </div>

            </form>

          ) : (


            <form onSubmit={handleSubmit(onSubmit)} className="w-full">

              <div className=" font-semibold ">
                <div className="flex justify-between border-b-2">
                  <div>Numero de documento</div>
                  <div>{ productPrincipal.document_number }</div>
                </div>
                <div className="flex justify-between border-b-2">
                  <div>Tipo de Documento</div>
                  <div>{ documentType(productPrincipal.document_type) }</div>
                </div>
                <div className="flex justify-between border-b-2">
                  <div>Proveedor</div>
                  <div>{ productPrincipal?.provider?.name }</div>
                </div>
                <div className="flex justify-between border-b-2">
                  <div>Lote</div>
                  <div>{ productPrincipal.lot }</div>
                </div>
                <div className="flex justify-between border-b-2">
                  <div>{ productPrincipal.comment }</div>
                </div>
              </div>

              <div className="flex flex-wrap -mx-3 mb-6">

                <div className="w-full m-2">
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                          { SearchIcon }
                        </div>
                        <input
                          type="search"
                          id="search"
                          className="block w-full p-4 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                          placeholder="Buscar Producto"
                          {...register("search")}
                        />
                    </div>


                </div>
                <div className="w-full bg-white rounded-lg shadow-lg lg:w-2/3 mt-4">
                  <ul className="divide-y-2 divide-gray-400">
                  { listItems }
                  </ul>
                </div>

              { productSelected?.id && (<>
                <div className='w-full font-bold text-lg text-teal-900 border-b-2 mb-2'>{productSelected?.description}</div>
                <div className="w-full md:w-1/2 px-3 mb-2">
                    <label htmlFor="quantity" className={style.inputLabel}> Cantidad </label>
                    <input
                          type="number"
                          id="quantity"
                          {...register("quantity")}
                          className={style.input}
                          step="any"
                          min={0}
                        />
                </div>

                <div className="w-full md:w-1/2 px-3 mb-2">
                    <label htmlFor="unit_cost" className={style.inputLabel}> Precio Costo </label>
                    <input
                          type="number"
                          id="unit_cost"
                          {...register("unit_cost")}
                          className={style.input}
                          step="any"
                          min={0}
                        />
                </div>

                {productSelected?.expires ?
                  <div className="w-full md:w-1/2 px-3 mb-2">
                    <label htmlFor="expiration" className={style.inputLabel}>
                      Fecha de vencimiento
                    </label>
                    <input
                      type="date"
                      id="expiration"
                      {...register("expiration")}
                      className={style.input}
                    />
                  </div> : null
                }
              </>)}
              </div>

              {message.errors && (
                <div className="mb-4">
                  <Alert
                    theme={PresetTheme.danger}
                    info="Error"
                    text={JSON.stringify(message.message)}
                    isDismisible={false}
                  />
                </div>
              )}
              <div className="flex justify-center">
                  <Button type="submit" disabled={isSending} preset={isSending ? Preset.saving : Preset.save} />
              </div>
            </form>
          ) }
          </div>
         </div>

         <div className="col-span-5 border-r md:border-sky-600">
         <ViewTitle text="ULTIMAS ENTRADAS" />
         <div className="w-full p-4">
            <ProductRegisterPrincipalTable records={lastProductsPrincipal} isLoading={isLoading} />
          </div>
         <ViewTitle text="PRODUCTOS INGRESADOS" />
          <div className="w-full p-4">
            <ProductRegisterTable records={lastProductsPrincipal ? lastProductsPrincipal[0]?.registers : []} isLoading={isLoading} />
          </div>
          { productPrincipal?.id && <Button preset={isSending ? Preset.saving : Preset.cancel} text="Terminar ingreso" onClick={()=>finishRegister()} isFull /> }
        </div>
      <Toaster position="top-right" reverseOrder={false} />
   </div>
  )
}
