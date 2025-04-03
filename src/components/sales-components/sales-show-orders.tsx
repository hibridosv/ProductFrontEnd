'use client'
import { useState, useEffect, useContext } from "react";
import { getData } from "@/services/resources";
import { Loading } from "../loading/loading";
import { Tooltip } from "flowbite-react";
import { formatDateAsDMY, formatHourAsHM } from "@/utils/date-formats";
import Image from "next/image";
import { getConfigStatus, numberToMoney, setPriceName, setPriceOptions } from "@/utils/functions";
import { OptionsClickOrder, PresetTheme, TypeOfPrice } from "@/services/enums";
import { Alert } from "../alert/alert";
import { ConfigContext } from "@/contexts/config-context";
import { getTenant, getUrlFromCookie } from "@/services/oauth";
import { FaDownload } from "react-icons/fa";
import { ButtonDownload } from "../button/button-download";
import { useCodeRequest } from "@/hooks/useCodeRequest";
import { RequestCodeModal } from "../common/request-code-modal";
import { IoMdLock, IoMdUnlock } from "react-icons/io";
import useReverb from "@/hooks/useReverb";



export interface SalesShowOrdersProps {
    onClick: (option: any) => void;
    setPrice:  (option: OptionsClickOrder) => void;
    priceType: number;
    order: any; // no deben haver una orden cargada para que se carguen los datos de esta pagina
    isShow: boolean;
}

export function SalesShowOrders(props: SalesShowOrdersProps) {
  const { onClick, setPrice, priceType, order, isShow  } = props;
  const [isLoading, setIsLoading] = useState(false);
  const [orders, setOrders] = useState([]) as any;
  const { config, systemInformation } = useContext(ConfigContext);
  const [multiPriceStatus, setMultiPriceStatus] = useState<boolean>(false)
  const [wholesalerStatus, setWholesalerStatus] = useState<boolean>(false)
  const [promotionStatus, setPromotionStatus] = useState<boolean>(false)
  const [downloadStatus, setDownloadStatus] = useState<boolean>(false)
  let pricesActive = [TypeOfPrice.normal];
  const { codeRequestPice, 
    verifiedCode, 
    isRequestCodeModal, 
    setIsRequestCodeModal, 
    isShowError, 
    setIsShowError } = useCodeRequest('code-request-prices', false);
  const remoteUrl = getUrlFromCookie();
  const tenant = getTenant();
  let pusherEvent = useReverb(`${tenant}-channel-orders`, 'get-orders-event', getConfigStatus("realtime-orders", config)).random;
  
  const loadAllOrders = async () => {
    setIsLoading(true);
    try {
      const response = await getData(`sales?included=employee,client,invoiceproducts&filterWhere[status]==2`);
      setOrders(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    if (!order) {
      (async () =>  await loadAllOrders())();
    }
    // eslint-disable-next-line
  }, [pusherEvent, order]);
  
  
  useEffect(() => {
      if(!order){
        setMultiPriceStatus(getConfigStatus("is-multi-price", config))
        setWholesalerStatus(getConfigStatus("product-price-wolesaler", config))
        setPromotionStatus(getConfigStatus("product-price-promotion", config))
        setDownloadStatus(getConfigStatus("sales-download", config))
      }
    // eslint-disable-next-line
  }, [config, order])
  
    if(wholesalerStatus) pricesActive.push(TypeOfPrice.wholesaler)
    if(promotionStatus) pricesActive.push(TypeOfPrice.promotion)
    
      
  if (isLoading) return <Loading />;
  if (!isShow) return null;

  const imageLoader = ({ src, width, quality }: any) => {
    return `${remoteUrl}/images/logo/${src}?w=${width}&q=${quality || 75}`
  }

  const showProducts = (products: any) =>{
   return (<div className="w-8/10">
    <table className="text-sm text-left text-gray-500 dark:text-gray-400">
    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
      <tr>
        <th scope="col" className="py-2 px-2 border">Cod</th>
        <th scope="col" className="py-2 px-2 border">Producto</th>
        <th scope="col" className="py-2 px-2 border">Cant</th>
        <th scope="col" className="py-2 px-2 border">Total</th>
      </tr>
    </thead>
    <tbody>{
    products?.map((product: any):any => (
      <tr key={product.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
            <td className="py-1 px-2">{product.cod }</td>
            <td className="py-1 px-2">{product.product }</td>
            <td className="py-1 px-2">{ product.quantity}</td>
            <td className="py-1 px-2">{ numberToMoney(product.total, systemInformation)}</td>
      </tr>
    ))
    }</tbody>
  </table>
  </div>)
  }

  return (
    <div className="sm:mt-3">
      { orders.length === 0 ? 
        <div className="w-full flex justify-center">
          { systemInformation?.system && <Image loader={imageLoader} src={systemInformation?.system?.logo} alt="Hibrido" width={500} height={500} /> }
        </div> : 
          <div className="w-full rounded-lg border-2 shadow-md bg-black">
          <div className="text-center uppercase rounded-t-lg py-2 bg-teal-900 text-gray-200 font-medium">ORDENES PENDIENTES</div>

          {orders.map((order: any, index: any) => (
            <div key={index} className="flex justify-around py-1 border-x-2 border-b-2 border-slate-900 text-center uppercase bg-teal-200 font-medium">
                <Tooltip animation="duration-300" content={showProducts(order.invoiceproducts)} style="light" >
                <span  onClick={() => onClick(order.id)} className="ml-1 clickeable">{order?.client?.name ? `Cliente: ${order?.client?.name}` : `Usuario: ${order.employee.name}`}</span>
                </Tooltip>
                <span className="ml-2">
                  {formatDateAsDMY(order.created_at)} | {formatHourAsHM(order.created_at)}
                </span>
                { downloadStatus && 
                <div className="ml-1">
                  <ButtonDownload autoclass={false} href={`/download/pdf/order/${order.id}`}><FaDownload /></ButtonDownload>
                </div> }
              </div>
          ))}
        </div> 
      }

      { multiPriceStatus &&
        <div className="mt-4">
          <div className='flex justify-center border-2 border-sky-500 rounded mb-2'>
            <span className='mx-2 text-sm font-bold animatex flex' onClick={
              codeRequestPice.requestPrice && codeRequestPice.required ? 
              ()=> setIsRequestCodeModal(true) : 
              ()=>setPrice(setPriceOptions(priceType, pricesActive)) }>

                {setPriceName(priceType)} 
              <span className="mt-1 ml-2">{codeRequestPice.requestPrice && codeRequestPice.required ? 
              <IoMdLock color="red" /> : <IoMdUnlock color="green" />}</span></span>
          </div>
        { priceType != TypeOfPrice.normal && <div className="flex justify-center"><Alert text={`EL PRECIO ESTA COMO ${setPriceName(priceType)}`} theme={PresetTheme.danger} isDismisible={false} /></div> }
      </div> }
      <RequestCodeModal isShow={isRequestCodeModal}  
      onClose={()=>setIsRequestCodeModal(false)} 
      verifiedCode={verifiedCode} 
      isShowError={isShowError} 
      setIsShowError={()=>setIsShowError(false)} />
    </div>
  );
}
