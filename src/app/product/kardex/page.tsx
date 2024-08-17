'use client'
import { useState } from "react";
import { Loading, ViewTitle } from "@/components";
import { postData } from "@/services/resources";
import { KardexTable } from "@/components/table/kardex-table";
import toast, { Toaster } from 'react-hot-toast';
import { DateRange, DateRangeValues } from "@/components/form/date-range";
import { Button, Preset } from "@/components/button/button";
import { SearchInputProduct } from "@/components/form/search-product";


export default function KardexPage() {
    const [productSelected, setProductSelected] = useState(null);
    const [recordsOfKardex, setRecordsOfKardex] = useState([]) as any;
    const [isSending, setIsSending] = useState(false);
  
  const handleFormSubmit = async (values: DateRangeValues) => {
    values.product_id = productSelected
    try {
      setIsSending(true)
      const response = await postData(`kardex`, "POST", values);
      if (!response.message) {
        setRecordsOfKardex(response)
        toast.success("Petición realizada correctamente");
      } else {
        toast.error("Faltan algunos datos importantes!");
      }
    } catch (error) {
      console.error(error);
      toast.error("Ha ocurrido un error!");
    } finally {
      setIsSending(false)
    }
  };

    const handleSelectProduct = (product: any) => {
      setProductSelected(product.id)
    }


  return (

    <div className="grid grid-cols-1 md:grid-cols-4 pb-10">
      {productSelected ? <>
        <div className="col-span-3">
          <ViewTitle text="KARDEX" />
          {isSending ? <Loading /> :
            <KardexTable records={recordsOfKardex} />
          }
        </div>
        <div>
          <ViewTitle text="BUSQUEDA" />
          <DateRange onSubmit={handleFormSubmit} />
          <div className="mt-4">
            <Button text='Nueva busqueda' isFull type="submit" preset={Preset.cancel} onClick={()=>setProductSelected(null)} />
          </div>
        </div> </> :
        <div className="col-span-3 m-4">
          <ViewTitle text="KARDEX DE PRODUCTO" />
          <SearchInputProduct recordSelected={handleSelectProduct} placeholder="Buscar Producto" url="products?sort=description&filterWhere[is_restaurant]==0" />
        </div>
      }
      <Toaster position="top-right" reverseOrder={false} />
    </div>
  );
}
