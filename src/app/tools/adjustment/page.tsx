'use client'

import { useEffect, useState } from "react";
import { Alert, Pagination, ViewTitle } from "@/components"
import { postData } from "@/services/resources";
import toast, { Toaster } from 'react-hot-toast';
import { loadData } from "@/utils/functions";
import { Button, Preset } from "@/components/button/button";
import { usePagination } from "@/hooks/usePagination";
import { useSearchTerm } from "@/hooks/useSearchTerm";
import { RightSideSearch } from "@/components/right-side/right-side-search";
import { PresetTheme } from "@/services/enums";
import { AdjustmentProductsTable } from "@/components/tools-components/adjustment-products-table";

export default function Page() {
  const [isSending, setIsSending] = useState(false);
  const [products, setProducts] = useState([] as any);
  const [ adjustment, setAdjustment ] = useState([] as any)
  const [ adjustmentRecord, setAdjustmentRecord ] = useState([] as any)
  const {currentPage, handlePageNumber} = usePagination("&page=1");
  const { searchTerm, handleSearchTerm } = useSearchTerm(["cod", "name"], 500);
  const [randomNumber, setRandomNumber] = useState(0);


  const startAdjustment = async() =>{
    try {
      setIsSending(true);
      const response = await postData(`adjustment`, "POST", {status: 1});
        setAdjustment(response);
        toast.success("Datos obtenidos correctamente");
    } catch (error) {
      console.error(error);
      toast.error("Ha ocurrido un error!");
    } finally {
      setIsSending(false);
    }
  }
  

  const finishAdjustment = async() =>{
    try {
      setIsSending(true);
      const response = await postData(`adjustment/finish`, "POST", {status: 2});
        if (response.type == "successful") {
          setAdjustment([]);
          setProducts([])
          toast.success("Ajuste completado correctamente");  
        } else {
          toast.error("Error al finalizar!");
        }
    } catch (error) {
      console.error(error);
      toast.error("Ha ocurrido un error!");
    } finally {
      setIsSending(false);
    }
  }


useEffect(() => {
    (async () => setAdjustment(await loadData(`adjustment`)))();
  // eslint-disable-next-line
}, []);

useEffect(() => {
  if (adjustment?.type == "successful") {
    (async () => setProducts(await loadData(`adjustment/products?sort=-created_at&perPage=25${currentPage}${searchTerm}`)))();
  }
  // eslint-disable-next-line
}, [currentPage, searchTerm, adjustment, randomNumber]);
console.log(products)
  return (
    <div className="grid grid-cols-1 md:grid-cols-10 pb-10">
        <div className="col-span-7 border-r md:border-sky-600">
          <ViewTitle text="AJUSTE DE INVENTARIO" />
          { 
          products?.data && products?.meta?.total > 0 ? 
          <div>
            <AdjustmentProductsTable records={products} isLoading={isSending} random={setRandomNumber} />
            <Pagination records={products} handlePageNumber={handlePageNumber } />
          </div> :
          <div className="my-4">
            <div className="flex justify-center m-8">
              <Alert info="Nota importante:" isDismisible={false} theme={PresetTheme.info} text="No se ha iniciado el ajuste de inventario. Con esta herramienta podrá ajustar su inventario con los datos reales" />
            </div>
            <div className="m-8">
              <Button onClick={startAdjustment} isFull={true} preset={isSending? Preset.saving : Preset.save} text="Iniciar ajuste de inventario" />
            </div>
          </div>
          }

        </div>
        <div className="col-span-3">
        <ViewTitle text="ULTIMOS REGISTROS" />
          <div className="flex flex-wrap m-4 shadow-lg border-2 rounded-md mb-8">
          <RightSideSearch handleSearchTerm={handleSearchTerm} />
          </div>
          {
          products?.meta && products?.meta?.total >= 0 &&
          <div className="m-2">
            <Button onClick={finishAdjustment} isFull={true} preset={isSending? Preset.saving : Preset.save} text="Finalizar ajuste de inventario" />
          </div>
          }
        </div>
      <Toaster position="top-right" reverseOrder={false} />
    </div>
  )
}
