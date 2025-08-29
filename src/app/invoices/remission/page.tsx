'use client'

import { useEffect, useState } from "react";
import { Pagination, ViewTitle } from "@/components"
import { MinimalSearch } from "@/components/form/minimal-search";
import { usePagination } from "@/hooks/usePagination";
import { useSearchTerm } from "@/hooks/useSearchTerm";
import { postData } from "@/services/resources";
import { loadData } from "@/utils/functions";
import { toast, Toaster } from "react-hot-toast";
import { removeElementById } from "@/utils/functions-elements";
import { useRouter } from "next/navigation";
import { RemissionsListTable } from "@/components/invoice-components/remission-list-table";


export default function Page() {
    const [remissions, setRemissions] = useState({} as any);
    const {currentPage, handlePageNumber} = usePagination("&page=1");
    const { searchTerm, handleSearchTerm } = useSearchTerm(["client_name", "quote_number"], 500);
    const [isSending, setIsSending] = useState(false);
    const router = useRouter();


    useEffect(() => {
        (async () => setRemissions(await loadData(`remissions?sort=-created_at&included=products,client&perPage=10${currentPage}${searchTerm}`)))();
    }, [currentPage, searchTerm]);


    const deleteRemissions = async (recordSelect: any) => {
        toast.error("En este momento no se puede eliminar la nota de remisión!");
        return;
    setIsSending(true)
    try {
        const response = await postData(`remissions/${recordSelect.id}`, 'DELETE');
        if (response.type === "error") {
        toast.error("Ha Ocurrido un Error!");
        } else {
        let newRemissions = {...remissions}
        newRemissions.data = removeElementById(remissions?.data, response?.data?.id)
        setRemissions(newRemissions)
        toast.success( "Remisión eliminada correctamente");
        }
    } catch (error) {
        console.error(error);
        toast.error("Ha Ocurrido un Error!");
    } finally {
        setIsSending(false)
    }
    }


    const sendRemissions = async (recordSelect: any) => {
    setIsSending(true)
    try {
        const response = await postData(`remissions/charge/${recordSelect.id}`, 'PUT');
        if (response.type === "error") {
        toast.error("Ha Ocurrido un Error!");
        } else {
        toast.success( "Cotización enviada a facturar");
        router.push("/sales/quick");
        }
    } catch (error) {
        console.error(error);
        toast.error("Ha Ocurrido un Error!");
    } finally {
        setIsSending(false)
    }
    }



  return (
    <div className="grid grid-cols-1 md:grid-cols-10 pb-10">
    <div className="col-span-7 border-r md:border-sky-600">
      <ViewTitle text="LISTA DE NOTAS DE REMISION" />

      <RemissionsListTable records={remissions} onDelete={deleteRemissions} sendRemissions={sendRemissions} isSending={isSending} />
      <Pagination records={remissions} handlePageNumber={handlePageNumber} />
    </div>
    <div className="col-span-3">
      <ViewTitle text="DETALLES" />
      <MinimalSearch records={remissions} handleSearchTerm={handleSearchTerm} placeholder="Buscar Nota de Remisión" />
    </div>
    <Toaster position="top-right" reverseOrder={false} />
</div>
  )
}
