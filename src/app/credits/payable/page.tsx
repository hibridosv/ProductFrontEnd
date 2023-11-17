'use client'
import { Pagination, ViewTitle } from "@/components";
import { Button, Preset } from "@/components/button/button";
import { CreditsShowTotal } from "@/components/credits-components/credits-show-total";
import { CreditAddPayableModal } from "@/components/credits-components/credits-add-payable-modal";
import { CreditAddPaymentModal, Type } from "@/components/credits-components/credits-add-payment-modal";
import { CredistPayableTable } from "@/components/credits-components/credits-payable-table";
import { usePagination } from "@/hooks/usePagination";
import { getTotalOfItem, loadData } from "@/utils/functions";
import { useEffect, useState } from "react";

export default function CreditPayablePage() {
  const [isAddPayableModal, setIsAddPayableModal] = useState(false);
  const [isAddPaymentModal, setIsAddPaymentModal] = useState(false);
  const [isCreditSelect, setIsCreditSelect] = useState([]);
  const [credits, setCredits] = useState([] as any);
  const {currentPage, handlePageNumber} = usePagination("&page=1");
  const [creditsTotal, setCreditsTotal] = useState(0);
  const [creditsQuantity, setCreditsQuantity] = useState(0);

  useEffect(() => {
    if (!isAddPayableModal && !isAddPaymentModal) {
      (async () => setCredits(await loadData(`credits/payable?sort=-created_at&perPage=10${currentPage}`)))();
    }
  }, [isAddPayableModal, isAddPaymentModal, currentPage]);
  
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
            <div className="flex justify-between">
              <ViewTitle text="CUENTAS POR PAGAR" />
              <span className=" m-4 text-2xl "><Button preset={Preset.add} text="AGREGAR" onClick={()=>setIsAddPayableModal(true)} /></span>
            </div>
            <CredistPayableTable records={credits} onClick={()=>setIsAddPaymentModal(true)} creditSelect={setIsCreditSelect} />
            <Pagination  records={credits} handlePageNumber={handlePageNumber } />
        </div>
        <div className="col-span-3">
            <ViewTitle text="RESUMEN" />
            <CreditsShowTotal quantity={creditsQuantity} text="Creditos Pendientes" number />
            <CreditsShowTotal quantity={creditsTotal} text="Total Pendiente" />
        </div>
        <CreditAddPayableModal isShow={isAddPayableModal} onClose={()=>setIsAddPayableModal(false)} />
        <CreditAddPaymentModal isShow={isAddPaymentModal} onClose={()=>setIsAddPaymentModal(false)} accountType={Type.payable} creditSelected={isCreditSelect} />
    </div>
      );
}
