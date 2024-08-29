import { useRelativeTime } from '@/hooks/useRelativeTime';
import { formatDate, formatHourAsHM } from '@/utils/date-formats';
import { deliveryType, filterProductsOrInvoiceProducts } from '@/utils/functions';
import React, { Fragment } from 'react';
import { BiCar, BiCheckDouble, BiPrinter, BiUser } from 'react-icons/bi';
import { FaClock } from 'react-icons/fa';
import { TbPointFilled } from 'react-icons/tb';

export interface ScreenCardAllProps {
    order: any;
    processData: (values: {})=> void
}

const activePrint = (print: number) =>{
    switch (print) {
        case 1: return "Activo";
        case 2: return "Impreso";
        case 3: return "Terminado";
        case 0: return "Inactivo";
        default: return "Inactivo";
    }
}


export function ScreenCardAll(props: ScreenCardAllProps) {
    const { order, processData } = props;
    const time = useRelativeTime(order.created_at);
    const items = order?.products.length > 0 ? order?.products : order?.invoiceproducts;

    if (!order) return <></>

    console.log(order)


    return (
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
            <div className="py-2 px-3 flex flex-row" 
            // onClick={()=>processData({order: order?.id, status: 2, active_print: 3, url: "screen/order/counter"})}
                                                    >
                <div className="w-full">
                    <div className="w-full text-xl font-bold flex justify-around">
                        <div className="w-1/2">Orden # {order.number}</div>
                        <div className="text-sm text-gray-600 pt-1 text-right w-1/2"></div>
                    </div>
                    <div className="text-sm text-gray-800 flex">
                        <FaClock size={12} color="red" className="mt-1 mr-2 animate-spin-slow" />
                        {formatDate(order.created_at)} {formatHourAsHM(order.created_at)} | {time}
                    </div>
                    <div className="text-sm text-gray-800">
                        <i className="far fa-comment-dots"></i> { order?.comment }
                    </div>
                </div>
            </div>

            <table className="table-auto w-full text-sm text-left">
                <tbody>
                    {items.map((product: any) => {
                        return (<Fragment key={product.id}>
                            <tr  className={`border-y-2 border-slate-600 ${ product?.attributes?.work_station_id ? 'bg-red-100' : 'bg-slate-100'}`}>
                                <td className="font-medium h-9 flex p-2 uppercase">
                                    <BiCheckDouble size={20} color="green" className="mx-2" /> <span className='mr-2 font-bold'>{ product.quantity }</span> {product.product}
                                </td>
                            </tr>
                               {product?.options?.length > 0 && 
                               <tr className="bg-slate-100 border-y-2 border-slate-600">
                                    <td className=" font-medium h-9 flex p-2 bg-red-100">
                                        {product.options.map((option: any)=> <span key={option.id} className='flex'>
                                                <TbPointFilled className='mt-1 text-red-600' /><span className='mr-1 '>{option?.option?.name}</span>
                                            </span>)}
                                    </td>
                                </tr>
                                }
                            </Fragment>)
                    })}

                </tbody>
            </table>
            <div className="bg-lime-600 text-white text-center py-3 clickeable" onClick={()=>processData({order: order?.id,
                                                    status: 2,
                                                    active_print: 2,
                                                    url: "screen/order/counter"})}>
                <ul className="list-none flex justify-around space-x-4">
                    <li className="flex">
                        <BiPrinter className="mt-1 mr-2" /> <span>{activePrint(order.active_print)}</span>
                    </li>
                </ul>
            </div>
            <div className="bg-gray-800 text-white text-center py-3">
                <ul className="list-none flex justify-around space-x-4">
                    <li className="flex">
                        <BiUser className="mt-1 mr-2" /> <span>{order.employee.name}</span>
                    </li>
                    <li className="flex">
                        <BiCar className="mt-1 mr-2" /> <span>{deliveryType(order.delivery_type)}</span>
                    </li>
                </ul>
            </div>
        </div>
    );
}
