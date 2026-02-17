'use client'
import { RequestCodeModal } from "@/components/common/request-code-modal";
import { NothingHere } from "@/components/nothing-here/nothing-here";
import { OptionsClickSales } from "@/components/sales-components/sales-quick-table";
import { ConfigContext } from "@/contexts/config-context";
import { useCodeRequest } from "@/hooks/useCodeRequest";
import { OptionsClickOrder } from "@/services/enums";
import { getUrlFromCookie } from "@/services/oauth";
import { Product } from "@/services/products";
import { countSendPrint, getLastElement, groupInvoiceProductsByCodAll, isProductPendientToSend, numberToMoney } from "@/utils/functions";
import Image from "next/image";
import { useContext } from "react";
import toast from "react-hot-toast";
import { AiFillCloseCircle } from "react-icons/ai";
import { MdDelete } from "react-icons/md";


export interface ProductsTableProps {
  order: any
  isShow?: boolean;
  onClickOrder: (option: OptionsClickOrder)=>void
  onClickProduct: (product: Product, option: OptionsClickSales)=>void
  blocked?: boolean;
}

export function ProductsTable(props: ProductsTableProps) {
  const { order, onClickOrder, onClickProduct, blocked, isShow = false } = props;
  const { systemInformation } = useContext(ConfigContext);
  const remoteUrl = getUrlFromCookie();
  const { codeRequest, 
    verifiedCode, 
    isRequestCodeModal, 
    setIsRequestCodeModal, 
    isShowError, 
    setIsShowError } = useCodeRequest('code-request-delete-product', false, order?.id);

    const isCodeRequired = codeRequest.requestCode && codeRequest.required;
    const isCodeRequiredOrder = codeRequest.requestCode && codeRequest.required && countSendPrint(order) != 0;
    
  if (!isShow ) return <></>
  
  
        const imageLoader = ({ src, width, quality }: any) => `${remoteUrl}/images/logo/${src}?w=${width}&q=${quality || 75}`
            
        if (!order?.invoiceproducts) return (
            <div className="hidden w-full md:grid place-items-center">
                { systemInformation && systemInformation?.system?.logo ? 
                <Image loader={imageLoader} src={systemInformation && systemInformation?.system?.logo} alt="Hibrido" width={500} height={500} className="w-full max-w-[500px]"
                sizes="(max-width: 768px) 100vw, 500px" /> :
                <NothingHere width="500" text=" " />
                }
            </div>
        )

        order?.invoiceproducts && groupInvoiceProductsByCodAll(order);
        const listItems = order?.invoiceproductsGroup.map((record: any) => { 
            return (
            <tr key={record.id} className="border-b bg-white" >
            <td className='py-3 px-6 clickeable' onClick={record.options.length > 0 ? ()=> toast.error('Opción no disponible en este producto') : ()=> onClickProduct(record, OptionsClickSales.quantity)}>{ record.quantity }</td>
            <td className="py-3 px-6">{ record.product }</td>
            <td className="py-3 px-6 clickeable truncate" onClick={()=> onClickProduct(record, OptionsClickSales.discount)}>{ numberToMoney(record.unit_price, systemInformation) }</td> 
            <td className="py-3 px-6 truncate">{ numberToMoney(record.total, systemInformation) }</td>
            { !blocked &&
            <td className="py-2 truncate">
            <span className="flex justify-between">
                <AiFillCloseCircle size={20} title="Editar" className={`${isCodeRequired && isProductPendientToSend(getLastElement(order?.invoiceproducts, "cod", record?.cod)) ? 'text-grey-800' : 'text-red-800'} clickeable`} onClick={
                                  isCodeRequired && isProductPendientToSend(getLastElement(order?.invoiceproducts, "cod", record?.cod)) ? 
                                  ()=> setIsRequestCodeModal(true) : 
                                  ()=> onClickProduct(record, OptionsClickSales.delete)
                                   } />
            </span>
            </td>
            }
            </tr>
        )
        });


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
                        { !blocked &&
                        <th scope="col" className="py-3 border"><MdDelete size={22} title="Eliminar" className={`${isCodeRequiredOrder ? 'text-grey-800' : 'text-red-800'} clickeable`} onClick={
                                   isCodeRequiredOrder ? 
                                  ()=> setIsRequestCodeModal(true) : 
                                  ()=>onClickOrder(OptionsClickOrder.delete)
                        } /></th>
                        }
                        </tr>
                    </thead>
                    <tbody>
                        {listItems}
                    </tbody>
                    </table>
                </div>
                <RequestCodeModal isShow={isRequestCodeModal}  
                    onClose={()=>setIsRequestCodeModal(false)} 
                    verifiedCode={verifiedCode} 
                    isShowError={isShowError} 
                    setIsShowError={()=>setIsShowError(false)} />
            </div>
  );

}
