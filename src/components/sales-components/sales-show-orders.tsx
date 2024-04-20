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
import { getTenant, getUrlFromCookie } from "@/services/oauth";
import { FaDownload } from "react-icons/fa";
import Pusher from 'pusher-js';



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
  const [randomNumber, setRandomNumber] = useState(0);
  let pricesActive = [TypeOfPrice.normal];
  const remoteUrl = getUrlFromCookie();
  const tenant = getTenant();
  
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
  }, [randomNumber]);
  

  const getPusherRequest = ()=>{
    var pusher = new Pusher('67ef4909138ad18120e1', { cluster: 'us2' });
    var channel = pusher.subscribe(`${tenant}-channel-orders`);
    channel.bind('get-orders-event', function(data:any) {
      if (!order) {
        setRandomNumber(Math.random());
      }
    });
  }

  useEffect(() => {
      setMultiPriceStatus(getConfigStatus("is-multi-price", config))
      setWholesalerStatus(getConfigStatus("product-price-wolesaler", config))
      setPromotionStatus(getConfigStatus("product-price-promotion", config))
      setDownloadStatus(getConfigStatus("sales-download", config))
      if (getConfigStatus("realtime-orders", config)) {
          getPusherRequest();
      }
    // eslint-disable-next-line
  }, [config])

  if(wholesalerStatus) pricesActive.push(TypeOfPrice.wholesaler)
  if(promotionStatus) pricesActive.push(TypeOfPrice.promotion)


  if (isLoading) return <Loading />;

  const imageLoader = ({ src, width, quality }: any) => {
    return `${remoteUrl}/images/logo/${src}?w=${width}&q=${quality || 75}`
  }

  const showProducts = (products: any) =>{
   return (<table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
      <tr>
        <th scope="col" className="py-2 px-2 border">Cod</th>
        <th scope="col" className="py-2 px-2 border">Producto</th>
        <th scope="col" className="py-2 px-2 border">Cantidad</th>
        <th scope="col" className="py-2 px-2 border">Total</th>
      </tr>
    </thead>
    <tbody>{
    products?.map((product: any):any => (
      <tr key={product.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
            <td className="py-1 px-2">{product.cod }</td>
            <td className="py-1 px-2">{product.product }</td>
            <td className="py-1 px-2">{ product.quantity}</td>
            <td className="py-1 px-2">{ numberToMoney(product.total)}</td>
      </tr>
    ))
    }</tbody>
  </table>)
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
              { downloadStatus && <span className="justify-end"><a target="_blank" href={`${remoteUrl}/download/pdf/order/${order.id}`}><FaDownload /></a></span> }
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
