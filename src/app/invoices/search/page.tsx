'use client'
import { useState, useEffect } from "react";
import { Alert, Loading, ViewTitle } from "@/components";
import { getData } from "@/services/resources";
import { useSearchTerm } from "@/hooks/useSearchTerm";
import { SearchInput } from "@/components/form/search";
import { Product } from "@/services/products";
import toast, { Toaster } from 'react-hot-toast';
import { Button, Preset } from "@/components/button/button";
import { formatDateAsDMY } from "@/utils/date-formats";
import {  getPaymentTypeName, numberToMoney } from "@/utils/functions";
import { FaPrint } from "react-icons/fa";
import { RiDeleteBin2Line } from "react-icons/ri";


export default function KardexPage() {
    const { searchTerm, handleSearchTerm } = useSearchTerm(["invoice"], 500);
    const [documents, setDocuments] = useState<Product[]>([]);
    const [documenSelected, setDocumentSelected] = useState(false);
    const [records, setRecords] = useState([]) as any;
    const [isSending, setIsSending] = useState(false);
  

    const loadData = async () => {
        try {
          const response = await getData(`invoices/search?sort=-created_at${searchTerm}`);
          setDocuments(response.data);
        } catch (error) {
          console.error(error);
        }
    };
      
    console.log(documents)
  
    useEffect(() => {
        if (searchTerm) {
            (async () => { await loadData() })();
        }
      // eslint-disable-next-line
    }, [searchTerm]);


  const handleFormSubmit = async (iden: string) => {
    setDocumentSelected(true)
    try {
      setIsSending(true)
      const response = await getData(`sales/${iden}`);
      if (!response.message) {
        setRecords(response)
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

    const handleNewSearch = () => {
      setDocumentSelected(false)
      setDocuments([])
      setRecords([])
    }

    const listItems = documents?.map((document: any):any => (
        <div key={document.id} onClick={()=>handleFormSubmit(document.id)}>
            <li className="flex justify-between p-3 hover:bg-blue-200 hover:text-blue-800 cursor-pointer">
            {document?.invoice_assigned?.name} | {document.invoice}
                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24"
                    stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
            </li>
        </div>
    ))


    const listProducts = records?.data?.products.map((record: any, key: any) => (
      <tr key={record.id} className="border-b">
        <td className="py-2 px-6 truncate">{ record?.quantity} </td>
        <th className="py-2 px-6 text-gray-900 whitespace-nowrap dark:text-white" scope="row">{ record?.product } </th>
        <td className="py-2 px-6">{ numberToMoney(record?.unit_price ? record?.unit_price : 0) }</td>
        <td className="py-2 px-6">{ numberToMoney(record?.subtotal ? record?.subtotal : 0) }</td>
        <td className="py-2 px-6">{ numberToMoney(record?.taxes ? record?.taxes : 0) }</td>
        <td className="py-2 px-6">{ numberToMoney(record?.discount ? record?.discount : 0) }</td>
        <td className="py-2 px-6">{ numberToMoney(record?.total ? record?.total : 0) }</td>
      </tr>
    ));


  return (

    <div className="grid grid-cols-1 md:grid-cols-4 pb-10">
      {documenSelected ? <>
        <div className="col-span-3">
          <ViewTitle text="BUSCAR DOCUMENTOS" />
          {isSending ? <Loading /> :
            // <KardexTable records={records} />
            <div className="mx-3 my-8 ">
              <div className="flex justify-between font-bold text-lg">
                <div>Cajero: <span>{records?.data?.employee?.name}</span></div>
                <div>Fecha: <span>{ formatDateAsDMY(records?.data?.charged_at) }</span></div>
                <div>Tipo Pago: <span>{ getPaymentTypeName(records?.data?.payment_type) }</span></div>
              </div>

              <div className="w-full overflow-auto mt-4">
                  <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                      <tr>
                        <th scope="col" className="py-3 px-4 border">Cant</th>
                        <th scope="col" className="py-3 px-4 border">Producto</th>
                        <th scope="col" className="py-3 px-4 border">Precio</th>
                        <th scope="col" className="py-3 px-4 border">Subtotal</th>
                        <th scope="col" className="py-3 px-4 border">Imp</th>
                        <th scope="col" className="py-3 px-4 border">Descuento</th>
                        <th scope="col" className="py-3 px-4 border">Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {listProducts}
                      <tr>
                        <th scope="col" className="py-3 px-4 border" colSpan={3} ></th>
                        <th scope="col" className="py-3 px-4 border">{ numberToMoney(records?.data?.subtotal) }</th>
                        <th scope="col" className="py-3 px-4 border">{ numberToMoney(records?.data?.taxes) }</th>
                        <th scope="col" className="py-3 px-4 border">{ numberToMoney(records?.data?.discount) }</th>
                        <th scope="col" className="py-3 px-4 border">{ numberToMoney(records?.data?.total) }</th>
                      </tr>
                    </tbody>
                  </table>
              </div>
          {
            records?.data?.invoice_assigned?.type == 9 && 
            <Alert text="Este Documento tiene una numeración temporal" />
          }
          {
            records?.data?.invoice_assigned?.is_electronic == 1 && 
            <Alert info="Atención: " text="Este Documento se envió electronicamente" isDismisible={false}  />
          }
            </div>
          }
        </div>
        <div>
          <ViewTitle text="BUSQUEDA" />
          <div className="mt-4">
            <div className="m-3 flex justify-between mb-8">
              <div><FaPrint className="clickeable" size={45} color="blue" onClick={()=>console.log()} /></div>
              <div><RiDeleteBin2Line className="clickeable" size={45} color="red" onClick={()=>console.log()} /></div>
            </div>
            <Button text='Nueva busqueda' isFull type="submit" preset={Preset.cancel} onClick={() => handleNewSearch()} />
          </div>
        </div> </> :
        <div className="col-span-3 m-4">
          <ViewTitle text="BUSCAR DOCUMENTOS" />
          <SearchInput handleSearchTerm={handleSearchTerm} placeholder="Buscar Documento" />
          <div className="w-full bg-white rounded-lg shadow-lg lg:w-2/3 mt-4">
            <ul className="divide-y-2 divide-gray-400">
              {listItems}
            </ul>
          </div>
        </div>
      }
      <Toaster position="top-right" reverseOrder={false} />
    </div>
  );
}
