'use client'
import { getTotalPercentage, numberToMoney } from "@/utils/functions";
import { NothingHere } from "../nothing-here/nothing-here";
import { formatDate, formatHourAsHM } from "@/utils/date-formats";
import { useContext, useEffect, useState } from "react";
import { getData, postData } from "@/services/resources";
import { ToggleSwitch } from "flowbite-react";
import toast, { Toaster } from 'react-hot-toast';
import { ConfigContext } from "@/contexts/config-context";




interface CommissionsGoldSelectTableProps {
  record?:  any;
  setProducts: (products: number) => void;
}

export function CommissionsGoldSelectTable(props: CommissionsGoldSelectTableProps) {
  const { record, setProducts } = props;
  const [ordersCommission, setOrdersCommission] = useState({} as any);
  const [isSending, setIsSending] = useState(false);
  const { systemInformation } = useContext(ConfigContext);

  
  const handleGetCommissions = async () => {
      try {
          const active = await getData(`tools/commissions/gold/${record?.data?.id}`);
          if (!active.message) {
              setOrdersCommission(active)
            } 
        } catch (error) {
            console.error(error);
        }
    };
    
    useEffect(() => {
        if (record) {
            (async () => await handleGetCommissions())();
            if (ordersCommission.data) {
                setProducts(ordersCommission.data.length);
            }
        }
        // eslint-disable-next-line
    }, [record]);
    
    
    useEffect(() => {
            if (ordersCommission.data) {
                setProducts(ordersCommission.data.length);
            }
        // eslint-disable-next-line
    }, [ordersCommission]);
    

    console.log("ordersCommission: ", ordersCommission)
    
    if (!record.data) return <NothingHere width="164" height="98" />;
    if (record.data.length == 0) return <NothingHere text="No se encontraron datos" width="164" height="98" />;
    



  const listItems = ordersCommission && ordersCommission?.data?.map((record: any, key: any) => (
    <tr key={key} className={`border-b ${record?.credit && record?.credit?.status == 1 && "bg-red-200"}`}>
      <td className="py-2 px-6 truncate">{ formatDate(record?.payed_at) } { formatHourAsHM(record?.payed_at) }</td>
      <th className="py-2 px-6 text-gray-900 whitespace-nowrap dark:text-white" scope="row">{ record?.invoices }</th>
      <td className="py-2 px-6 text-gray-900 whitespace-nowrap dark:text-white">{ record?.products }</td>
      <td className="py-2 px-6">{ numberToMoney(record?.commissions ? record?.commissions : 0, systemInformation) }</td>
      <td className="py-2 px-6">{ numberToMoney(record?.total ? record?.total : 0, systemInformation) }</td>
    </tr>
  ));
  

  return (<div> { ordersCommission?.data && ordersCommission?.data.length > 0 ?
                  <div className="w-full overflow-auto">
                    <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                        <tr>
                        <th scope="col" className="py-3 px-4 border">Fecha</th>
                        <th scope="col" className="py-3 px-4 border">Facturas</th>
                        <th scope="col" className="py-3 px-4 border">Productos</th>
                        <th scope="col" className="py-3 px-4 border whitespace-nowrap">Comisión $</th>
                        <th scope="col" className="py-3 px-4 border">Total</th>
                        </tr>
                    </thead>
                    <tbody>{listItems}</tbody>
                    </table>
            </div> :
            <NothingHere width="164" height="98" text="No hay facturas pendientes de pago" />
          }
      <Toaster position="top-right" reverseOrder={false} />
 </div>);
}
