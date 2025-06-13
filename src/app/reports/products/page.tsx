'use client'

import { useEffect, useState } from "react";
import { ViewTitle } from "@/components"
import { DateRange, DateRangeValues } from "@/components/form/date-range"
import { postData } from "@/services/resources";
import toast, { Toaster } from 'react-hot-toast';
import { DateTime } from 'luxon';
import { ReportsProductsTable } from "@/components/reports-components/reports-products-table";
import { LinksList } from "@/components/common/links-list";
import { AddNewDownloadLink } from "@/hooks/addNewDownloadLink";
import { AiOutlineSearch } from "react-icons/ai";
import { ReportsProductsModal } from "@/components/reports-components/reports-products-modal";

export default function Page() {
  const [products, setProducts] = useState([]);
  const [isSending, setIsSending] = useState(false);
  const { links, addLink} = AddNewDownloadLink()
  const [isShowModal, setIsShowModal] = useState(false);


  useEffect(() => {
      (async () => { 
        const actualDate = DateTime.now();
        const formatedDate = actualDate.toFormat('yyyy-MM-dd');
        await handlegetSales({option: "1", initialDate: `${formatedDate} 00:00:00`})
      })();
        // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

    const handlegetSales = async (data: DateRangeValues, document?: number) => {

        try {
          setIsSending(true);
          const response = await postData(`reports/products-in`, "POST", document ? {document} : data );
          if (!response.message) {
            setProducts(response);
            if(response.data.length > 0) addLink(links, data, 'excel/reports/products-in/', [{name: "document", value: document}]);
            toast.success("Datos obtenidos correctamente");
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

      const setDocument = async(document: number) =>{
        await handlegetSales({}, document)
      }

  return (
    <div className="grid grid-cols-1 md:grid-cols-10 pb-10">
        <div className="col-span-7 border-r md:border-sky-600"> 
          <div className="flex justify-between">
            <ViewTitle text="PRODUCTOS INGRESADOS" />
            <span className=" m-4 text-2xl clickeable" onClick={()=>setIsShowModal(true)}><AiOutlineSearch size={24} /></span>
          </div>
        <ReportsProductsTable records={products} isLoading={isSending} />

        </div>
        <div className="col-span-3">
        <ViewTitle text="SELECCIONAR FECHA" />

        <DateRange onSubmit={handlegetSales} />
        <LinksList links={links} />
        </div>
      <ReportsProductsModal isShow={isShowModal} onClose={()=>setIsShowModal(false)} setDocument={setDocument} />
      <Toaster position="top-right" reverseOrder={false} />
    </div>
  )
}
