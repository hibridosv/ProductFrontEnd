import { useContext, useEffect, useState } from "react";
import { OptionsClickOrder, TypeOfPrice } from "@/services/enums";
import { Order } from "@/services/order";
import { getConfigStatus, setPriceName, setPriceOptions, sumarTotales } from "@/utils/functions";
import { ConfigContext } from "@/contexts/config-context";


export interface SalesShowTotalProps {
 records?: Order
 isSending?: boolean
 invoiceType?: ()=>void;
 setPrice:  (option: OptionsClickOrder) => void;
 priceType: number;
}

export function SalesShowTotal(props: SalesShowTotalProps) {
  const { records, isSending, invoiceType, setPrice, priceType } = props;
  const { config } = useContext(ConfigContext);
  const [multiPriceStatus, setMultiPriceStatus] = useState<boolean>(false)
  const [wholesalerStatus, setWholesalerStatus] = useState<boolean>(false)
  const [promotionStatus, setPromotionStatus] = useState<boolean>(false)
  let pricesActive = [TypeOfPrice.normal];


  useEffect(() => {
    setMultiPriceStatus(getConfigStatus("is-multi-price", config))
    setWholesalerStatus(getConfigStatus("product-price-wolesaler", config))
    setPromotionStatus(getConfigStatus("product-price-promotion", config))
  // eslint-disable-next-line
}, [config])

if(wholesalerStatus) pricesActive.push(TypeOfPrice.wholesaler)
if(promotionStatus) pricesActive.push(TypeOfPrice.promotion)


  if (!records?.invoiceproducts) return <></>
  if (records?.invoiceproducts.length == 0) return <></>

  const texStyle = isSending ? "flex justify-center text-7xl mb-4 text-gray-500 animate-pulse" : "flex justify-center text-7xl mb-4"; 

  return (<>
    <div className="w-full my-4 shadow-neutral-600 shadow-lg rounded-md">
      <div className="flex justify-center pt-2">TOTAL</div>
      <div className={`${texStyle} pb-4`}>$ {sumarTotales(records?.invoiceproducts)}</div>
    </div>
    <div className='flex justify-between border-2 border-sky-500 rounded mb-2'>
      <span className='mx-2 text-sm font-bold animatex' onClick={invoiceType} >{ records?.invoice_assigned?.name.toUpperCase() }</span> 
      { multiPriceStatus ? 
      <span className='mx-2 text-sm font-bold animatex' onClick={()=>setPrice(setPriceOptions(priceType, pricesActive))}>{setPriceName(priceType)}</span> :
      <span className='mx-2 text-sm font-bold'>{setPriceName(priceType)}</span> 
      }
    </div>

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

    </>);
}
