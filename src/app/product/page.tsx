'use client'
import { useState, useEffect, useContext } from "react";
import { getData, postData } from "@/services/resources";
import { RightSideProducts, Pagination, ViewTitle } from "@/components";
import { usePagination } from "@/components/pagination";
import { useSearchTerm } from "@/hooks/useSearchTerm";
import toast, { Toaster } from 'react-hot-toast';
import { RowTable } from "@/components/products-components/products-table";
import { LinksList } from "@/components/common/links-list";
import { getUrlFromCookie } from "@/services/oauth";
import SkeletonTable from "@/components/common/skeleton-table";
import { ProductsAllTable } from "@/components/products-components/products-all-table";
import { ConfigContext } from "@/contexts/config-context";
import { getConfigStatus } from "@/utils/functions";

export default function ViewProducts() {
  const [isLoading, setIsLoading] = useState(false);
  const [productos, setProductos] = useState([]);
  const [sortBy, setSortBy] = useState("-cod");
  const [ links, setLinks ] = useState([] as any)
  const [ statics, setStatics ] = useState([])
  const {currentPage, handlePageNumber} = usePagination("&page=1");
  const { searchTerm, handleSearchTerm } = useSearchTerm(["cod", "description"], 500);
  const [searchTermNew, setSearchTermNew] = useState("");
  const remoteUrl = getUrlFromCookie();
  const { config, systemInformation } = useContext(ConfigContext);
  const [rowsFormated, setRowsFormated] = useState([RowTable.brand, RowTable.location]);

    useEffect(() => {
      setRowsFormated((prevRows) => {
        let updatedRows = [...prevRows];
        if (getConfigStatus("product-brand", config)) {
          updatedRows = updatedRows.filter((row) => row !== RowTable.brand);
        }
        if (getConfigStatus("product-locations", config)) {
          updatedRows = updatedRows.filter((row) => row !== RowTable.location);
        }
        return updatedRows;
      });
      // eslint-disable-next-line
    }, [config, systemInformation]);

  const loadData = async () => {
      setIsLoading(true);
      try {
        const response = await getData(`products?sort=${sortBy}&filterWhere[status]==1&filterWhere[is_restaurant]==0&perPage=10${currentPage}${searchTerm}`);
        setProductos(response);
        setLinks([
          {"name": `DESCARGAR EN EXCEL`, "link": encodeURI(`${remoteUrl}/download/excel/inventory/`), "isUrl": true}, 
          {"name": `DESCARGAR EN PDF`, "link": encodeURI(`${remoteUrl}/web/inventory/`), "isUrl": true},
          {"name": `DESCARGAR PRECIOS`, "link": encodeURI(`${remoteUrl}/web/inventory/prices`), "isUrl": true}])
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
  };
    
  const handleSortBy = (sort: string) => {
    setSortBy(sort);
    handlePageNumber("&page=1");
  }


  useEffect(() => {
    (async () => { 
        if (searchTerm != searchTermNew) {
          handlePageNumber("&page=1");
          setSearchTermNew(searchTerm);
          await loadData();
         } else {
          await loadData();
         }
        })();   
    // eslint-disable-next-line
  }, [currentPage, searchTerm, sortBy]);

  
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
                <ViewTitle text="PRODUCTOS" />

              { isLoading ? <SkeletonTable rows={11} columns={7} /> :
                <ProductsAllTable
                products={productos}
                onDelete={deleteProduct} 
                withOutRows={rowsFormated}
                updatePrice={updatePrice}
                handleSortBy={handleSortBy}
                 />
              }
              <Pagination 
                records={productos}
                handlePageNumber={handlePageNumber } 
                />
            </div>
            <div>
                <RightSideProducts 
                products={productos}
                handleSearchTerm={handleSearchTerm}
                statics={statics}
                 />

              <LinksList links={links} separator="?" />
                    <li className="flex justify-between p-3 hover:bg-blue-200 hover:text-blue-800 cursor-pointer" onClick={()=>updatePrice(null)}>
                        ACTUALIZAR PRECIOS
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24"
                            stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                    </li>
            </div>
      <Toaster position="top-right" reverseOrder={false} />
      </div>
      );
}
