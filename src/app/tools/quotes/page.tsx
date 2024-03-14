'use client'

import { useEffect, useState } from "react";
import { Pagination, ViewTitle } from "@/components"
import { MinimalSearch } from "@/components/form/minimal-search";
import { QuotesListTable } from "@/components/tools-components/quotes-list-table";
import { usePagination } from "@/hooks/usePagination";
import { useSearchTerm } from "@/hooks/useSearchTerm";
import { postData } from "@/services/resources";
import { loadData } from "@/utils/functions";
import { toast, Toaster } from "react-hot-toast";
import { addElementToData, removeElementById } from "@/utils/functions-elements";

export default function Page() {
const [quotes, setQuotes] = useState({} as any);
const {currentPage, handlePageNumber} = usePagination("&page=1");
const { searchTerm, handleSearchTerm } = useSearchTerm(["client_name", "quote_number"], 500);

useEffect(() => {
    (async () => setQuotes(await loadData(`quotes?sort=-created_at&included=products,client&perPage=10${currentPage}${searchTerm}`)))();
}, [currentPage, searchTerm]);


const deleteQuotes = async (recordSelect: any) => {
  try {
    const response = await postData(`quotes/${recordSelect.id}`, 'DELETE');
    if (response.type === "error") {
      toast.error("Ha Ocurrido un Error!");
    } else {
      let newQuotes = {...quotes}
      newQuotes.data = removeElementById(quotes?.data, response?.data?.id)
      setQuotes(newQuotes)
      toast.success( "Cotización eliminada correctamente");
    }
  } catch (error) {
    console.error(error);
    toast.error("Ha Ocurrido un Error!");
  } 
}

  return (
    <div className="grid grid-cols-1 md:grid-cols-10 pb-10">
    <div className="col-span-7 border-r md:border-sky-600">
      <ViewTitle text="LISTA DE COTIZACIONES" />

      <QuotesListTable records={quotes} onDelete={deleteQuotes} />
      <Pagination records={quotes} handlePageNumber={handlePageNumber} />
    </div>
    <div className="col-span-3">
      <ViewTitle text="DETALLES" />
      <MinimalSearch records={quotes} handleSearchTerm={handleSearchTerm} placeholder="Buscar Cotización" />
    </div>
    <Toaster position="top-right" reverseOrder={false} />
</div>
  )
}
