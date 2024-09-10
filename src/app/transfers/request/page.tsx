'use client'

import { Alert, ViewTitle } from "@/components"
import { Button, Preset } from "@/components/button/button";
import { SearchInputProduct } from "@/components/form/search-product";
import { TransferProductListTable } from "@/components/transfers-components/products-list-table";
import { SelectGuest } from "@/components/transfers-components/select-guest";
import { TransfersListTable } from "@/components/transfers-components/transfers-list-table";
import { PresetTheme } from "@/services/enums";
import { getTenant } from "@/services/oauth";
import { Product } from "@/services/products";
import { getData, postData } from "@/services/resources";
import { style } from "@/theme";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast, Toaster } from "react-hot-toast";

export default function Page() {
const [isTransferSelected, setIsTransferSelected] = useState("") as any;
const [allTransfers, setAllTransfers] = useState([]);
const [linkedSystems, setLinkedSystems] = useState([]);
const [productSelected, setProductSelected] = useState<Product>({} as any);
const { register, handleSubmit, reset, watch, setValue } = useForm();
const [productsAdded, setProductsAdded] = useState([] as any);
const [isSending, setIsSending] = useState(false);
const [isLoading, setIsLoading] = useState(false);
const [message, setMessage] = useState<any>({});
const [randomNumber, setRandomNumber] = useState(0);
const tenant = getTenant();



// obtiene el primer elemento de un arreglo
const getElement = (items: any)=> {
    const elementsWithStatus1 = items.filter((element: any) => element.status === 6);
  
    if (elementsWithStatus1 && elementsWithStatus1.length > 0) {
        const firstElementWithStatus1 = elementsWithStatus1[0];
        return firstElementWithStatus1;
    } else {
        return null;
    }
  }

const initialData = async () =>{
  try {
    setIsLoading(true)
    const response = await getData(`transfers?sort=-created_at&filter[to_tenant_id]==${tenant}&included=products,to,from`);
    if (!response.message) {
      let first = getElement(response.data);
      if (first?.status == 6) {
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
    setIsLoading(false)
  }
}


useEffect(() => {
    (async () => await initialData())();
      // eslint-disable-next-line
}, [randomNumber]);



const handleIsGuestSelected = async (record: any)=>{
  let data = { from_tenant_id : record.to_tenant_id, to_tenant_id : record.from.id, requested_at : true, requested_by : true, status : 6 }
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


const handleClickOnProduct = async (product: any) =>{
  if (!product?.id) return

  try {
    const response = await getData(`products/${product?.id}`);
    if (!response.message) {
      setProductSelected(response.data)
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
  data.requested = data.quantity
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
    const response = await postData(`transfers/request/${isTransferSelected.id}`, "PUT", { status: 7 });
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


const getProductsOnline = async (transfer: any) => {
  try {
    setIsSending(true);
    const response = await postData(`transfers/online/${transfer.id}`, "PUT", { is_online: 0 });
    if (!response.message) {
      await initialData()
      toast.success("Productos devueltos correctamente");
    } else {
      toast.error("Faltan algunos datos importantes!");
    }
  } catch (error) {
    console.error(error);
    toast.error("Ha ocurrido un error!");
  } finally {
    setIsSending(false);
  }
}


const getRequest = async (tansferId: string) =>{
    try {
      setIsSending(true)
      const response = await postData(`transfers/request/${tansferId}`, "PUT", { status : 6 });
      if (!response.message) {
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


  const updateStatus = async (transfer: string, status: number, reset = false) =>{
    try {
      setIsSending(true)
      const response = await postData(`transfers/update/${transfer}`, "PUT", { status });
      if (response.type == "successful") {
        if(reset){
          setIsTransferSelected("")
          setProductsAdded({ data: []});
        }
        setRandomNumber(Math.random())
        toast.success("Cambios efectuados");
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
    <div className={`${isTransferSelected ? "col-span-5" : "col-span-4"} border-r md:border-sky-600`}>
          <ViewTitle text={isTransferSelected ? "AGREGAR PRODUCTOS" : "NUEVA SOLICITUD"} />
          { isTransferSelected ? 
            <div className="w-full px-4">
            
              <div className=" font-semibold m-4">
                <div className="flex justify-between border-b-2">
                  <div>Enviar solicitud a: </div>
                  <div className="uppercase">{ isTransferSelected?.from?.description }</div>
                </div>
              </div>


              <div className="m-4">
              <SearchInputProduct recordSelected={handleClickOnProduct} placeholder="Buscar Producto" 
              url="products?sort=description&filterWhere[status]==1&filterWhere[is_restaurant]==0&selected=id,cod,description,product_type&included=prices" />
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
            <SelectGuest records={linkedSystems} isGuestSelected={handleIsGuestSelected} isLoading={isLoading} />
          }
    </div>
    <div className={isTransferSelected ? "col-span-5" : "col-span-6"}>
      <ViewTitle text={isTransferSelected ? "PRODUCTOS AGREGADOS" : "ULTIMAS SOLICITUDES"} />
        {
          isTransferSelected ? <div>
          <TransferProductListTable records={productsAdded} products={setProductsAdded} deleteActive={true} handleUpdateQuantity={()=>{}}/> 
            <div className="grid grid-cols-1 md:grid-cols-10 m-4">
              <div className="col-span-3 m-1">
                <Button isFull disabled={isSending} preset={Preset.cancel} text="Cancelar" onClick={handleCancelAll} />
              </div>
              <div className="col-span-7 m-1">
                { productsAdded?.data?.length > 0 && <Button isFull disabled={isSending} preset={isSending ? Preset.saving : Preset.save} text="Enviar solicitud" onClick={handleSaveAll} />
                }</div>
            </div>
          </div>: 
          <TransfersListTable isSending={isSending} getProductsOnline={getProductsOnline} records={allTransfers} getRequest={getRequest} updateStatus={updateStatus}/>
        }
    </div>
    <Toaster position="top-right" reverseOrder={false} />
</div>
  )
}
