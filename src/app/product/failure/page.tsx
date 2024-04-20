"use client";
import { useEffect, useState } from "react";
import { Loading, Pagination, ViewTitle } from "@/components";
import { getData, postData } from "@/services/resources";
import { useForm } from "react-hook-form";
import toast, { Toaster } from 'react-hot-toast';
import { Button, Preset } from "@/components/button/button";
import { style } from "@/theme";
import { SalesSearchByName } from "@/components/sales-components/sales-search-by-name";
import { ProductFailureTable } from "@/components/products-components/product-failure-table";
import { ProductFailureProductsTable } from "@/components/products-components/product-failure-products-table";
import { usePagination } from "@/hooks/usePagination";


export default function InsertProduct() {
  const [initialData, setInitialData] = useState<any>({});
  const { register, handleSubmit, reset, watch, setValue } = useForm();
  const [isSending, setIsSending] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [productSelected, setProductSelected] = useState(null as any);
  const [failures, setFailures] = useState(null as any);
  const [randomNumber, setRandomNumber] = useState(0);
  const {currentPage, handlePageNumber} = usePagination("&page=1");


  const loadData = async () => {
    setIsLoading(true)
      try {
        const response = await getData(`failures/active`);
        if(response.data){
            setIsActive(true);
            setInitialData(response?.data)
            reset();
        } else {
          const responseFailures = await getData(`failures?sort=-created_at&included=employee,failures,failures.employee,failures.deleted_by,failures.product&filter[status]=2&perPage=10${currentPage}`);
          if (responseFailures) {
            setFailures(responseFailures)
          }
        }
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false)
      }
  };


  useEffect(() => {
      (async () => { await loadData() })(); 
    // eslint-disable-next-line
  }, [randomNumber, currentPage]);


  const onSubmit = async (data: any) => {
      if (!data.type || !data.reason) {
        toast.error("Debe ingresar ambos datos");
        return 
      }
      try {
        setIsSending(true);
        const response = await postData(`failures/principal`, "POST", data);
        if (response.type == "error") {
          toast.error("Faltan algunos datos importantes!");
        } else {
          toast.success("Registro agregado correctamente");
          setIsActive(true);
          setInitialData(response?.data)
          reset();
        }
      } catch (error) {
        console.error(error);
        toast.error("Ha ocurrido un error!");
      } finally {
        setIsSending(false);
      }
  };

  const addProduct = async (data:any) => {
    if (!data.quantity || !initialData?.reason) {
      toast.error("Debe ingresar la cantidad");
      return 
    }
      data.product_id = productSelected?.id
      data.failure_id = initialData?.id
      data.type = initialData?.type
      data.reason = initialData?.reason
      try {
        setIsSending(true);
        const response = await postData(`failures`, "POST", data);
        if (response.type === "error") {
          toast.error("Faltan algunos datos importantes!");
        } else {
          toast.success("Producto agregado correctamente");
          setInitialData(response?.data)
          setProductSelected(null)
          reset();
        }
      } catch (error) {
        console.error(error);
        toast.error("Ha ocurrido un error!");
      } finally {
        setIsSending(false);
      }
  }


  const deleteProduct = async (iden: string) => {
    try {
      const response = await postData(`failures/${iden}`, 'DELETE');
      if(response?.type === "error"){
        toast.error(response.message);
      } else {
        toast.success("Registro Eliminado");
        setInitialData(response?.data)
      }
    } catch (error) {
      console.error(error);
      toast.error("Ha ocurrido un error!");
    } 
  }


  const saveOrder = async () => {
    try {
      const response = await postData(`failures/${initialData.id}`, 'PUT', { status: 2 });
      if(response?.type === "error"){
        toast.error("Error al guardar");
      } else {
        toast.success("Registro Guardado Correctamente");
        setInitialData(null)
        setIsActive(false);
        setRandomNumber(Math.random())
      }
    } catch (error) {
      console.error(error);
      toast.error("Ha ocurrido un error!");
    } 
  }


  const deleteOrder = async () => {
    try {
      const response = await postData(`failures/principal/${initialData.id}`, 'DELETE');
      if(response?.type === "error"){
        toast.error("Error al eliminar");
      } else {
        toast.success("Registro Eliminado Correctamente");
        setInitialData(null)
        setIsActive(false);
        setProductSelected(null)
        reset();
        setRandomNumber(Math.random())
      }
    } catch (error) {
      console.error(error);
      toast.error("Ha ocurrido un error!");
    } 
  }



  return (
    <div className="grid grid-cols-1 md:grid-cols-10 pb-10">
      <div className="col-span-4">
        <ViewTitle text="DESCONTAR PRODUCTOS" />
        { isLoading ? <Loading /> : !isActive ? 
        <div className="w-full px-4">
            <form onSubmit={handleSubmit(onSubmit)} className="w-full">
              <div className="flex flex-wrap -mx-3 mb-6">

                <div className="w-full px-3 mb-2">
                    <label htmlFor="type" className={style.inputLabel}> Tipo de Salida </label>
                    <select id="type" {...register("type")} className={style.input} >
                        <option value="1">Averia</option>
                        <option value="2">Traslado</option>
                        <option value="3">Devolución</option>
                    </select>
                </div>

                  <div className="w-full px-3 mb-4">
                  <label htmlFor="reason" className={style.inputLabel}>
                    Razón de averia{" "}
                  </label>
                  <textarea {...register("reason", {})} rows={2} className={`${style.input} w-full`} />
                </div>

                <div className='w-full'>
                <span className="float-right">
                <Button type="submit" disabled={isSending} preset={isSending ? Preset.saving : Preset.save} />
                </span>
              </div>

              </div>
            </form>
          </div> : 
          <div>
            
            <SalesSearchByName onSubmit={setProductSelected} typeOfSearch={true} setTypeOfSearch={()=>{}} showButton={false} />
            <div className="m-4 p-2 border-2 shadow-xl rounded-md uppercase">
              { initialData?.reason}
            </div>
            {
              productSelected && 
              <div className="m-4 border-2 shadow-xl rounded-md">
                <div className="m-4">
                  <div className="text-center text-xl font-semibold uppercase text-cyan-900">Producto seleccionado</div>
                  <div className="text-xl font-semibold uppercase">{ productSelected?.description }</div>
                  <div className="text-xl font-semibold flex justify-between">
                    <span>Codigo: { productSelected?.cod } </span><span className="text-right">Cantidad: { productSelected?.quantity }</span></div>
                </div>
                <div className="m-4 border-2 shadow-xl rounded-md">

                <form onSubmit={handleSubmit(addProduct)} className="w-full">
                    <div className="flex flex-wrap mb-6">

                      <div className="w-full px-3 mb-2">
                        <label htmlFor="prescription" className={style.inputLabel}>
                          Cantidad{" "}
                        </label>
                        <input type="number" id="quantity" {...register("quantity")} className={style.input} step="any" min={0} />
                      </div>

                      <div className='w-full'>
                      <span className="float-right mr-4">
                      <Button type="submit" disabled={isSending} preset={isSending ? Preset.saving : Preset.save} />
                      </span>
                      <span className="float-right mr-4">
                      <Button text="Cancelar" disabled={isSending} preset={Preset.cancel} onClick={()=>setProductSelected(null)} />
                      </span>
                    </div>

                    </div>
                  </form>

                </div>
              </div>
              
            }
          </div>
        }


      </div>

      <div  className="col-span-6">
        <ViewTitle text="ULTIMOS REGISTROS" />
        <div className="mx-4">
        { isActive ? <div>
          <ProductFailureProductsTable records={initialData?.failures} onDelete={deleteProduct} />
        </div> :
        <div>  
          <ProductFailureTable records={failures?.data} />
          <Pagination records={failures} handlePageNumber={handlePageNumber}  />
        </div>
        }
        </div>
            <div className='w-full mt-4 '>
            { isActive && <span className="float-right mx-4">
                <Button text={`${initialData?.failures?.length > 0 ? "Guardar todo" : "Cancelar"}`} disabled={isSending} 
                preset={initialData?.failures?.length > 0 ? isSending ? Preset.saving : Preset.save : Preset.cancel} 
                onClick={initialData?.failures?.length > 0 ? ()=>saveOrder() : ()=>deleteOrder()}/>
                </span> }
            </div>
      </div>
      <Toaster position="top-right" reverseOrder={false} />
    </div>
  );
}
