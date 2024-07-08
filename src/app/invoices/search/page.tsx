'use client'
import { useState, useEffect, useContext } from "react";
import { Alert, DeleteModal, Loading, ViewTitle } from "@/components";
import { getData, postData } from "@/services/resources";
import { useSearchTerm } from "@/hooks/useSearchTerm";
import { SearchInput } from "@/components/form/search";
import { Product } from "@/services/products";
import toast, { Toaster } from 'react-hot-toast';
import { Button, Preset } from "@/components/button/button";
import { formatDateAsDMY } from "@/utils/date-formats";
import {  getConfigStatus, getPaymentTypeName, getRandomInt, numberToMoney } from "@/utils/functions";
import { FaPrint } from "react-icons/fa";
import { RiDeleteBin2Line } from "react-icons/ri";
import { ConfigContext } from "@/contexts/config-context";


export default function Page() {
    const { searchTerm, handleSearchTerm } = useSearchTerm(["invoice"], 500);
    const [documents, setDocuments] = useState<Product[]>([]);
    const [documenSelected, setDocumentSelected] = useState(false);
    const [records, setRecords] = useState([]) as any;
    const [isSending, setIsSending] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [randNumber, setRandNumber] = useState(0);
    const [showCodeStatus, setShowCodeStatus] = useState<boolean>(false);
    const { config } = useContext(ConfigContext);
  
    useEffect(() => {
      setShowCodeStatus(getConfigStatus("sales-show-code", config));
      // eslint-disable-next-line
    }, [config]);

    const loadData = async () => {
        try {
          const response = await getData(`invoices/search?sort=-created_at${searchTerm}`);
          setDocuments(response.data);
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


  const handleFormSubmit = async (iden: string) => {
    setDocumentSelected(true)
    try {
      setIsSending(true)
      const response = await getData(`sales/${iden}`);
      if (!response.message) {
        setRecords(response)
        // toast.success("Petición realizada correctamente");
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
      setRandNumber(getRandomInt(100))
    }


    
  const printOrder = async (iden: string) => {
    try {
      setIsSending(true)
      const response = await postData(`invoices/print`, "POST", {invoice: iden});
      if (response.message) {
        toast.success(response.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("Ha ocurrido un error!");
    } finally {
      setIsSending(false)
    }
  };



  const deleteOrder = async (iden: string) => {
    setShowDeleteModal(false)
    try {
      setIsSending(true)
      const response = await postData(`invoices/delete`, "POST", {invoice: iden});
      if (response.message) {
        await handleFormSubmit(iden)
        toast.success(response.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("Ha ocurrido un error!");
    } finally {
      setIsSending(false)
    }
  };

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
        { showCodeStatus &&
        <td className="py-2 px-6 truncate">{ record?.cod} </td>
        }
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

              <div className="grid grid-cols-4 md:grid-cols-8 gap-3 bg-white dark:bg-gray-900">
                        <div className={`col-span-2 border-2 border-slate-600 shadow-md shadow-cyan-500 rounded-md w-full`}>
                          <div className="w-full text-center">Cajero</div>
                          <div className="w-full text-center text-xl my-2 font-bold">{records?.data?.employee?.name}</div>
                        </div>
                        <div className={`col-span-2 border-2 border-slate-600 shadow-md shadow-cyan-500 rounded-md w-full`}>
                          <div className="w-full text-center">Fecha</div>
                          <div className="w-full text-center text-xl my-2 font-bold">{ formatDateAsDMY(records?.data?.charged_at) }</div>
                        </div>
                        <div className={`col-span-2 border-2 border-slate-600 shadow-md shadow-cyan-500 rounded-md w-full`}>
                          <div className="w-full text-center">Tipo</div>
                          <div className="w-full text-center text-xl my-2 font-bold">{ records?.data?.invoice_assigned?.name }</div>
                        </div>
                        <div className={`col-span-2 border-2 border-slate-600 shadow-md shadow-cyan-500 rounded-md w-full`}>
                          <div className="w-full text-center">Pago</div>
                          <div className="w-full text-center text-xl my-2 font-bold">{ getPaymentTypeName(records?.data?.payment_type) }</div>
                        </div>
              </div>


              <div className="w-full overflow-auto mt-4">
                  <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                      <tr>
                        <th scope="col" className="py-3 px-4 border">Cant</th>
                        { showCodeStatus &&
                        <th scope="col" className="py-3 px-4 border">Codigo</th>
                        }
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
                        <th scope="col" className="py-3 px-4 border" colSpan={showCodeStatus ? 4 : 3} ></th>
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
          <ViewTitle text="OPCIONES" />
          <div className="mt-4">

            <div className="m-3 flex justify-between mb-8">
              <div><FaPrint className="clickeable" size={45} color="blue" onClick={()=>printOrder(records?.data?.id)} /></div>
              <div><RiDeleteBin2Line className="clickeable" size={45} color="red" 
              onClick={records?.data?.status == 3 ? ()=>setShowDeleteModal(true) : ()=>toast.error("Este documento ya se encuentra eliminado")} /></div>
            </div>
            
            <Button text='Nueva busqueda' isFull type="submit" preset={Preset.cancel} onClick={() => handleNewSearch()} />
            {
              records?.data?.status == 4 && <div className="mt-4"><Alert info="Atención: " text="Este documento se encuentra eliminado" isDismisible={false}  /></div>
            }
          </div>
        </div> </> :
        <div className="col-span-3 m-4">
          <ViewTitle text="BUSCAR DOCUMENTOS" />
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
      }
        <DeleteModal isShow={showDeleteModal}
          text="¿Estas seguro de anular este docuento?"
          onDelete={()=>deleteOrder(records?.data?.id)} 
          onClose={()=>setShowDeleteModal(false)} />
      <Toaster position="top-right" reverseOrder={false} />
    </div>
  );
}
