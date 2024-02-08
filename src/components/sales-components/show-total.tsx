import { Order } from "@/services/order";
import { sumarCantidad } from "@/utils/functions";


export interface ShowTotalProps {
 records: Order
 isSending: boolean
}

export function ShowTotal(props: ShowTotalProps) {
  const { records, isSending } = props;


  if (!records?.invoiceproducts) return <></>
  if (records?.invoiceproducts.length == 0) return <></>

  const texStyle = isSending ? "flex justify-center text-7xl mb-4 text-gray-500 animate-pulse" : "flex justify-center text-7xl mb-4"; 
  const total = sumarCantidad(records?.invoiceproducts);
  return (
    <div className="w-full my-4 shadow-neutral-600 shadow-lg rounded-md">
      <div className="flex justify-center pt-2">TOTAL</div>
      <div className={`${texStyle} pb-4`}>$ {records?.client?.taxpayer_type == 2 && total >= 100 ? (total*0.99).toFixed(2) : total.toFixed(2)}</div>
    </div>
    );
}
