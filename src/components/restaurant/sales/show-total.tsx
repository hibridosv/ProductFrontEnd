import { ConfigContext } from "@/contexts/config-context";
import { formatDuiWithAll, getCountryProperty, numberToMoney, sumarCantidad, sumarDiscount, sumarSubtotal, sumarTotalesWithoutDIscount } from "@/utils/functions";
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

            <div>
                {order?.client?.name && <div className="flex justify-between border-b-2 mt-3"> 
                <span className=" text-red-500 ">Cliente: {order?.client?.name}</span>
                <span className=" text-red-500 ">{order?.client?.document ? formatDuiWithAll(order?.client?.document) : formatDuiWithAll(order?.client?.id_number)}</span></div>}

                {order?.delivery?.name && <div className="flex justify-between border-b-2 mt-3"> 
                <span className=" text-blue-500 ">Repartidor: {order?.delivery?.name}</span></div>}
            </div>

            <div>
                {order?.comment && <div className="flex justify-between border-b-2 mt-2"> 
                <span className="text-teal-500 font-semibold">Nota: {order?.comment}</span></div>}
            </div>


        </div>
    );

}
