"use client"
import { useState, useEffect } from "react";
import { Loading, Pagination, ProductsTable, RightSideProducts, ViewTitle } from "@/components";
import { getData, postData } from "@/services/resources";
import { usePagination } from "@/components/pagination";
import { useSearchTerm } from "@/hooks/useSearchTerm";
import { RowTable } from "@/components/products-components/products-table";
import toast, { Toaster } from 'react-hot-toast';
import SkeletonTable from "@/components/common/skeleton-table";



export default function LowStocks() {
  const [isLoading, setIsLoading] = useState(false);
  const [productos, setProductos] = useState([]);
  const {currentPage, handlePageNumber} = usePagination("&page=1");
  const { searchTerm, handleSearchTerm } = useSearchTerm(["cod", "description"], 500);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const response = await getData(`inventory/lowstock?sort=-created_at&perPage=10${currentPage}${searchTerm}`);
      setProductos(response);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
};
  

useEffect(() => {
  (async () => {
    await loadData();
  })();
  // eslint-disable-next-line
}, [currentPage, searchTerm]);

const deleteProduct = async (iden: number) => {
  try {
    const response = await postData(`products/${iden}`, 'DELETE');
    if (response.type == "error") {
      toast.error(response.message);
    } else {
      toast.success(response.message);
      await loadData();
    }
  } catch (error) {
    console.error(error);
    toast.error("Ha ocurrido un error!");
  } 
}


const updatePrice = async (code: any) =>{
  setIsLoading(true);
  try {
    const response = await getData(code ? `get/price/${code}` : `get/prices`);
    if (response.type == 'successful') {
      await loadData();
    } else {
      toast.error(response.message);
    }
  } catch (error) {
    console.error(error);
  } finally {
    setIsLoading(false);
  }
}



  return (
    <div className="grid grid-cols-1 md:grid-cols-4 pb-10">
           <div className="col-span-3">
             <ViewTitle text="BAJAS EXISTENCIAS" />
             { isLoading ? <SkeletonTable rows={11} columns={7} /> :
                <ProductsTable 
                products={productos}
                onDelete={deleteProduct} 
                withOutRows={[RowTable.brand, RowTable.category]}
                updatePrice={updatePrice}
                 />
                 
              }
               <Pagination 
                records={productos}
                handlePageNumber={handlePageNumber } 
                />
         </div>
         <div>
         <ViewTitle text="BUSQUEDA" />
         <RightSideProducts
                products={productos}
                handleSearchTerm={handleSearchTerm}
                 />
         </div>
         <Toaster position="top-right" reverseOrder={false} />
   </div>
  )
}
