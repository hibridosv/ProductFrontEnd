import { ConfigContext } from "@/contexts/config-context";
import { getCountryProperty, sumarCantidad, sumarSubtotal } from "@/utils/functions";
import { useContext } from "react";

export interface RestaurantShowTotalProps {
    isSending?: boolean;
    order: any
}

export function RestaurantShowTotal(props: RestaurantShowTotalProps) {
  const { isSending, order } = props;
  const { systemInformation } = useContext(ConfigContext);


  if (!order?.invoiceproducts) return <></>
  if (order?.invoiceproducts.length == 0) return <></>

  const total = sumarCantidad(order?.invoiceproducts);
  const subtotal = sumarSubtotal(order?.invoiceproducts);
  const retention = subtotal * 0.01;


    return (
        <div className="p-2 mt-4 w-full">
            <div className="rounded-lg border-2 uppercase">
                <div className={`flex justify-between ${isSending && 'text-red-800 animate-pulse'}`}>
                    <div className="w-full  font-bold text-2xl items-center pl-4 text-left">Total</div>
                    <div className="w-full  font-bold text-2xl items-center flex pr-4 justify-end">
                        { getCountryProperty(parseInt(systemInformation?.system?.country)).currency} 
                        {order?.client?.taxpayer_type == 2 && subtotal >= 100 ? (total - retention).toFixed(2) : total.toFixed(2)}</div>
                </div>
            </div>
        </div>
    );

}
