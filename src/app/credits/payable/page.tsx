'use client'
import { Pagination, ViewTitle } from "@/components";
import { Button, Preset } from "@/components/button/button";
import { CreditAddPayableModal } from "@/components/modals/credits-add-payable-modal";
import { CreditAddPaymentModal, Type } from "@/components/modals/credits-add-payment-modal";
import { CredistPayableTable } from "@/components/table/credits-payable-table";
import { usePagination } from "@/hooks/usePagination";
import { loadData } from "@/utils/functions";
import { useEffect, useState } from "react";

export default function CreditPayablePage() {
  const [isAddPayableModal, setIsAddPayableModal] = useState(false);
  const [isAddPaymentModal, setIsAddPaymentModal] = useState(false);
  const [isCreditSelect, setIsCreditSelect] = useState([]);
  const [credits, setCredits] = useState([]);
  const {currentPage, handlePageNumber} = usePagination("&page=1");

  useEffect(() => {
    if (!isAddPayableModal && !isAddPaymentModal) {
      (async () => setCredits(await loadData(`credits/payable?sort=-created_at&perPage=10${currentPage}`)))();
    }
    
}, [isAddPayableModal, isAddPaymentModal, currentPage]);
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-10 pb-10">
        <div className="col-span-7 border-r md:border-sky-600">
            <div className="flex justify-between">
              <ViewTitle text="CUENTAS POR PAGAR" />
              <span className=" m-4 text-2xl "><Button preset={Preset.add} text="AGREGAR" onClick={()=>setIsAddPayableModal(true)} /></span>
            </div>
            <CredistPayableTable records={credits} onClick={()=>setIsAddPaymentModal(true)} creditSelect={setIsCreditSelect} />
            <Pagination 
                records={credits}
                handlePageNumber={handlePageNumber } 
                />
        </div>
        <div className="col-span-3">
            <ViewTitle text="RESUMEN" />

        </div>
        <CreditAddPayableModal isShow={isAddPayableModal} onClose={()=>setIsAddPayableModal(false)} />
        <CreditAddPaymentModal isShow={isAddPaymentModal} onClose={()=>setIsAddPaymentModal(false)} accountType={Type.payable} creditSelected={isCreditSelect} />
    </div>
      );
}
