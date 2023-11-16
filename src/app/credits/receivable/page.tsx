'use client'
import { Pagination, ViewTitle } from "@/components";
import { Button, Preset } from "@/components/button/button";
import { CreditAddPaymentModal, Type } from "@/components/modals/credits-add-payment-modal";
import { CreditAddPaymentReceivableModal } from "@/components/modals/credits-add-payment-receivable-modal";
import { CredistReceivableTable } from "@/components/table/credits-receivable-table";
import { usePagination } from "@/hooks/usePagination";
import { loadData } from "@/utils/functions";
import { useEffect, useState } from "react";

export default function CreditPayablePage() {
  const [isAddPaymentModal, setIsAddPaymentModal] = useState(false);
  const [isCreditSelect, setIsCreditSelect] = useState([]);
  const [credits, setCredits] = useState([]);
  const {currentPage, handlePageNumber} = usePagination("&page=1");

  useEffect(() => {
    if (!isAddPaymentModal) {
      (async () => setCredits(await loadData(`credits/receivable?sort=-created_at&perPage=10${currentPage}`)))();
    }
    
}, [isAddPaymentModal, currentPage]);
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-10 pb-10">
        <div className="col-span-7 border-r md:border-sky-600">
            <ViewTitle text="CUENTAS POR PAGAR" />
            <CredistReceivableTable records={credits} onClick={()=>setIsAddPaymentModal(true)} creditSelect={setIsCreditSelect} />
            <Pagination records={credits} handlePageNumber={handlePageNumber }  />
        </div>
        <div className="col-span-3">
            <ViewTitle text="RESUMEN" />

        </div>
        <CreditAddPaymentReceivableModal isShow={isAddPaymentModal} onClose={()=>setIsAddPaymentModal(false)} accountType={Type.receivable} creditSelected={isCreditSelect} />
    </div>
      );
}
