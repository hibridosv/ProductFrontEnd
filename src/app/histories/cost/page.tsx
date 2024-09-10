'use client'

import { useEffect, useState } from "react";
import { ViewTitle } from "@/components"
import { DateRange, DateRangeValues } from "@/components/form/date-range"
import { getData, postData } from "@/services/resources";
import toast, { Toaster } from 'react-hot-toast';
import { AddNewDownloadLink } from "@/hooks/addNewDownloadLink";
import { LinksList } from "@/components/common/links-list";
import { HistoriesCostTable } from "@/components/histories-components/histories-cost-table";
import { useSearchTerm } from "@/hooks/useSearchTerm";
import { useForm } from "react-hook-form";
import { SearchIcon } from "@/theme/svg";

export default function Page() {
    const [cost, setCost] = useState([] as any);
    const [isSending, setIsSending] = useState(false);
    const { links, addLink} = AddNewDownloadLink()
    const [products, setProducts] = useState([]);
    const [productSelected, setProductSelected] = useState(null as any);
    const { searchTerm, handleSearchTerm } = useSearchTerm(["cod", "description"], 500);
    const { register, watch, setValue } = useForm();

    const loadData = async () => {
        try {
        const response = await getData(`products?sort=description&filterWhere[status]==1&filterWhere[is_restaurant]==0&perPage=10${searchTerm}`);
        setProducts(response.data);
        } catch (error) {
        console.error(error);
        }
    };
    

    useEffect(() => {
        if (searchTerm) {
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


    const handlegetSales = async (data: DateRangeValues) => {
        data.product_id = productSelected?.id;
        try {
          setIsSending(true);
          const response = await postData(`histories/cost`, "POST", data);
          if (!response.message) {
            toast.success("Datos obtenidos correctamente");
            setCost(response);
            if(response.data.length > 0) addLink(links, data, 'excel/cost/', [{name: "product_id", value: productSelected?.id}]);
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
    <div className="grid grid-cols-1 md:grid-cols-10 pb-10">
        <div className={`${cost?.data && cost?.data.length > 0 ? "col-span-7" : "col-span-5"} border-r md:border-sky-600`}>
        <ViewTitle text="LISTADO DE COSTOS" />

        <HistoriesCostTable records={cost} isLoading={isSending} />

        </div>
        <div className={`${cost?.data && cost?.data.length > 0 ? "col-span-3" : "col-span-5"}`}>
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
            {productSelected.cod} | {productSelected.description}
        </li>
    </ul>
</div>}

        <DateRange onSubmit={handlegetSales} />
        <LinksList links={links} />
        </div>
      <Toaster position="top-right" reverseOrder={false} />
    </div>
  )
}
