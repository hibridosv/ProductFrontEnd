'use client'
import { getTotalPercentage, numberToMoney } from "@/utils/functions";
import { NothingHere } from "../nothing-here/nothing-here";
import { formatDate, formatHourAsHM } from "@/utils/date-formats";
import { useEffect, useState } from "react";
import { getData, postData } from "@/services/resources";
import { ToggleSwitch } from "flowbite-react";
import toast, { Toaster } from 'react-hot-toast';

interface CommissionsProductsTableProps {
  record?:  any;
  setProducts: (products: number) => void;
}

export function CommissionsProductsTable(props: CommissionsProductsTableProps) {
  const { record, setProducts } = props;
  const [ordersCommission, setOrdersCommission] = useState({} as any);
  const [isSending, setIsSending] = useState(false);


  const handleGetProducts = async () => {
    try {
      const active = await  await getData(`tools/commissions/orders?userId=${record?.data?.referred_id}`);
      if (!active.message) {
        setOrdersCommission(active)
      } 
    } catch (error) {
      console.error(error);
    }
};

useEffect(() => {
  if (record) {
    (async () => await handleGetProducts())();
  }
// eslint-disable-next-line
}, [record]);


useEffect(() => { // manda el dato de cuantas ordenes hay marcadas
    if (ordersCommission?.data) {
        let total = 0;
        ordersCommission?.data?.forEach((record: any) => {
            if (!isSelectedOrder(record?.products)) {
                total += 1; // Incrementa el total en 1 si isSelectedOrder es verdadero
            }
        });
        setProducts(total);
    }
  // eslint-disable-next-line
  }, [ordersCommission?.data]);


  
  if (!record.data) return <NothingHere width="164" height="98" />;
  if (record.data.length == 0) return <NothingHere text="No se encontraron datos" width="164" height="98" />;


  const isSelectedOrder = (datos: any): boolean => {
    let totalElementos = 0;
    datos?.forEach((elemento: any) => {
      totalElementos += (elemento?.is_commission_payed == 0 ? 1 : 0);
    });
    return totalElementos > 0;
  };

  const getTotalCommission = (datos: any): any => {
    let totalSuma = 0;
    datos?.forEach((elemento: any) => {
        totalSuma =  getTotalPercentage(elemento?.total, elemento?.commission) + totalSuma;
    });
    return totalSuma;
  }

  const updateOrderAtPay = async (order: string, active: boolean) => {
    let jsonCopy = JSON.parse(JSON.stringify(ordersCommission));
    let ticketOrderId = order;
    jsonCopy.data.forEach((order:any) => {
        if (order.id === ticketOrderId) {
            order.products.forEach((product:any) => {
                if (product.is_commission_payed == 0) {
                    product.is_commission_payed = 2;
                } else {
                    product.is_commission_payed = 0;
                }
            });
        }
    });
    setOrdersCommission(jsonCopy)
    try {
      setIsSending(true);
      const response = await postData(`tools/commissions/add/${order}`, "PUT", { "userId" : record?.data?.referred_id, active  });
      if (response.type == "error") {
        toast.error("Ocurrio un error al actualizar")
        await handleGetProducts()
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsSending(false);
    }
  }
console.log("ordersCommission: ", ordersCommission)
  const listItems = ordersCommission && ordersCommission?.data?.map((record: any, key: any) => (
    <tr key={key} className={`border-b ${record?.credit && record?.credit?.status == 1 && "bg-red-200"}`}>
      <td className="py-2 px-6 truncate">{ formatDate(record?.charged_at) } { formatHourAsHM(record?.charged_at) }</td>
      <th className="py-2 px-6 text-gray-900 whitespace-nowrap dark:text-white" scope="row">{ record?.invoice_assigned?.name }: { record?.invoice } </th>
      <td className="py-2 px-6 text-gray-900 whitespace-nowrap dark:text-white">{ record?.referred?.name }</td>
      <td className="py-2 px-6">{ record?.products.length }</td>
      <td className="py-2 px-6">{ numberToMoney(record?.discount ? record?.discount : 0) }</td>
      <td className="py-2 px-6">{ numberToMoney(getTotalCommission(record?.products)) }</td>
      <td className="py-2 px-6">{ numberToMoney(record?.total ? record?.total : 0) }</td>
      <td className="py-2 px-6"><ToggleSwitch
                        disabled={record?.credit && record?.credit?.status == 1}
                        checked={!isSelectedOrder(record?.products)}
                        label=""
                        onChange={() => updateOrderAtPay(record?.id, isSelectedOrder(record?.products))}
                      /></td>
    </tr>
  ));
  

  return (<div> { ordersCommission?.data && ordersCommission?.data.length > 0 ?
                  <div className="w-full overflow-auto">
                    <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                        <tr>
                        <th scope="col" className="py-3 px-4 border">Fecha</th>
                        <th scope="col" className="py-3 px-4 border">Factura</th>
                        <th scope="col" className="py-3 px-4 border">Referido</th>
                        <th scope="col" className="py-3 px-4 border">Productos</th>
                        <th scope="col" className="py-3 px-4 border">Descuento</th>
                        <th scope="col" className="py-3 px-4 border whitespace-nowrap">Comisión $</th>
                        <th scope="col" className="py-3 px-4 border">Total</th>
                        <th scope="col" className="py-3 px-4 border">Pagar</th>
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
