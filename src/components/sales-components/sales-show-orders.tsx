'use client'
import { useState, useEffect, useContext } from "react";
import { getData } from "@/services/resources";
import { Loading } from "../loading/loading";
import { ListGroup } from "flowbite-react";
import { formatDateAsDMY, formatHourAsHM } from "@/utils/date-formats";
import Image from "next/image";
import { URL } from "@/constants";
import { getConfigStatus, setPriceName, setPriceOptions } from "@/utils/functions";
import { OptionsClickOrder, PresetTheme, TypeOfPrice } from "@/services/enums";
import { Alert } from "../alert/alert";
import { ConfigContext } from "@/contexts/config-context";



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
  const { config } = useContext(ConfigContext);
  const [multiPriceStatus, setMultiPriceStatus] = useState<boolean>(false)
  const [wholesalerStatus, setWholesalerStatus] = useState<boolean>(false)
  const [promotionStatus, setPromotionStatus] = useState<boolean>(false)
  let pricesActive = [TypeOfPrice.normal];
  
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
    // eslint-disable-next-line
  }, [config])

  if(wholesalerStatus) pricesActive.push(TypeOfPrice.wholesaler)
  if(promotionStatus) pricesActive.push(TypeOfPrice.promotion)


  if (order) return null
  if (isLoading) return <Loading />;

  const imageLoader = ({ src, width, quality }: any) => {
    return `${URL}images/logo/${src}?w=${width}&q=${quality || 75}`
  }

  return (
    <div className="mx-3 sm:mt-3">
      { orders.length === 0 ? 
        <Image loader={imageLoader} src="hibrido.jpg" alt="Hibrido" width={500} height={500} /> : 
      <ListGroup>
        <ListGroup.Item active>ORDENES PENDIENTES</ListGroup.Item>

        {orders.map((order: any, index: any) => (
          <ListGroup.Item key={index} onClick={() => onClick(order.id)}>
            <div className="w-full flex justify-between">
              <span className="uppercase">{order.employee.name}</span>{" "}
              <span>
                {formatDateAsDMY(order.created_at)} |{" "}
                {formatHourAsHM(order.created_at)}
              </span>
            </div>
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
