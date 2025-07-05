import { ConfigContext } from "@/contexts/config-context";
import { formatDuiWithAll, numberToMoney, sumarCantidad, sumarDiscount, sumarTotalesWithoutDIscount } from "@/utils/functions";
import { useContext } from "react";

export interface RestaurantShowTotalProps {
    isSending?: boolean;
    order: any;
    isShow?: boolean;
}

export function RestaurantShowTotal(props: RestaurantShowTotalProps) {
  const { isSending, order, isShow } = props;
  const { systemInformation } = useContext(ConfigContext);


  if (!isShow) return <></>

  const total = sumarCantidad(order?.invoiceproducts);
  const subtotal = sumarTotalesWithoutDIscount(order?.invoiceproducts);
  const discount = sumarDiscount(order?.invoiceproducts);
  const tips_percentage = order?.attributes?.tips_percentage ?? 0;

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

            { tips_percentage > 0 &&
                <div className={`flex justify-between ${isSending && 'text-red-800 animate-pulse'}`}>
                    <div className="w-full text-sm items-center pl-4 text-left">Propina | { tips_percentage } %</div>
                    <div className="w-full text-sm items-center flex pr-4 justify-end">
                        { numberToMoney((tips_percentage / 100 * total), systemInformation)}
                    </div>
                </div>
            }

                <div className={`flex justify-between ${isSending && 'text-red-800 animate-pulse'}`}>
                    <div className="w-full  font-bold text-2xl items-center pl-4 text-left">Total</div>
                    <div className="w-full  font-bold text-2xl items-center flex pr-4 justify-end">
                        { numberToMoney(total + (tips_percentage / 100 * total), systemInformation)}
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
