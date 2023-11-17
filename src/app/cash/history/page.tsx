'use client'
import { Pagination, ViewTitle } from "@/components";
import { Button, Preset } from "@/components/button/button";
import { CashShowTotal } from "@/components/cash-components/cash-show-total";
import { CashTransferModal } from "@/components/cash-components/cash-trasfers-modal";
import { CashhistoryTable } from "@/components/cash-components/cash-history-table";
import { usePagination } from "@/hooks/usePagination";
import { loadData } from "@/utils/functions";
import { useEffect, useState } from "react";
import { RiRefreshFill } from "react-icons/ri";


export default function HistoryPage() {
  const [isCashTranferModal, setIsCashTranferModal] = useState(false);
  const [accounts, setAccounts] = useState([] as any);
  const [histories, setHistories] = useState([] as any);
  const {currentPage, handlePageNumber} = usePagination("&page=1");


    useEffect(() => {
      if (!isCashTranferModal) {
          (async () => setAccounts(await loadData(`cash/accounts`)))();
          (async () => setHistories(await loadData(`cash/history?sort=-created_at&perPage=10${currentPage}`)))();
      }
    }, [isCashTranferModal, currentPage]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-10 pb-10">
        <div className="col-span-7 border-r md:border-sky-600">
          <div className="flex justify-between">
            <ViewTitle text="HISTORIAL TRANSACCIONES" />
            <RiRefreshFill size={32} className="col-span-11 m-4 text-2xl text-sky-900 clickeable" onClick={()=>setIsCashTranferModal(true)} />
          </div>

            <CashhistoryTable records={histories} />
            <Pagination 
                records={histories}
                handlePageNumber={handlePageNumber } 
                />
        </div>
        <div className="col-span-3">
            <ViewTitle text="TOTAL EN CUENTAS" />
            <CashShowTotal records={accounts} />
            <div className="m-4">
            <Button preset={Preset.accept} text="Transferir entre cuentas" isFull onClick={()=>setIsCashTranferModal(true)} />
            </div>
        </div>
        <CashTransferModal isShow={isCashTranferModal} accounts={accounts} onClose={()=>setIsCashTranferModal(false)} />
    </div>
      );
}
