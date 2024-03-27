'use client'
import { useState, useEffect } from "react";
import { getData, postData } from "@/services/resources";
import { ProductsTable, RightSideProducts, Loading, Pagination, ViewTitle } from "@/components";
import { usePagination } from "@/components/pagination";
import { useSearchTerm } from "@/hooks/useSearchTerm";
import toast, { Toaster } from 'react-hot-toast';
import { RowTable } from "@/components/products-components/products-table";
import { LinksList } from "@/components/common/links-list";
import { getUrlFromCookie } from "@/services/oauth";

export default function ViewProducts() {
  const [isLoading, setIsLoading] = useState(false);
  const [productos, setProductos] = useState([]);
  const [ statics, setStatics ] = useState([])
  const [ links, setLinks ] = useState([] as any)
  const {currentPage, handlePageNumber} = usePagination("&page=1");
  const { searchTerm, handleSearchTerm } = useSearchTerm(["cod", "description"], 500);
  const remoteUrl = getUrlFromCookie();

  const loadData = async () => {
      setIsLoading(true);
      try {
        const response = await getData(`products?sort=-created_at&perPage=10${currentPage}${searchTerm}`);
        setProductos(response);
        setLinks([{"name": `DESCARGAR INVENTARIO`, "link": encodeURI(`${remoteUrl}/download/excel/inventory/`), "isUrl": true}])
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


  useEffect(() => {
    (async () => {
      try {
        const data = await getData("special/products");
        setStatics(data);
      } catch (error) {
        console.error(error);
      }
    })();
  }, [productos]);


  const deleteProduct = async (iden: number) => {
    try {
      const response = await postData(`products/${iden}`, 'DELETE');
      toast.success(response.message);
      await loadData();
    } catch (error) {
      console.error(error);
      toast.error("Ha ocurrido un error!");
    } 
  }

  return (
       <div className="grid grid-cols-1 md:grid-cols-4 pb-10">
              <div className="col-span-3">
                <ViewTitle text="PRODUCTOS" />

              { isLoading ? <Loading /> : <>
                <ProductsTable 
                products={productos}
                onDelete={deleteProduct} 
                withOutRows={[RowTable.brand]}
                 />
                <Pagination 
                records={productos}
                handlePageNumber={handlePageNumber } 
                />
                </>
              }
            </div>
            <div>
                <RightSideProducts 
                products={productos}
                handleSearchTerm={handleSearchTerm}
                statics={statics}
                 />

              <LinksList links={links} />
            </div>
      <Toaster position="top-right" reverseOrder={false} />
      </div>
      );
}
