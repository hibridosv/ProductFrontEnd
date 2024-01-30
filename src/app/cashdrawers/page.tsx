'use client'
import { Loading, NothingHere, Pagination, ViewTitle } from "@/components";
import { CutShowCuts } from "@/components/cut-components/cut-show-cuts";
import { CashdrawerCloseModal } from "@/components/cashdrawer-components/cashdrawer-close-modal";
import { CashdrawerOpenModal } from "@/components/cashdrawer-components/cashdrawer-open-modal";
import { ConfigContext } from "@/contexts/config-context";
import { usePagination } from "@/hooks/usePagination";
import { postData } from "@/services/resources";
import { loadData } from "@/utils/functions";
import Image from "next/image";
import { useContext, useEffect, useState } from "react";
import toast, { Toaster } from 'react-hot-toast';


export default function CashDrawerPage() {
  const [cashDrawers, setCashDrawers] = useState([] as any);
  const [cutsUser, setCutsUser] = useState([] as any);
  const [cashDrawerSelected, setCashDrawerSelected] = useState("");
  const [cashDrawerOpenModal, setCashDrawerOpenModal] = useState(false);
  const [cashDrawerCloseModal, setCashDrawerCloseModal] = useState(false);
  const { cashDrawer, setCashDrawer } = useContext(ConfigContext);
  const {currentPage, handlePageNumber} = usePagination("&page=1");
  const [isLoading, setIsLoading] = useState(false);


  useEffect(() => {
    if (!cashDrawerOpenModal && !cashDrawerCloseModal) {
      try {
        setIsLoading(true);
        (async () => setCashDrawers(await loadData(`cashdrawers`)))();
        (async () => setCutsUser(await loadData(`cut/all?perPage=8${currentPage}`)))();
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    }
  }, [cashDrawerOpenModal, cashDrawerCloseModal, currentPage]);

  const handleOpenCashDrawer = (id: string) => {
    setCashDrawerSelected(id);
    setCashDrawerOpenModal(true);
  }



const onDeleteCut = async(cutId: any)=>{
  try {
      const response = await postData(`cashdrawers/${cutId.id}`, 'DELETE');
      if (response.type == "successful") {
        setCutsUser(await loadData(`cut/all`));
        setCashDrawer(cutId.cashdrawers_id);
      }
      toast.error(response.message);
    } catch (error) {
      console.error(error);
      toast.error("Ha ocurrido un error!");
    } 
}
  if (isLoading) return <Loading />;
  if (!cashDrawers?.data) return <NothingHere width="164" height="98" />;
  if (cashDrawers?.data?.length == 0) return <NothingHere text="No se encontraron datos" width="164" height="98" />;

  return (
    <div className="grid grid-cols-1 md:grid-cols-10 pb-10">
    <div className="col-span-7 border-r md:border-sky-600">
        <ViewTitle text="CAJAS DISPONIBLES" />
        <div  className="flex justify-center py-4 px-4">
        {
          cashDrawers?.data && cashDrawers?.data.map((cash: any) => (
            <div key={cash.id} className="md:mx-6 mx-2 shadow-2xl shadow-slate-900 rounded-t-full clickeable" 
            onClick={!cashDrawer && cash.status == 1 ? ()=>handleOpenCashDrawer(cash.id) : cashDrawer == cash.id ? ()=>setCashDrawerCloseModal(true) : ()=>console.log() }>
              <Image
                  src={!cashDrawer && cash.status == 1 ? "/img/cashdrawer.png" : cashDrawer == cash.id ? "/img/cashdrawer.png" : "/img/cashdrawer_block.png" }
                  alt="CashDrawer"  width={168} height={168} priority={false} />
                <div className="flex justify-center uppercase font-bold text-lg text-cyan-600">{ cash.name }</div>
                <div className="flex justify-center text-sm text-blue-600 mb-2">{ cash?.employee ? cash?.employee?.name : cash.status == 1 ? "Disponible" : "Aperturada" }</div>
            </div>
                ))
              }
      </div>
    </div>
    <div className="col-span-3">
        <ViewTitle text="SUS ULTIMOS CORTES" />
        <CutShowCuts records={cutsUser} onDelete={onDeleteCut} />
        <Pagination records={cutsUser} handlePageNumber={handlePageNumber } />
    </div>
    <CashdrawerOpenModal isShow={cashDrawerOpenModal} drawer={cashDrawerSelected} onClose={()=>setCashDrawerOpenModal(false)} />
    <CashdrawerCloseModal isShow={cashDrawerCloseModal} onClose={()=>setCashDrawerCloseModal(false)} />
    <Toaster position="top-right" reverseOrder={false} />

</div>
  )
}
