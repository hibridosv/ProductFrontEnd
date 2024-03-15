'use client'
import { useState, useEffect, useContext } from "react";
import { getData } from "@/services/resources";
import { Loading } from "../loading/loading";
import { ListGroup, Tooltip } from "flowbite-react";
import { formatDateAsDMY, formatHourAsHM } from "@/utils/date-formats";
import Image from "next/image";
import { getConfigStatus, numberToMoney, setPriceName, setPriceOptions } from "@/utils/functions";
import { OptionsClickOrder, PresetTheme, TypeOfPrice } from "@/services/enums";
import { Alert } from "../alert/alert";
import { ConfigContext } from "@/contexts/config-context";
import { getUrlFromCookie } from "@/services/oauth";
import { FaDownload } from "react-icons/fa";



export interface SalesShowOrdersProps {
    onClick: (option: any) => void;
    setPrice:  (option: OptionsClickOrder) => void;
    priceType: number;
    order: any; // no deben haver una orden cargada para que se carguen los datos de esta pagina
}

export function SalesShowOrders(props: SalesShowOrdersProps) {
  const { onClick, setPrice, priceType, order  } = props;
  const [isLoading, setIsLoading] = useState(false);
  const [orders, setOrders] = useState([]) as any;
  const { config, systemInformation } = useContext(ConfigContext);
  const [multiPriceStatus, setMultiPriceStatus] = useState<boolean>(false)
  const [wholesalerStatus, setWholesalerStatus] = useState<boolean>(false)
  const [promotionStatus, setPromotionStatus] = useState<boolean>(false)
  const [downloadStatus, setDownloadStatus] = useState<boolean>(false)
  let pricesActive = [TypeOfPrice.normal];
  const remoteUrl = getUrlFromCookie();
  
  const loadAllOrders = async () => {
    setIsLoading(true);
    try {
      const response = await getData(`sales`);
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
  }, []);
  
  useEffect(() => {
      setMultiPriceStatus(getConfigStatus("is-multi-price", config))
      setWholesalerStatus(getConfigStatus("product-price-wolesaler", config))
      setPromotionStatus(getConfigStatus("product-price-promotion", config))
      setDownloadStatus(getConfigStatus("sales-download", config))
    // eslint-disable-next-line
  }, [config])

  if(wholesalerStatus) pricesActive.push(TypeOfPrice.wholesaler)
  if(promotionStatus) pricesActive.push(TypeOfPrice.promotion)


  
  if (isLoading) return <Loading />;

  const imageLoader = ({ src, width, quality }: any) => {
    return `${remoteUrl}/images/logo/${src}?w=${width}&q=${quality || 75}`
  }

  const showProducts = (products: any) =>{
    return  products?.map((product: any):any => (
      <div key={product.id} className="w-full flex justify-center border-2">
        <div className="border border-teal-300">
            <span className="mx-2">{product.cod }</span>
            <span className="mx-2">{product.product }</span>
            <span className="mx-2">{ product.quantity}</span>
            <span className="mx-2">{ numberToMoney(product.total)}</span>
        </div>
      </div>
    ));
  }

  return (
    <div className="mx-3 sm:mt-3">
      { orders.length === 0 ? 
        <Image loader={imageLoader} src={systemInformation && systemInformation?.system?.logo} alt="Hibrido" width={500} height={500} /> : 
      <ListGroup>
        <ListGroup.Item active>ORDENES PENDIENTES</ListGroup.Item>

        {orders.map((order: any, index: any) => (
          <ListGroup.Item key={index}>
          <Tooltip animation="duration-300" content={showProducts(order.invoiceproducts)} placement="right-end" style="light" >
            <div className="w-full flex justify-between">
              <span className="uppercase" onClick={() => onClick(order.id)}>{order?.client?.name ? `Cliente: ${order?.client?.name}` : `Usuario: ${order.employee.name}`}</span>
              <span className="ml-3" onClick={() => onClick(order.id)}>
                {formatDateAsDMY(order.created_at)} | {formatHourAsHM(order.created_at)}
              </span>
              { downloadStatus && <a href={`${remoteUrl}/download/pdf/order/${order.id}`}><FaDownload /></a> }
            </div>
          </Tooltip>
          </ListGroup.Item>
        ))}
      </ListGroup> }

      { multiPriceStatus &&
        <div className="mt-4">
          <div className='flex justify-center border-2 border-sky-500 rounded mb-2'>
            <span className='mx-2 text-sm font-bold animatex' onClick={()=>setPrice(setPriceOptions(priceType, pricesActive))}>{setPriceName(priceType)}</span>
          </div>
        { priceType != TypeOfPrice.normal && <div className="flex justify-center"><Alert text={`EL PRECIO ESTA COMO ${setPriceName(priceType)}`} theme={PresetTheme.danger} isDismisible={false} /></div> }
      </div> }

    </div>
  );
}
