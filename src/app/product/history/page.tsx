"use client"
import { useState, useEffect } from "react";
import { Loading, Pagination, ProductsTable, RightSideProducts, ViewTitle } from "@/components";
import { usePagination } from "@/components/pagination";
import { useSearchTerm } from "@/hooks/useSearchTerm";
import toast, { Toaster } from 'react-hot-toast';
import { AddNewDownloadLink } from "@/hooks/addNewDownloadLink";
import { loadData, urlConstructor } from "@/utils/functions";


import { InventoryHistoryTable } from "@/components/products-components/inventory-history-table";
import { LinksList } from "@/components/common/links-list";
import { Date, DateValue } from "@/components/form/date";




export default function LowStocks() {
  const [products, setProducts] = useState([]);
  const {currentPage, handlePageNumber} = usePagination("&page=1");
  const [isSending, setIsSending] = useState(false);
  const { links, addLink} = AddNewDownloadLink()


const handlegetInventory = async (data: DateValue) => {
    try {
      setIsSending(true);
      let url = urlConstructor(data, 'inventory/history')
      const response = await loadData(url);
      if (!response.message) {
        toast.success("Datos obtenidos correctamente");
        setProducts(response);
        if(response.data.length > 0) addLink(links, data, 'excel/inventoryHistory');
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
 
 
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 pb-10">
           <div className="col-span-3">
             <ViewTitle text="HISTORIAL DE INVENTARIO" />
             <InventoryHistoryTable records={products} isLoading={isSending} />
               <Pagination 
                records={products}
                handlePageNumber={handlePageNumber } 
                />
         </div>
         <div>
         <div className="col-span-3">
                   <ViewTitle text="SELECCIONAR FECHA" />
                   <Date onSubmit={handlegetInventory} />
                   <LinksList links={links} />
                 </div>
         </div>
         <Toaster position="top-right" reverseOrder={false} />
   </div>
  )
}
