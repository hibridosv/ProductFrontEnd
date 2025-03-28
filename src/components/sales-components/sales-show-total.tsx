import { useContext, useEffect, useState } from "react";
import { OptionsClickOrder, PresetTheme, TypeOfPrice } from "@/services/enums";
import { Order } from "@/services/order";
import { formatDuiWithAll, getConfigStatus, getCountryProperty, setPriceName, setPriceOptions, sumarSubtotal, sumarTotales, sumarTotalRetentionSujetoExcluido } from "@/utils/functions";
import { ConfigContext } from "@/contexts/config-context";
import { Alert } from "../alert/alert";
import { ShowTotal } from "./show-total";
import { RequestCodeModal } from "../common/request-code-modal";
import { useCodeRequest } from "@/hooks/useCodeRequest";
import { IoMdLock, IoMdUnlock } from "react-icons/io";


export interface SalesShowTotalProps {
 records?: Order
 isSending: boolean
 invoiceType?: ()=>void;
 setPrice:  (option: OptionsClickOrder) => void;
 priceType: number;
}

export function SalesShowTotal(props: SalesShowTotalProps) {
  const { records, isSending, invoiceType, setPrice, priceType } = props;
  const { config, systemInformation } = useContext(ConfigContext);
  const [multiPriceStatus, setMultiPriceStatus] = useState<boolean>(false)
  const [wholesalerStatus, setWholesalerStatus] = useState<boolean>(false)
  const [promotionStatus, setPromotionStatus] = useState<boolean>(false)
  const [showSeller, setShowSeller] = useState<boolean>(false)
  
  let pricesActive = [TypeOfPrice.normal];
  const { codeRequestPice, verifiedCode, isRequestCodeModal, setIsRequestCodeModal, isShowError, setIsShowError } = useCodeRequest('code-request-prices', false);

  useEffect(() => {
    setMultiPriceStatus(getConfigStatus("is-multi-price", config))
    setWholesalerStatus(getConfigStatus("product-price-wolesaler", config))
    setPromotionStatus(getConfigStatus("product-price-promotion", config))
    setShowSeller(getConfigStatus("sales-show-other-seller", config))
    // eslint-disable-next-line
  }, [config])

if(wholesalerStatus) pricesActive.push(TypeOfPrice.wholesaler)
if(promotionStatus) pricesActive.push(TypeOfPrice.promotion)


  if (!records?.invoiceproducts) return <></>
  if (records?.invoiceproducts.length == 0) return <></>

  const subtotal = sumarSubtotal(records?.invoiceproducts);
  return (<>
    <ShowTotal isSending={isSending} records={records} />
    { records?.invoice_assigned?.type == 4 &&
    <div className="border-2 border-red-700 rounded mb-2">
      <div className="mx-2 text-sm font-bold uppercase">Retención: { getCountryProperty(parseInt(systemInformation?.system?.country)).currency} 
        {sumarTotalRetentionSujetoExcluido(records).toFixed(2)}</div>
    </div>
    }
    <div className='flex justify-between border-2 border-sky-500 rounded mb-2'>
      <span className='mx-2 text-sm font-bold animatex' onClick={invoiceType} >{ records?.invoice_assigned?.name.toUpperCase() }</span> 
      { multiPriceStatus ? 
      <span className='mx-2 text-sm font-bold animatex flex' onClick={
        codeRequestPice.requestPrice && codeRequestPice.required ? 
        ()=> setIsRequestCodeModal(true) : 
        ()=>setPrice(setPriceOptions(priceType, pricesActive))
        }>{setPriceName(priceType)}<span className="mt-1 ml-2">{codeRequestPice.requestPrice && codeRequestPice.required ? 
          <IoMdLock color="red" /> : <IoMdUnlock color="green" />}</span></span> :
      <span className='mx-2 text-sm font-bold'>{setPriceName(priceType)}</span> 
      }
    </div>

    <div>
        { showSeller && <div className="flex justify-between border-b-2"> 
        <span className=" text-blue-500 ">Vendedor: {records?.employee?.name}</span></div>}
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


        { (records?.client?.taxpayer_type == 2 && subtotal >= 100) && <Alert
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

        { (records?.client?.excluded == 1) && <Alert
          theme={PresetTheme.danger}
          info="Importante"
          text="Cliente Exento de impuestos"
          isDismisible={false}
          className='my-2'
          /> }

      <RequestCodeModal isShow={isRequestCodeModal}  
      onClose={()=>setIsRequestCodeModal(false)} 
      verifiedCode={verifiedCode} 
      isShowError={isShowError} 
      setIsShowError={()=>setIsShowError(false)} />
    </>);
}
