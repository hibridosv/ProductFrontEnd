"use client";
import React, { useState, useEffect } from "react";
import { Alert, ViewTitle } from "@/components";
import { useForm } from "react-hook-form";
import { postData, getData } from "@/services/resources";
import { Button, Preset } from "@/components/button/button";
import { style } from "@/theme";
import toast, { Toaster } from 'react-hot-toast';
import { Product } from "@/services/products";
import { Contacts } from "@/services/Contacts";
import { ProductRegisterTable } from "@/components/products-components/product-register-table";
import { PresetTheme } from "@/services/enums";
import { ProductRegisterPrincipalTable } from "@/components/products-components/product-register-principal-table";
import { documentType, loadData } from "@/utils/functions";
import { ToggleSwitch } from "flowbite-react";
import { ContactAddModal } from "@/components/contacts-components/contact-add-modal";
import { SearchInputProduct } from "@/components/form/search-product";

export default function ProductAdd() {
  const [lastProductsPrincipal, setLastProductsPrincipal] = useState<any>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<any>({});
  const [isSending, setIsSending] = useState(false);
  const [isTaxesActive, setIsTaxesActive] = useState(false);
  const [isBillsActive, setIsBillsActive] = useState(false);
  const [isAccountActive, setIsAccountActive] = useState(false);
  const [products, setProducts] = useState([]);
  const [productPrincipal, setProductPrincipal] = useState([]) as any;
  const [productSelected, setProductSelected] = useState<Product>({} as Product);
  const [providers, setProviders] = useState<Contacts>([] as Contacts);
  const [categories, setCategories] = useState([] as any);
  const [accounts, setAccounts] = useState([] as any);
  const [showModalProvider, setShowModalProvider] = useState(false);


  const { register, handleSubmit, reset, watch, setValue } = useForm();

  const onSubmit = async (data: any) => {
    data.product_id = productSelected.id
    data.actual_stock = data.quantity
    data.provider_id = productPrincipal.provider_id
    data.employee_id = productPrincipal.employee_id
    data.document_type = productPrincipal.document_type
    //data.lot = productPrincipal.lot
    data.comment = productPrincipal.comment
    data.product_register_principal = productPrincipal.id
    data.unit_cost = isTaxesActive ? data.unit_cost * 1.13 : data.unit_cost;
    data.sale_price = productSelected?.prices[0]?.price;

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
    if (isAccountActive && (!data.account_name || !data.account_quantity) || isBillsActive && (!data.bills_name || !data.bills_quantity) ) {
      toast.error("Faltan algunos datos importantes para continuar!");
      return
    }
    data.provider_id = data.provider_id ? data.provider_id : providers.data ? providers.data[0].id : 0;
    data.comment = data.comment ? data.comment : "Ingreso de productos";
    data.bills_active = isBillsActive;
    data.account_active = isAccountActive;
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
      await loadLastRegistersPrincipal();
    } catch (error) {
      console.error(error);
      toast.error("Ha ocurrido un error!");
    } finally {
      setIsSending(false)
    }
  }



  const loadProviders = async () => {
    try {
      const response = await getData(`contacts?filterWhere[is_provider]==1&filterWhere[status]==1`);
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




useEffect(() => {
      (async () => { 
        await loadLastRegistersPrincipal();
        await loadLastRegistersPrincipalOpen();
        setCategories(await loadData(`cash/categories`))
        setAccounts(await loadData(`cash/accounts`));
      })();
// eslint-disable-next-line
}, []);

useEffect(() => {
  if (!showModalProvider) {
    (async () => await loadProviders())();
  }
// eslint-disable-next-line
}, [showModalProvider]);



  const handleClickOnProduct = async (product: any) =>{
    try {
      const response = await getData(`products/${product?.id}`);
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


  const deleteProduct = async (iden: string) => {
    try {
      setIsSending(true)
      const response = await postData(`registers/products/${iden}`, "DELETE");
      if (!response.message) {
        setProductSelected({} as Product)
        setValue("quantity", null)
        setValue("unit_cost", null)
        toast.success("Producto eliminado correctamente");
        await loadLastRegistersPrincipal();
        setMessage({});
      } else {
        toast.error("Faltan algunos datos importantes!");
      }
    } catch (error) {
      console.error(error);
      toast.error("Ha ocurrido un error!");
    } finally {
      setIsSending(false)
    }
  }
  
 

  return (
    <div className="grid grid-cols-1 md:grid-cols-10 pb-10">
           <div className="col-span-4 border-r md:border-sky-600">
             <ViewTitle text="AGREGAR PRODUCTOS" />
            <div className="w-full px-4">

          { !productPrincipal?.id ? (
            <form onSubmit={handleSubmit(addRegisterPrincipal)} className="w-full">
              <div className="flex flex-wrap -mx-3 mb-6">

                <div className="w-full md:w-1/2 px-3 mb-2">
                    <label htmlFor="document_number" className={style.inputLabel}>Numero de Documento</label>
                    <input type="text" id="document_number" {...register("document_number")} className={style.input} />
                </div>

                <div className="w-full md:w-1/2 px-3 mb-2">
                    <label htmlFor="document_type" className={style.inputLabel}> Tipo de Documento </label>
                    <select
                          id="document_type" {...register("document_type")} className={style.input} >
                        <option value="0">Ninguno</option>
                        <option value="1">Ticket</option>
                        <option value="2">Factura</option>
                        <option value="3">Credito Fiscal</option>
                    </select>
                </div>

                <div className="w-full md:w-1/2 px-3 mb-2">
                    <label htmlFor="provider_id" className={`${style.inputLabel} clickeable`} onClick={()=>setShowModalProvider(true)}> Proveedor (Click para agregar)</label>
                    <select
                          defaultValue={providers && providers.data && providers.data.length > 0 ? providers.data[0].id : 0}
                          id="provider_id" {...register("provider_id")} className={style.input} >
                          {providers?.data?.map((value: any) => <option key={value.id} value={value.id}> {value.name}</option>)}
                    </select>
                </div>

                <div className="w-full md:w-1/2 px-3 mb-2">
                  <label className={`${style.inputLabel} mb-2`}> Sumar Impuestos </label>
                        <div>
                            <ToggleSwitch
                            checked={isTaxesActive}
                            label={isTaxesActive ? 'Activo' : 'Inactivo'}
                            onChange={() => setIsTaxesActive(!isTaxesActive)} />
                      </div>
                </div>

                <div className="w-full md:w-full px-3 mb-4">
                  <label htmlFor="comment" className={style.inputLabel}> Comentario{" "} </label>
                  <textarea
                    {...register("comment", {})}
                    rows={2}
                    className={`${style.input} w-full`}
                  />
                </div>


                {/* <div className="w-full md:w-full px-2 mb-3 flex justify-center">
                      <div className='mr-2 font-semibold'>Sumar impuestos</div>
                        <div>
                            <ToggleSwitch
                            checked={isTaxesActive}
                            label={isTaxesActive ? 'Activo' : 'Inactivo'}
                            onChange={() => setIsTaxesActive(!isTaxesActive)} />
                      </div>
                </div> */}
                
                <div className="uppercase text-xl font-semibold text-slate-800 m-2 bg-slate-400 w-full px-6 clickeable rounded-md border shadow-md shadow-slate-400" onClick={()=>setIsBillsActive(!isBillsActive)}>{ isBillsActive ? "Cancelar" : "Activar"} ingreso como gasto</div>
                
              {
                isBillsActive && <>
                    <div className=" font-semibold text-lg text-teal-800 text-center uppercase px-2">Información del ingreso de gasto</div>

                    <div className="w-full md:w-full px-3 mb-2">
                      <label htmlFor="bills_name" className={style.inputLabel}>Nombre del Gasto *</label>
                      <input type="text" id="bills_name" {...register("bills_name")} className={style.input} step="any" min={0} />
                    </div>

                    <div className="w-full md:w-1/2 px-3 mb-2">
                      <label htmlFor="bills_payment_type" className={style.inputLabel}> Tipo de pago </label>
                      <select defaultValue={1} id="bills_payment_type" {...register("bills_payment_type")} className={style.input}  >
                        <option value="1">Efectivo</option>
                        <option value="2">Tarjeta</option>
                        <option value="3">Transferencia</option>
                        <option value="4">Cheque</option>
                        <option value="6">BTC</option>
                        <option value="0">Otro</option>
                      </select>
                    </div>
                      
                    <div className="w-full md:w-1/2 px-3 mb-2">
                      <label htmlFor="bills_categories_id" className={`${style.inputLabel}`}> Categoria de gasto </label>
                      <select
                        defaultValue={categories && categories.data && categories.data.length > 0 ? categories.data[0].id : 0}
                        id="bills_categories_id" {...register("bills_categories_id")} className={style.input} >
                        {categories?.data?.map((value: any) => <option key={value.id} value={value.id}> {value.name}</option> )}
                      </select>
                    </div>


                    <div className="w-full md:w-1/2 px-3 mb-2">
                        <label htmlFor="bills_payment_type" className={style.inputLabel}> Tipo de pago </label>
                        <select
                          defaultValue={1}
                          id="bills_payment_type"
                          {...register("bills_payment_type")}
                          className={style.input}
                        >
                          <option value="1">Efectivo</option>
                          <option value="2">Tarjeta</option>
                          <option value="3">Transferencia</option>
                          <option value="4">Cheque</option>
                          <option value="6">BTC</option>
                          <option value="0">Otro</option>
                        </select>
                      </div>


                    {watch("bills_payment_type") != 1 ? <div className="w-full md:w-1/2 px-3 mb-2">
                        <label htmlFor="bills_cash_accounts_id" className={style.inputLabel}> Cuenta de tranferencia </label>
                        <select
                          defaultValue={accounts && accounts.data && accounts.data.length > 0 ? accounts.data[0].id : 0}
                          id="bills_cash_accounts_id"
                          {...register("bills_cash_accounts_id")}
                          className={style.input}
                        >
                          {accounts?.data?.map((value: any) => {
                            return (
                              <option key={value.id} value={value.id}> {value.account}{" | "}{value.bank}{" | $"}{value.balance}</option>
                            );
                          })}
                        </select>
                      </div> :
                      <div className="w-full md:w-1/2 px-3 mb-2">
                        <label className={style.inputLabel}> Cuenta de tranferencia </label>
                        <input className="appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight bg-red-200 focus:outline-none pointer-events-none" readOnly />
                      </div>
                      }


                    <div className="w-full md:w-full px-3 mb-2">
                      <label htmlFor="bills_quantity" className={style.inputLabel}> Cantidad *</label>
                      <input
                        type="number" id="bills_quantity" {...register("bills_quantity")} className={style.input} step="any" min={0} />
                    </div>

                </>
              }
                <div className="uppercase text-xl font-semibold text-slate-800 m-2 bg-slate-400 w-full px-6 clickeable rounded-md border shadow-md shadow-slate-400" onClick={()=>setIsAccountActive(!isAccountActive)}>{ isAccountActive ? "Cancelar" : "Activar"} ingreso de cuenta por pagar</div>

              { 
                isAccountActive && <>
              <div className=" font-semibold text-lg text-teal-800 text-center uppercase px-2">Información de la cuenta por pagar</div>
              <div className="w-full md:w-full px-3 mb-2">
                    <label htmlFor="account_name" className={style.inputLabel}>Nombre de la cuenta *</label>
                    <input type="text" id="account_name" {...register("account_name")} className={style.input} step="any" min={0} />
                </div>

                <div className="w-full md:w-1/2 px-3 mb-2">
                    <label htmlFor="account_quantity" className={style.inputLabel}> Cantidad *</label>
                    <input type="number" id="account_quantity" {...register("account_quantity")} className={style.input} step="any" min={0} />
                </div>

                
                <div className="w-full md:w-1/2 px-3 mb-2">
                    <label htmlFor="account_expiration" className={style.inputLabel}>
                      Fecha de vencimiento
                    </label>
                    <input type="date" id="account_expiration" {...register("account_expiration")} className={style.input} />
                  </div>
                </>
              }

              </div>

              {message.errors && (
                <div className="mb-4">
                  <Alert theme={PresetTheme.danger} info="Error" text={JSON.stringify(message.message)} isDismisible={false} />
                </div>
              )}

              <div className="flex justify-center">
              <Button type="submit" disabled={isSending} preset={isSending ? Preset.saving : Preset.save} />
              </div>

            </form>

          ) : (


            <div>
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
                  <div>{ productPrincipal.comment }</div>
                </div>
                <div className="flex justify-between border-b-2">
                  <div>{ isTaxesActive ? "Productos con impuestos incluidos" : "Productos sin impuestos" }</div>
                </div>
              </div>

              <div className="my-4">
                <SearchInputProduct recordSelected={handleClickOnProduct} placeholder="Buscar Producto" 
                url="products?sort=description&filterWhere[status]==1&filterWhere[is_restaurant]==0&selected=id,cod,description,product_type&included=prices" />
              </div>
              
              <form onSubmit={handleSubmit(onSubmit)} className="w-full">
              <div className="flex flex-wrap -mx-3 mb-6">


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

                <div className="w-full md:w-1/2 px-3 mb-2">
                    <label htmlFor="lot" className={style.inputLabel}> Lote </label>
                    <input type="text" id="lot" {...register("lot")} className={style.input} />
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
            </div>
          ) }
          </div>
         </div>

         <div className="col-span-6 border-r md:border-sky-600">
         <ViewTitle text="ULTIMA ENTRADA" />
         <div className="w-full p-4">
            <ProductRegisterPrincipalTable records={lastProductsPrincipal} isLoading={isLoading} />
          </div>
         <ViewTitle text="PRODUCTOS" />
          <div className="w-full p-4">
            <ProductRegisterTable productPrincipal={productPrincipal?.id} onDelete={deleteProduct} records={lastProductsPrincipal ? lastProductsPrincipal[0]?.registers : []} isLoading={isLoading} />
          </div>
          { productPrincipal?.id && <Button disabled={isSending} preset={isSending ? Preset.saving : Preset.cancel} text="Terminar ingreso" onClick={()=>finishRegister()} isFull /> }
        </div>
        <ContactAddModal isShow={showModalProvider} onClose={()=>setShowModalProvider(false)} />
      <Toaster position="top-right" reverseOrder={false} />
   </div>
  )
}
