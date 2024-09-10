"use client"
import { useState, useEffect } from "react";
import { Loading, Pagination, ProductsTable, RightSideProducts, ViewTitle } from "@/components";
import { getData, postData } from "@/services/resources";
import { usePagination } from "@/components/pagination";
import { useSearchTerm } from "@/hooks/useSearchTerm";
import { RowTable } from "@/components/products-components/products-table";
import toast, { Toaster } from 'react-hot-toast';
import SkeletonTable from "@/components/common/skeleton-table";


export default function Linkeds() {
  const [isLoading, setIsLoading] = useState(false);
  const [productos, setProductos] = useState([]);
  const {currentPage, handlePageNumber} = usePagination("&page=1");
  const { searchTerm, handleSearchTerm } = useSearchTerm(["cod", "description"], 500);

  // products?sort=description&filterWhere[is_restaurant]==0&selected=id,cod,description,product_type&included=prices
  // linked?sort=description&perPage=10${currentPage}${searchTerm}
  const loadData = async () => {
    setIsLoading(true);
    try {
      const response = await getData(`products?sort=description&filterWhere[status]==1&filterWhere[is_restaurant]==0&filterWhere[product_type]==3&included=prices,category,quantityUnit,provider,brand&perPage=10${currentPage}${searchTerm}`);
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

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 pb-10">
           <div className="col-span-3">
             <ViewTitle text="BAJAS EXISTENCIAS" />
             { isLoading ? <SkeletonTable rows={11} columns={7} /> :
                <ProductsTable 
                products={productos}
                onDelete={deleteProduct} 
                withOutRows={[RowTable.brand, RowTable.category]}
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
