import { sumarTotales } from "@/utils/functions";

export interface SalesShowTotalProps {
 records?: any
 isSending?: boolean
 showAllData?: boolean
 showClient?: boolean
}

export function SalesShowTotal(props: SalesShowTotalProps) {
  const { records, isSending, showAllData, showClient } = props;


  if (!records?.invoiceproducts) return <></>
  if (records?.invoiceproducts.length == 0) return <></>

  const texStyle = isSending ? "flex justify-center text-7xl mb-4 text-gray-500 animate-pulse" : "flex justify-center text-7xl mb-4"; 

  return (<>
    <div className="w-full my-4 shadow-neutral-600 shadow-lg rounded-md">
      <div className="flex justify-center pt-2">TOTAL</div>
      <div className={`${texStyle} pb-4`}>$ {sumarTotales(records?.invoiceproducts)}</div>
    </div>
    { !showAllData && <div className='flex justify-between border-2 border-sky-500 rounded mb-2'>
      <span className='mx-2 text-sm font-bold animatex'>FACTURA</span> 
      <span className='mx-2 text-sm font-bold animatex'>EFECTIVO</span>
    </div> }
    { showClient &&
    <div>
        {records?.client?.name && <div className="flex justify-between border-b-2"> 
        <span className=" text-red-500 ">Cliente: {records?.client?.name}</span>
        <span className=" text-red-500 ">{records?.client?.document ? records?.client?.document : records?.client?.id_number}</span></div>}

        {records?.referred?.name && <div className="flex justify-between border-b-2"> 
        <span className=" text-red-500 ">Referido: {records?.referred?.name}</span>
        <span className=" text-red-500 ">{records?.referred?.document ? records?.referred?.document : records?.referred?.id_number}</span></div>}

        {records?.delivery?.name && <div className="flex justify-between border-b-2"> 
        <span className=" text-blue-500 ">Repartidor: {records?.delivery?.name}</span></div>}
    </div>
    }
    </>);
}
