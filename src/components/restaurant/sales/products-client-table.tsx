'use client'
import { NothingHere } from "@/components/nothing-here/nothing-here";
import { OptionsClickSales } from "@/components/sales-components/sales-quick-table";
import { ConfigContext } from "@/contexts/config-context";
import { OptionsClickOrder } from "@/services/enums";
import { getUrlFromCookie } from "@/services/oauth";
import { Product } from "@/services/products";
import { groupInvoiceProductsByCodAll, numberToMoney } from "@/utils/functions";
import Image from "next/image";
import { useContext } from "react";
import toast from "react-hot-toast";
import { AiFillCloseCircle } from "react-icons/ai";
import { FaCheckSquare } from "react-icons/fa";
import { MdCheck, MdDelete } from "react-icons/md";


export interface ProductsClientTableProps {
  order: any
  onClickProduct: (product: Product, option: OptionsClickSales)=>void
  clientActive: number;
}

export function ProductsClientTable(props: ProductsClientTableProps) {
  const { order, onClickProduct, clientActive } = props;
  const { systemInformation } = useContext(ConfigContext);

        if (!order?.invoiceproducts) return <NothingHere width="500" text=" " />

        const listItems = order.invoiceproducts && order?.invoiceproducts.map((record: any) => (
            <tr key={record.id} className="border-b bg-white" >
            <td className='py-3 px-6 clickeable' onClick={record.options.length > 0 ? ()=> toast.error('Opción no disponible en este producto') : ()=> onClickProduct(record, OptionsClickSales.quantity)}>{ record.quantity }</td>
            <td className="py-3 px-6">{ record.product }</td>
            <td className="py-3 px-6 clickeable truncate" onClick={()=> onClickProduct(record, OptionsClickSales.discount)}>{ numberToMoney(record.unit_price, systemInformation) }</td> 
            <td className="py-2 truncate">
            <span className="flex justify-between">
                {
                    record.attributes.client == clientActive ? 
                    <AiFillCloseCircle size={24} className="text-red-600" /> 
                    :
                    <FaCheckSquare size={24} className="text-green-600 clickeable" />
                }
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
                        <th scope="col" className="py-3 border"></th>
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
