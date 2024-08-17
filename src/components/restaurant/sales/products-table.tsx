'use client'
import { OptionsClickSales } from "@/components/sales-components/sales-quick-table";
import { ConfigContext } from "@/contexts/config-context";
import { OptionsClickOrder } from "@/services/enums";
import { getUrlFromCookie } from "@/services/oauth";
import { Product } from "@/services/products";
import { groupInvoiceProductsByCod, numberToMoney } from "@/utils/functions";
import Image from "next/image";
import { useContext, useState } from "react";
import { AiFillCloseCircle } from "react-icons/ai";
import { MdDelete } from "react-icons/md";


export interface ProductsTableProps {
  order: any
  onClickOrder: (option: OptionsClickOrder)=>void
  onClickProduct: (product: Product, option: OptionsClickSales)=>void
}

export function ProductsTable(props: ProductsTableProps) {
  const { order, onClickOrder, onClickProduct } = props;
  const { systemInformation } = useContext(ConfigContext);
  const remoteUrl = getUrlFromCookie();
  const [isSending, setIsSending] = useState(false);
  
  const imageLoader = ({ src, width, quality }: any) => {
      return `${remoteUrl}/images/logo/${src}?w=${width}&q=${quality || 75}`
    }

    console.log(systemInformation?.system?.country)
    if (!order?.invoiceproducts) return <div className="w-full flex justify-center">
            <Image loader={imageLoader} src={systemInformation && systemInformation?.system?.logo} alt="Hibrido" width={500} height={500} />
            </div>


        order?.invoiceproducts && groupInvoiceProductsByCod(order);
        const listItems = order?.invoiceproductsGroup.map((record: any) => (
            <tr key={record.id} className="border-b bg-white" >
            <td className="py-3 px-6 clickeable" onClick={()=> onClickProduct(record, OptionsClickSales.quantity)}>{ record.quantity }</td>
            <td className="py-3 px-6">{ record.product }</td>
            <td className="py-3 px-6 clickeable truncate" onClick={()=> onClickProduct(record, OptionsClickSales.discount)}>{ numberToMoney(record.unit_price, systemInformation) }</td> 
            <td className="py-3 px-6 truncate">{ numberToMoney(record.total, systemInformation) }</td>
            <td className="py-2 truncate">
            <span className="flex justify-between">
                <AiFillCloseCircle size={20} title="Editar" className="text-red-600 clickeable" onClick={()=> onClickProduct(record, OptionsClickSales.delete) } />
            </span>
            </td>
            </tr>
        ));


      return (
            <div className="rounded-sm shadow-md w-full ">
                <div className="overflow-auto">
                    <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                        <tr>
                        <th scope="col" className="py-3 px-4 border">Cant</th>
                        <th scope="col" className="py-3 px-4 border">Producto</th>
                        <th scope="col" className="py-3 px-4 border">Precio</th>
                        <th scope="col" className="py-3 px-4 border">Total</th>
                        <th scope="col" className="py-3 border"><MdDelete size={22} title="Eliminar" className="text-red-800 clickeable" onClick={()=>onClickOrder(OptionsClickOrder.delete)} /></th>
                        </tr>
                    </thead>
                    <tbody>
                        {listItems}
                    </tbody>
                    </table>
                </div>
            </div>
  );

}
