'use client'
import { Pagination, ViewTitle } from "@/components";
import { CreditsShowTotal } from "@/components/credits-components/credits-show-total";
import {  Type } from "@/components/modals/credits-add-payment-modal";
import { CreditAddPaymentReceivableModal } from "@/components/modals/credits-add-payment-receivable-modal";
import { CredistReceivableTable } from "@/components/table/credits-receivable-table";
import { usePagination } from "@/hooks/usePagination";
import { getTotalOfItem, loadData } from "@/utils/functions";
import { useEffect, useState } from "react";

export default function CreditPayablePage() {
  const [isAddPaymentModal, setIsAddPaymentModal] = useState(false);
  const [isCreditSelect, setIsCreditSelect] = useState([]);
  const [credits, setCredits] = useState([] as any);
  const {currentPage, handlePageNumber} = usePagination("&page=1");
  const [creditsTotal, setCreditsTotal] = useState(0);
  const [creditsQuantity, setCreditsQuantity] = useState(0);

  useEffect(() => {
    if (!isAddPaymentModal) {
      (async () => setCredits(await loadData(`credits/receivable?sort=-created_at&perPage=10${currentPage}`)))();
    }
    
}, [isAddPaymentModal, currentPage]);
  
useEffect(() => {
  if (credits.data && credits?.data.length > 0) {
    let dataFiltered = credits?.data.filter((element:any) => element.status === 1)
    setCreditsQuantity(dataFiltered.length)
    setCreditsTotal(getTotalOfItem(credits?.data, "balance"))
  }
}, [setCreditsQuantity, setCreditsTotal, credits]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-10 pb-10">
        <div className="col-span-7 border-r md:border-sky-600">
            <ViewTitle text="CUENTAS POR COBRAR" />
            <CredistReceivableTable records={credits} onClick={()=>setIsAddPaymentModal(true)} creditSelect={setIsCreditSelect} />
            <Pagination records={credits} handlePageNumber={handlePageNumber }  />
        </div>
        <div className="col-span-3">
            <ViewTitle text="RESUMEN" />
            <CreditsShowTotal quantity={creditsQuantity} text="Creditos Pendientes" number />
            <CreditsShowTotal quantity={creditsTotal} text="Total Pendiente" />
        </div>
        <CreditAddPaymentReceivableModal isShow={isAddPaymentModal} onClose={()=>setIsAddPaymentModal(false)} accountType={Type.receivable} creditSelected={isCreditSelect} />
    </div>
      );
}
