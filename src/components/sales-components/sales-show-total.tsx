import { useContext, useEffect, useState } from "react";
import { OptionsClickOrder, PresetTheme, TypeOfPrice } from "@/services/enums";
import { Order } from "@/services/order";
import { formatDuiWithAll, getConfigStatus, setPriceName, setPriceOptions, sumarCantidad, sumarTotales } from "@/utils/functions";
import { ConfigContext } from "@/contexts/config-context";
import { Alert } from "../alert/alert";
import { ShowTotal } from "./show-total";


export interface SalesShowTotalProps {
 records?: Order
 isSending: boolean
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

  const total = sumarCantidad(records?.invoiceproducts);
  return (<>
    <ShowTotal isSending={isSending} records={records} />
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
        <span className=" text-red-500 ">{records?.client?.document ? formatDuiWithAll(records?.client?.document) : formatDuiWithAll(records?.client?.id_number)}</span></div>}

        {records?.referred?.name && <div className="flex justify-between border-b-2"> 
        <span className=" text-red-500 ">Referido: {records?.referred?.name}</span>
        <span className=" text-red-500 ">{records?.referred?.document ? formatDuiWithAll(records?.referred?.document) : formatDuiWithAll(records?.referred?.id_number)}</span></div>}

        {records?.delivery?.name && <div className="flex justify-between border-b-2"> 
        <span className=" text-blue-500 ">Repartidor: {records?.delivery?.name}</span></div>}
    </div>

    <div>
        {records?.comment && <div className="flex justify-between border-b-2"> 
        <span className="text-teal-500 font-semibold">Nota: {records?.comment}</span></div>}
    </div>


        { (records?.client?.taxpayer_type == 2 && total >= 100) && <Alert
          theme={PresetTheme.info}
          info="Información"
          text="Factura con retención del 1%"
          isDismisible={false}
          className='my-2'
          /> }

        { (records?.invoice_assigned?.type == 8) && <Alert
          theme={PresetTheme.danger}
          info="Importante"
          text="Las notas de envío no afectan el efectivo"
          isDismisible={false}
          className='my-2'
          /> }

    </>);
}
