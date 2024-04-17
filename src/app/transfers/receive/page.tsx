'use client'

import { useEffect, useState } from "react";
import { Loading, ViewTitle } from "@/components"
import { TransfersReceiveTable } from "@/components/transfers-components/transfers-receive-table";
import { getData } from "@/services/resources";
import { toast, Toaster } from "react-hot-toast";
import { getTenant } from "@/services/oauth";
import { TransfersReceiveDetailsTable } from "@/components/transfers-components/transfers-receive-details-table";
import { RightSideTransfer } from "@/components/right-side/right-side-transfer";

export default function Page() {
  const [isloading, setIsloading] = useState(false);
  const [allTransfers, setAllTransfers] = useState([]);
  const tenant = getTenant();
  const [isShowTransfer, setIsShowTransfer] = useState(false);
  const [isSelectTransfer, setIsSelectTransfer] = useState(false);


  const initialData = async () =>{
    try {
      setIsloading(true)
      const response = await getData(`transfers?sort=-created_at&filter[to_tenant_id]=-${tenant}&included=products,to,from`);
      if (!response.message) {
        setAllTransfers(response)
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("Ha Ocurrido un Error!");
    } finally {
      setIsloading(false)
    }
  }
  
  
  useEffect(() => {
    if (!isShowTransfer) {
      (async () => await initialData())();
    }
    // eslint-disable-next-line
  }, [isShowTransfer]);


  const showTransfer = (transfer: any)=>{
    setIsShowTransfer(true)
    setIsSelectTransfer(transfer)
  }

if(isloading) return <Loading />
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-10 pb-10">
    <div className="col-span-8 border-r md:border-sky-600">
          <ViewTitle text={isShowTransfer ? "DETALLES DE LA TRANSFERENCIA" : "ULTIMAS TRANSFERENCIAS"} />
          {isShowTransfer ? 
            <TransfersReceiveDetailsTable records={isSelectTransfer} onClose={()=>setIsShowTransfer(false)} /> :
            <TransfersReceiveTable records={allTransfers} showTransfer={showTransfer} showOpRow={true} />
          }
    </div>
    <div className="col-span-2">
      <ViewTitle text="TRANSFERENCIAS" />
          <RightSideTransfer records={allTransfers} />
    </div>
    <Toaster position="top-right" reverseOrder={false} />
</div>
  )
}
