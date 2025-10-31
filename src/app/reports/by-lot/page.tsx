'use client'

import { useEffect, useState } from "react";
import { ViewTitle, Pagination } from "@/components"
import toast, { Toaster } from 'react-hot-toast';
import { LinksList } from "@/components/common/links-list";
import { AddNewDownloadLink } from "@/hooks/addNewDownloadLink";
import { ReportsByLotTable } from "@/components/reports-components/reports-by-lot-table";
import { SearchIcon } from "@/theme/svg";
import { getData } from "@/services/resources";
import { MdDelete } from "react-icons/md";
import { useSearchTerm } from "@/hooks/useSearchTerm";
import { useForm } from "react-hook-form";
import { usePagination } from "@/components/pagination";

export default function Page() {
  const [products, setProducts] = useState([]);
  const [productData, setProductData] = useState([]);
  const [isSending, setIsSending] = useState(false);
  const { links, addLink} = AddNewDownloadLink()
  const [productSelected, setProductSelected] = useState(null as any);
  const { searchTerm, handleSearchTerm } = useSearchTerm(["cod", "description"], 500);
  const { register, watch, setValue } = useForm();
  const {currentPage, handlePageNumber} = usePagination("&page=1");

  const loadData = async () => {
      try {
      const response = await getData(`products?sort=description&filterWhere[status]==1&filterWhere[is_restaurant]==0&perPage=10${searchTerm}`);
      setProducts(response.data);
      } catch (error) {
      console.error(error);
      }
  };


  useEffect(() => {
    if (searchTerm || searchTerm != "") {
        (async () => { await loadData() })();
    } else {
      setProducts([])
    }
  // eslint-disable-next-line
  }, [searchTerm]);


  useEffect(() => {
    handleSearchTerm(watch('search'))
  // eslint-disable-next-line
  }, [watch('search')]);


  const selectProduct = (product: any)=>{
      setProductSelected(product)
      setProducts([]);
      setValue("search", null)
  }


  const listItems = products?.map((product: any):any => (
    <div key={product.id} onClick={()=>selectProduct(product)}>
    <li className="flex justify-between p-3 hover:bg-blue-200 hover:text-blue-800 cursor-pointer z-50">
    {product.cod} | {product.description}
        <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24"
            stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
        </svg>
    </li>
</div>
))



useEffect(() => {
  const handlegetSales = async () => {
    try {
      setIsSending(true);
      const response = await getData(`registers/product?perPage=25${currentPage}${productSelected?.id ? `&filterWhere[product_id]==${productSelected?.id}` : ''}&included=product&sort=-created_at`);
      if (!response.message) {
        toast.success("Datos obtenidos correctamente");
        setProductData(response);
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
  handlegetSales() 
// eslint-disable-next-line
}, [productSelected, currentPage]);

useEffect(() => {
  addLink(links, {}, "excel/reports/by-lot/", []);
}, []); 

useEffect(() => {
  if (productSelected?.id) {
    addLink(links,{},"excel/reports/by-lot/",[{ name: "product_id", value: productSelected.id }]
    );
  }
}, [productSelected]);



  return (
    <div className="grid grid-cols-1 md:grid-cols-10 pb-10">
        <div className="col-span-7 border-r md:border-sky-600"> 
        <ViewTitle text="INGRESOS POR LOTES" />
        <ReportsByLotTable records={productData} isLoading={isSending} />
        <Pagination 
              records={productData}
              handlePageNumber={handlePageNumber } 
        />

        </div>
        <div className="col-span-3">
        <ViewTitle text="SELECCIONAR PRODUCTO" />
        <div className="flex flex-wrap mx-3 mb-3">

            <div className="w-full m-2">
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    { SearchIcon }
                    </div>
                    <input
                    type="search"
                    id="search"
                    className="block w-full p-4 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="Buscar Producto"
                    {...register("search")}
                    />
                </div>


            </div>
            <div className="w-full bg-white rounded-lg shadow-lg lg:w-2/3 mt-4">
            <ul className="divide-y-2 divide-gray-400">
            { listItems }
            </ul>
            </div>
    </div>

           
        { productSelected &&  
        <div className=" bg-white rounded-lg shadow-lg m-2">
            <ul>
                <li className="flex justify-between rounded-lg p-3 w-full bg-lime-200 text-lime-800 ">
                    {productSelected.cod} | {productSelected.description} <span className="text-right clickeable"><MdDelete size={24} color="red" onClick={()=>{setProductSelected(null) }} /></span>
                </li>
            </ul>
        </div>}


        <LinksList links={links} />
        </div>
      <Toaster position="top-right" reverseOrder={false} />
    </div>
  )
}
