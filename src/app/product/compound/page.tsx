"use client"
import { useState, useEffect } from "react";
import { Loading, Pagination, ProductsTable, RightSideProducts, ViewTitle } from "@/components";
import { getData, postData } from "@/services/resources";
import { usePagination } from "@/components/pagination";
import { useSearchTerm } from "@/hooks/useSearchTerm";
import { RowTable } from "@/components/table/products-table";
import toast, { Toaster } from 'react-hot-toast';


export default function Compounds() {
  const [isLoading, setIsLoading] = useState(false);
  const [productos, setProductos] = useState([]);
  const {currentPage, handlePageNumber} = usePagination("&page=1");
  const { searchTerm, handleSearchTerm } = useSearchTerm()

  const loadData = async () => {
    setIsLoading(true);
    try {
      const response = await getData(`composed?sort=-created_at&perPage=10${currentPage}${searchTerm}`);
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
      toast.success( response.message);
    await loadData();
  } catch (error) {
    console.error(error);
      toast.error("Ha ocurrido un error!");
  } 
}

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 pb-10">
           <div className="col-span-3">
             <ViewTitle text="BAJAS EXISTENCIAS" />
             { isLoading ? <Loading /> : <>
                <ProductsTable 
                products={productos}
                onDelete={deleteProduct} 
                withOutRows={[RowTable.brand, RowTable.category]}
                 />
                <Pagination 
                products={productos}
                handlePageNumber={handlePageNumber } 
                />
                </>
              }
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
