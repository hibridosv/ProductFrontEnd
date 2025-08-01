"use client"
import { useState, useEffect } from "react";
import { Loading, Pagination, ViewTitle } from "@/components";
import { getData } from "@/services/resources";
import { usePagination } from "@/components/pagination";
import toast, { Toaster } from 'react-hot-toast';

import { ProductExpirationTable } from "@/components/products-components/product-expiration-table";
import { RightExpired } from "@/components/right-side/right-side-expired";
import SkeletonTable from "@/components/common/skeleton-table";


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
             { isLoading ?  <SkeletonTable rows={11} columns={7} /> : 
                <ProductExpirationTable 
                records={expirations}
                 />
              }
              <Pagination 
                records={expirations}
                handlePageNumber={handlePageNumber } 
                />
         </div>
         <div>
         <ViewTitle text="DETALLES" />
              <RightExpired statics={expired} />
         </div>
      <Toaster position="top-right" reverseOrder={false} />
   </div>
  )
}
