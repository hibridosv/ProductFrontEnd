"use client"
import { useState, useEffect } from "react";
import { Loading, Pagination, ViewTitle } from "@/app/components";
import { getData } from "@/services/resources";
import { usePagination } from "@/app/components/pagination";
import toast, { Toaster } from 'react-hot-toast';

import { ProductExpirationTable } from "@/app/components/table/product-expiration-table";
import { RightExpired } from "@/app/components/right-side/right-side-expired";


export default function Expirations() {
  const [isLoading, setIsLoading] = useState(false);
  const [expirations, setExpirations] = useState([]);
  const [expired, setExpired] = useState({});
  const {currentPage, handlePageNumber} = usePagination("&page=1");

  const loadData = async () => {
    setIsLoading(true);
    try {
      const response = await getData(`expirations`);
      setExpirations(response);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
};
  
const loadDataExpired = async () => {
  setIsLoading(true);
  try {
    const response = await getData(`expired`);
    setExpired(response);
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
}, [currentPage]);


useEffect(() => {
  (async () => {
    await loadDataExpired();
  })();
  // eslint-disable-next-line
}, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 pb-10">
           <div className="col-span-3">
             <ViewTitle text="PROXIMOS VENCIMIENTOS" />
             { isLoading ? <Loading /> : <>
                <ProductExpirationTable 
                records={expirations}
                 />
                <Pagination 
                products={expirations}
                handlePageNumber={handlePageNumber } 
                />
                </>
              }
         </div>
         <div>
         <ViewTitle text="DETALLES" />
              <RightExpired statics={expired} />
         </div>
      <Toaster />
   </div>
  )
}
