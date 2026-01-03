import { useRelativeTime } from '@/hooks/useRelativeTime';
import { formatDate, formatHourAsHM } from '@/utils/date-formats';
import { deliveryType, filterProductsOrInvoiceProducts } from '@/utils/functions';
import React, { Fragment } from 'react';
import { BiCar, BiRestaurant, BiCheckDouble, BiUser } from 'react-icons/bi';
import { FaClock } from 'react-icons/fa';
import { TbPointFilled } from 'react-icons/tb';

export interface ScreenCardProps {
    order: any;
    processData: (values: {})=> void
}

export function ScreenCard(props: ScreenCardProps) {
    const { order, processData } = props;

    const filteredResult = filterProductsOrInvoiceProducts(order);
    const time = useRelativeTime(order.created_at);

    return (
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
            <div className="py-2 px-3 flex flex-row cursor-pointer" onClick={()=>processData({order: order?.id,
                                                    status: 2,
                                                    url: "screen/order/process"})}>
                <div className="w-full">
                    <div className="w-full text-xl font-bold flex justify-between items-center">
                        <div className="w-1/2">Orden # {order.number}</div>
                        {order.status == 6 && (
                        <span className="text-xs px-2 py-1 rounded-full bg-red-100 text-red-700">
                            ELIMINADA
                        </span>
                    )}
                    </div>
                    <div className="w-full text-xl font-bold flex justify-around">
                        <div className="w-full">{order.order_type == 2 ? order.table?.name : order.client?.name}</div>
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
                    {filteredResult.map((product: any) => {
                        return (<Fragment key={product.id}>
                            <tr  className="bg-slate-100 border-y-2 border-slate-600 clickeable" 
                               onClick={()=>processData({order: order?.id,
                                                        product: product.id,
                                                        status: 2,
                                                        url: "screen/product/process"})}>
                                <td className="font-medium h-9 flex p-2 uppercase">
                                    <BiCheckDouble size={20} color="green" className="mx-2" /> {product.product}
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

            <div className="bg-gray-800 text-white text-center py-3">
                <ul className="list-none flex justify-around space-x-4">
                    <li className="flex">
                        <BiUser className="mt-1 mr-2" /> <span>{order.employee.name}</span>
                    </li>
                    <li className="flex">
                        { order.delivery_type == 1 ? <BiRestaurant className="mt-1 mr-2" /> : <BiCar className="mt-1 mr-2" />}
                        <span>{deliveryType(order.delivery_type)}</span>
                    </li>
                </ul>
            </div>
        </div>
    );
}
