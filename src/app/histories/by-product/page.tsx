'use client'

import { useEffect, useState } from "react";
import { ViewTitle } from "@/components"
import { DateRange } from "@/components/form/date-range"
import { getData } from "@/services/resources";
import toast, { Toaster } from 'react-hot-toast';
import { DateTime } from 'luxon';
import { HistoriesByProductTable } from "@/components/histories-components/histories-by-product-table";
import { AddNewDownloadLink } from "@/hooks/addNewDownloadLink";
import { LinksList } from "@/components/common/links-list";
import { SearchInput } from "@/components/form/search";
import { useSearchTerm } from "@/hooks/useSearchTerm";
import { getRandomInt, loadData, urlConstructor } from "@/utils/functions";
import { Button, Preset } from "@/components/button/button";


export default function Page() {
  const [sales, setSales] = useState([]);
  const [isSending, setIsSending] = useState(false);
  const { links, addLink} = AddNewDownloadLink()
  const [ randNumber, setrandNumber] = useState(0) as any;
  const { searchTerm, handleSearchTerm } =  useSearchTerm(["cod", "description"], 500);
  const [products, setProducts] = useState([]) as any;
  const [productSelected, setProductselected] = useState(null) as any;


  const loadDataProducts = async () => {
        try {
        const response = await  getData(`products?sort=description&filterWhere[status]==1&filterWhere[is_restaurant]==0&perPage=10${searchTerm}`);
        setProducts(response.data);
        } catch (error) {
        console.error(error);
        }
    };

    useEffect(() => {
        if (searchTerm) {
            (async () => { await loadDataProducts();})();   
        }
        if (searchTerm == "") {
            setProducts([]);
        }
        // eslint-disable-next-line
    }, [searchTerm]);


    const handlegetSales = async (data: any) => {
        if (!productSelected) {
            toast.error("Seleccione un producto")
            return
        }
        data.product_id = productSelected?.id
        try {
          setIsSending(true);
          let url = urlConstructor(data, 'histories/by-product')
          const response = await loadData(url);
          if (!response.message) {
            toast.success("Datos obtenidos correctamente");
            setSales(response);
            if(response.data.length > 0) addLink(links, data, 'excel/by-product/', [{name: "product_id", value: productSelected?.id}]);
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

    useEffect(() => {
        (async () => { 
        const actualDate = DateTime.now();
        const formatedDate = actualDate.toFormat('yyyy-MM-dd');
        await handlegetSales({option: "1", initialDate: `${formatedDate} 00:00:00`})
        })();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleCancelProduct = () => {
        setProductselected(null)
        setrandNumber(getRandomInt(100));
        setProducts([])
    }
    const handleSelectProduct = (product: any) => {
        setProductselected(product)
        setrandNumber(getRandomInt(100));
        setProducts([])
    }
  
    const listItems = products?.map((product: any):any => (
        <div key={product.id} onClick={()=>handleSelectProduct(product)}>
            <li className="flex justify-between p-3 hover:bg-blue-200 hover:text-blue-800 cursor-pointer">
                  {product.cod} | {product.description}
                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24"
                    stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
            </li>
        </div>
    ))

  return (
    <div className="grid grid-cols-1 md:grid-cols-10 pb-10">
        <div className="col-span-7 border-r md:border-sky-600">
        <ViewTitle text="LISTADO DE VENTAS POR PRODUCTO" />

        <HistoriesByProductTable records={sales} isLoading={isSending} />

        </div>
        <div className="col-span-3">
        <ViewTitle text="SELECCIONAR PRODUCTO" />
        <div className="mx-2">
            <SearchInput handleSearchTerm={handleSearchTerm} placeholder="Buscar Producto" randNumber={randNumber} />
            <div className="w-full bg-white rounded-lg shadow-lg mt-4">
                <ul className="divide-y-2 divide-gray-400">
                { listItems }
                { products && products.length > 0 && 
                        <li className="flex justify-between p-3 hover:bg-red-200 hover:text-red-800 cursor-pointer" onClick={handleCancelProduct}>
                            CANCELAR
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24"
                                stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                            </svg>
                        </li> }
                </ul>
            </div>
            { productSelected &&
            <div className="flex justify-between px-2 mb-3 uppercase text-lg font-semibold shadow-md rounded-md">
                <span>{ productSelected?.description }</span> 
                <span className="text-right"><Button noText preset={Preset.smallClose} onClick={handleCancelProduct} /></span>
            </div> }
        </div>
        <ViewTitle text="SELECCIONAR FECHA" />
        <DateRange onSubmit={handlegetSales} />
        <LinksList links={links} />
        </div>
      <Toaster position="top-right" reverseOrder={false} />
    </div>
  )
}