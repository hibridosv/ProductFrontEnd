import { ConfigContext } from "@/contexts/config-context";
import { getCountryProperty, numberToMoney, sumarCantidad, sumarDiscount, sumarSubtotal, sumarTotalesWithoutDIscount } from "@/utils/functions";
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
  const subtotal = sumarTotalesWithoutDIscount(order?.invoiceproducts);
  const discount = sumarDiscount(order?.invoiceproducts);


    return (
        <div className="p-2 mt-4 w-full">
            <div className="rounded-lg border-2 uppercase">
                <div className={`flex justify-between ${isSending && 'text-red-800 animate-pulse'}`}>
                    <div className="w-full text-sm items-center pl-4 text-left">Sub total</div>
                    <div className="w-full text-sm items-center flex pr-4 justify-end">
                        { numberToMoney(subtotal, systemInformation)}
                    </div>
                </div>

                <div className={`flex justify-between ${isSending && 'text-red-800 animate-pulse'}`}>
                    <div className="w-full text-sm items-center pl-4 text-left">Descuento</div>
                    <div className="w-full text-sm items-center flex pr-4 justify-end">
                        { numberToMoney(discount, systemInformation)}
                    </div>
                </div>

                <div className={`flex justify-between ${isSending && 'text-red-800 animate-pulse'}`}>
                    <div className="w-full  font-bold text-2xl items-center pl-4 text-left">Total</div>
                    <div className="w-full  font-bold text-2xl items-center flex pr-4 justify-end">
                        { numberToMoney(total, systemInformation)}
                    </div>
                </div>
            </div>
        </div>
    );

}
