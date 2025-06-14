'use client'
import { useState, useEffect, useContext } from "react";
import { Pagination, ViewTitle } from "@/components";
import { getData } from "@/services/resources";
import { useSearchTerm } from "@/hooks/useSearchTerm";
import { Product } from "@/services/products";
import { SearchInput } from "@/components/form/search";
import { getRandomInt, loadData } from "@/utils/functions";
import toast, { Toaster } from 'react-hot-toast';
import { InvoiceSearchTable } from "@/components/invoice-components/invoice-search-table";
import { usePagination } from "@/hooks/usePagination";
import SkeletonTable from "@/components/common/skeleton-table";
import Link from "next/link";


export default function Page() {
    const { searchTerm, handleSearchTerm } = useSearchTerm(["invoice"], 500);
    const [documents, setDocuments] = useState<Product[]>([]);
    const [randNumber, setRandNumber] = useState(0);
    const [invoices, setInvoices] = useState([] as any);
    const [isLoading, setIsLoading] = useState(false);
    const {currentPage, handlePageNumber} = usePagination("&page=1");



    useEffect(() => {
      const getDocuments = async () => {
        try {
          setIsLoading(true);

          const response = await getData(
            `order?&filterWhere[status]==3&included=invoiceAssigned,client,casheir&sort=-charged_at&perPage=15${currentPage}`
          );

          if (response?.data) {
            setInvoices(response);
          } else {
            toast.error("Faltan algunos datos importantes!");
          }
        } catch (error) {
          console.error(error);
          toast.error("Ha ocurrido un error!");
        } finally {
          setIsLoading(false);
        }
      };

      getDocuments();
    }, [currentPage]);


      const loadDocuments = async () => {
          try {
            const response = await getData(`invoices/search?sort=-created_at${searchTerm}`);
            setDocuments(response.data);
          } catch (error) {
            console.error(error);
          }
      };
        
    
      useEffect(() => {
          if (searchTerm) {
              (async () => { await loadDocuments() })();
          }
        // eslint-disable-next-line
      }, [searchTerm]);

      const handleNewSearch = () => {
            setDocuments([])
            setRandNumber(getRandomInt(100))
      }


    const listItems = documents?.map((document: any):any => (
        <div key={document.id} >
            <Link href={`/invoices/search/${document.id}`}>
              <li className="flex justify-between p-3 hover:bg-blue-200 hover:text-blue-800 cursor-pointer">
              {document?.invoice_assigned?.name} | {document.invoice}
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24"
                      stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
              </li>
            </Link>
        </div>
    ))

  return (
    <div className="grid grid-cols-1 md:grid-cols-10 pb-10">
        <div className="col-span-7">
          <ViewTitle text="ULTIMOS DOCUMENTOS" />
            <div className='mr-3 sm:mt-3'>
                { isLoading ? 
                <SkeletonTable rows={15} columns={8} /> :
                <InvoiceSearchTable records={invoices} isLoading={isLoading} /> 
                }
                <Pagination 
                    records={invoices}
                    handlePageNumber={handlePageNumber } 
                    />
            </div>
        </div>
        <div className="col-span-3">
        <ViewTitle text="BUSCAR DOCUMENTO" />
                <div className="m-4">
                  <SearchInput handleSearchTerm={handleSearchTerm} placeholder="Buscar Producto" randNumber={randNumber} />
                  <div className="w-full bg-white rounded-lg shadow-lg mt-4">
                    <ul className="w-full divide-y-2 divide-gray-400">
                    { listItems }
                    { listItems.length > 0 &&
                      <li className="flex justify-between p-3 hover:bg-red-200 hover:text-red-800 cursor-pointer" onClick={handleNewSearch}>
                        CANCELAR
                          <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24"
                              stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                          </svg>
                      </li>
                    }
                    </ul>
                  </div>
                </div>
        </div>
      <Toaster position="top-right" reverseOrder={false} />
   </div>
  );
}
