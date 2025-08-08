import { ConfigContext } from "@/contexts/config-context";
import { Order } from "@/services/order";
import { getCountryProperty, sumarSalesTotal, sumarSubtotal, sumarTotalRetentionRenta } from "@/utils/functions";
import { useContext } from "react";


export interface ShowTotalProps {
 records: Order
 isSending: boolean
}

export function ShowTotal(props: ShowTotalProps) {
  const { records, isSending } = props;
  const { systemInformation } = useContext(ConfigContext);
  const isExcludedClient = records?.client?.excluded == 1;
  const retencionRenta = records?.retention_rent ?? 0 ;

  if (!records?.invoiceproducts) return <></>
  if (records?.invoiceproducts.length == 0) return <></>

  const texStyle = isSending ? "flex justify-center text-7xl mb-4 text-gray-500 animate-pulse pb-4" : "flex justify-center text-7xl mb-4 pb-4"; 

  return (
    <div className="w-full my-4 shadow-neutral-600 shadow-lg rounded-md">
      <div className="flex justify-center pt-2">TOTAL</div>
      <div className={texStyle}>{ getCountryProperty(parseInt(systemInformation?.system?.country)).currency} 
        { isExcludedClient ? sumarSubtotal(records?.invoiceproducts).toFixed(2) : (retencionRenta > 0 ? (sumarSalesTotal(records) - sumarTotalRetentionRenta(records)).toFixed(2) : sumarSalesTotal(records).toFixed(2))}
        </div>
    </div>
    );
}
