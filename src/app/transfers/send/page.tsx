'use client'

import { Alert, Loading, ViewTitle } from "@/components"
import { Button, Preset } from "@/components/button/button";
import { TransferProductListTable } from "@/components/transfers-components/products-list-table";
import { SelectGuest } from "@/components/transfers-components/select-guest";
import { TransfersListTable } from "@/components/transfers-components/transfers-list-table";
import { useSearchTerm } from "@/hooks/useSearchTerm";
import { PresetTheme } from "@/services/enums";
import { getTenant } from "@/services/oauth";
import { Product } from "@/services/products";
import { getData, postData } from "@/services/resources";
import { style } from "@/theme";
import { SearchIcon } from "@/theme/svg";
import { getFirstElement } from "@/utils/functions";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast, Toaster } from "react-hot-toast";

export default function Page() {
const [isTransferSelected, setIsTransferSelected] = useState("") as any;
const [allTransfers, setAllTransfers] = useState([]);
const [linkedSystems, setLinkedSystems] = useState([]);
const [products, setProducts] = useState([]);
const [productSelected, setProductSelected] = useState<Product>({} as Product);
const { register, handleSubmit, reset, watch, setValue } = useForm();
const [productsAdded, setProductsAdded] = useState([] as any);
const [isSending, setIsSending] = useState(false);
const [isloading, setIsloading] = useState(false);
const [message, setMessage] = useState<any>({});
const { searchTerm, handleSearchTerm } = useSearchTerm(["cod", "description"], 500);
const [randomNumber, setRandomNumber] = useState(0);
const tenant = getTenant();


const initialData = async () =>{
  try {
    setIsloading(true)
    const response = await getData(`transfers?sort=-created_at&filter[to_tenant_id]=-${tenant}&included=products,to,from`);
    if (!response.message) {
      let first = getFirstElement(response.data);
      if (first?.status == 1) {
        setIsTransferSelected(first)
        setProductsAdded({data: first.products});
      } else {
        setLinkedSystems(await getData(`linkedsystems`));
      }
      setAllTransfers(response)
    } else {
      toast.error(response.message);
    }
  } catch (error) {
    console.error(error);
    toast.error("Ha Ocurrido un Error!");
  } finally {
    setIsloading(false)
  }
}


useEffect(() => {
    (async () => await initialData())();
}, [randomNumber]);



const handleIsGuestSelected = async (record: any)=>{
  let data = { to_tenant_id : record.to_tenant_id, from_tenant_id : record.from.id }
  try {
    setIsSending(true)
    const response = await postData(`transfers`, "POST", data);
    if (!response.message) {
      setIsTransferSelected(response.data)
      setProductsAdded({ data: []});
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


const onSubmit = async (data: any) => {
  data.transfer_id = isTransferSelected.id
  data.product_id = productSelected.id
  data.cod = productSelected.cod
  data.description = productSelected.description
  data.status = 1

  try {
    setIsSending(true)
    const response = await postData(`transfers/products`, "POST", data);
    if (!response.message) {
        if (productsAdded?.data) {
          const newState = { ...productsAdded };
          newState.data = [...newState.data, response.data];
          setProductsAdded(newState);
        } else {
          setProductsAdded(response);
        }

      setProductSelected({} as Product)
      setValue("quantity", null)
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
  }
}


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
  handleSearchTerm(watch('search'))
// eslint-disable-next-line
}, [watch('search')]);


const handleCancelAll = async () =>{
  try {
    setIsSending(true)
    const response = await postData(`transfers/${isTransferSelected.id}`, "DELETE");
    if (!response.message) {
      setIsTransferSelected("")
      setProductsAdded({ data: []});
      setRandomNumber(Math.random())
      toast.success("Tranferencia Cancelada");
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

const handleSaveAll = async () =>{
  try {
    setIsSending(true)
    const response = await postData(`transfers/${isTransferSelected.id}`, "PUT", { status : 2 });
    if (!response.message) {
      setIsTransferSelected("")
      setProductsAdded({ data: []});
      setRandomNumber(Math.random())
      toast.success("Tranferencia Enviada");
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

if(isloading) return <Loading />

  return (
    <div className="grid grid-cols-1 md:grid-cols-10 pb-10">
    <div className={`${isTransferSelected ? "col-span-5" : "col-span-4"} border-r md:border-sky-600`}>
          <ViewTitle text={isTransferSelected ? "AGREGAR PRODUCTOS" : "NUEVA TRANSFERENCIA"} />
          { isTransferSelected ? 
            <div className="w-full px-4">
            
              <div className=" font-semibold m-4">
                <div className="flex justify-between border-b-2">
                  <div>Enviar a: </div>
                  <div>{ isTransferSelected?.from?.name }</div>
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

            </div>

            { productSelected?.id && (<>
            <form onSubmit={handleSubmit(onSubmit)} className="w-full">
            <div className="flex flex-wrap -mx-3 mb-6">
              
                
              <div className='w-full font-bold text-lg text-teal-900 border-b-2 mb-2'>{productSelected?.description}</div>
                <div className="w-full px-3 mb-2">
                    <label htmlFor="quantity" className={style.inputLabel}> Cantidad </label>
                    <input type="number" id="quantity" {...register("quantity")} className={style.input} step="any" min={0} />
                </div>
              

              {message.errors && (
                <div className="mb-4">
                  <Alert theme={PresetTheme.danger} info="Error" text={JSON.stringify(message.message)} isDismisible={false} />
                </div>
              )}
              </div>
              <div className="flex justify-end">
                  <Button type="submit" disabled={isSending} preset={isSending ? Preset.saving : Preset.save} />
              </div>
              </form>
              </>)}

            </div> : 
            <SelectGuest records={linkedSystems} isGuestSelected={handleIsGuestSelected} />
          }
    </div>
    <div className={isTransferSelected ? "col-span-5" : "col-span-6"}>
      <ViewTitle text={isTransferSelected ? "PRODUCTOS AGREGADOS" : "ULTIMAS TRANSFERENCIAS"} />
        {
          isTransferSelected ? <div>
          <TransferProductListTable records={productsAdded} products={setProductsAdded}/> 
            <div className="grid grid-cols-1 md:grid-cols-10 m-4">
              <div className="col-span-3 m-1"><Button isFull disabled={isSending} preset={Preset.cancel} text="Cancelar" onClick={handleCancelAll} /></div>
              <div className="col-span-7 m-1">
                { productsAdded?.data?.length > 0 && <Button isFull disabled={isSending} preset={isSending ? Preset.saving : Preset.save} text="Enviar todo" onClick={handleSaveAll} />
                }</div>
            </div>
          </div>: 
          <TransfersListTable records={allTransfers} />
        }
    </div>
    <Toaster position="top-right" reverseOrder={false} />
</div>
  )
}
