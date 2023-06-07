'use client'
import { useState } from "react"
import { Loading, ViewTitle } from "@/app/components";
import { KardexTable } from "@/app/components/table/kardex-table";
import { DateRange, DateRangeValues } from "@/app/components/form/date-range";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { postData } from "@/services/resources";


export default function GetKardex({ params }: { params: { id: number } }) {
  const [recordsOfKardex, setRecordsOfKardex] = useState([]) as any;
  const [isSending, setIsSending] = useState(false);

  const handleFormSubmit = async (values: DateRangeValues) => {
    values.product_id = params.id
    const id = toast.loading("Buscando...")
    try {
      setIsSending(true)
      const response = await postData(`kardex`, "POST", values);
      if (!response.message) {
        setRecordsOfKardex(response)
        toast.update(id, { render: "Petición realizada correctamente", type: "success", isLoading: false, autoClose: 2000 });
      } else {
      toast.update(id, { render: "Faltan algunos datos importantes!", type: "error", isLoading: false, autoClose: 2000 });
      }
      
    } catch (error) {
      console.error(error);
      toast.update(id, { render: "Ha ocurrido un error!", type: "error", isLoading: false, autoClose: 2000 });
    } finally{
      setIsSending(false)
    }
  };

  // return <h1>Product Number {params.id} With Kardex</h1>;
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 pb-10">
           <div className="col-span-3">
             <ViewTitle text={`KARDEX`} />

           { isSending ? <Loading /> : 
           <>
           <div className="text-2xl text-gray-800">PRODUCTO: {recordsOfKardex?.product?.description}</div>
           <div className="text-2xl">METODO: COSTO PROMEDIO PONDERADO</div>
            <KardexTable records={recordsOfKardex} />
          </>
           }
         </div>
         <div>
         <ViewTitle text="BUSQUEDA" />
          <DateRange onSubmit={handleFormSubmit} />
         </div>
        <ToastContainer />
   </div>
   );
  }