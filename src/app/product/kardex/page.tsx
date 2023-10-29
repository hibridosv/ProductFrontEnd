'use client'
import { useState, useEffect } from "react";
import { Loading, ViewTitle } from "@/app/components";
import { getData, postData } from "@/services/resources";
import { useSearchTerm } from "@/hooks/useSearchTerm";
import { SearchInput } from "@/app/components/form/search";
import { Product } from "@/services/products";
import { KardexTable } from "@/app/components/table/kardex-table";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { DateRange, DateRangeValues } from "@/app/components/form/date-range";
import { Button, Preset } from "@/app/components/button/button";


export default function KardexPage() {
    const { searchTerm, handleSearchTerm } = useSearchTerm()
    const [products, setProducts] = useState<Product[]>([]);
    const [productSelected, setProductSelected] = useState(null);
    const [recordsOfKardex, setRecordsOfKardex] = useState([]) as any;
    const [isSending, setIsSending] = useState(false);
  

    const loadData = async () => {
        try {
          const response = await getData(`products?sort=-created_at${searchTerm}`);
          setProducts(response.data);
        } catch (error) {
          console.error(error);
        }
    };
      
  
    useEffect(() => {
        if (searchTerm) {
            (async () => { await loadData() })();
        }
      // eslint-disable-next-line
    }, [searchTerm]);


    const handleFormSubmit = async (values: DateRangeValues) => {
      values.product_id = productSelected
      try {
        setIsSending(true)
        const response = await postData(`kardex`, "POST", values);
        if (!response.message) {
          setRecordsOfKardex(response)
          toast.success( "Petición realizada correctamente", { autoClose: 2000 });
        } else {
          toast.error("Faltan algunos datos importantes!", { autoClose: 2000 });
        }
      } catch (error) {
        console.error(error);
        toast.error("Ha ocurrido un error!", { autoClose: 2000 });
      } finally{
        setIsSending(false)
      }
    };

    const handleNewProduct = () => {
      setProductSelected(null)
      setProducts([])
      setRecordsOfKardex([])
    }


    const listItems = products?.map((product: any):any => (
        <div key={product.id} onClick={()=>setProductSelected(product.id)}>
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

      <div className="grid grid-cols-1 md:grid-cols-4 pb-10">
        {productSelected ? <>
        <div className="col-span-3">
          <ViewTitle text="KARDEX" />
        { isSending ? <Loading /> : 
        <KardexTable records={recordsOfKardex} />
        }
      </div>
      <div>
        <ViewTitle text="BUSQUEDA" />
        <DateRange onSubmit={handleFormSubmit} />
        <div className="mt-4">
        <Button text='Nueva busqueda' isFull type="submit" preset={Preset.cancel} onClick={()=>handleNewProduct()} />
        </div>
        <ToastContainer />
      </div> </> :
          <div className="col-span-3 m-4">
          <ViewTitle text="KARDEX DE PRODUCTO"  />
          <SearchInput handleSearchTerm={handleSearchTerm} placeholder="Buscar Producto" />
          <div className="w-full bg-white rounded-lg shadow-lg lg:w-2/3 mt-4">
              <ul className="divide-y-2 divide-gray-400">
              { listItems }
              </ul>
          </div>
      </div>
      }
    </div>
  );
}
