"use client";

import { formatDateAsDMY, formatHourAsHM } from "@/utils/date-formats";
import { numberToMoney } from "@/utils/functions";

export interface InventarioInicialProps {
    request?: any;
}

export function InventarioInicial(props: InventarioInicialProps) {
    const { request } = props;

    if (!request?.data) return <></>

    
    return (<div className="w-full">
                <div className="w-full mx-3 flex justify-between shadow-md shadow-lime-600 rounded-md m-4 p-4 font-semibold">
                    <div>Producto: { request?.data?.product?.cod } | { request?.data?.product?.description }</div>
                </div>


                <div className="w-full mx-3 shadow-md shadow-amber-500 rounded-md p-4 font-semibold">

                    <div className="mx-3 flex justify-between p-2 font-semibold border-2 border-gray-500">
                        <div className=" w-1/4 border-r-2 border-gray-500">Ingreso</div>
                        <div className=" w-3/4 ml-4">{ formatDateAsDMY(request?.data?.created_at) } { formatHourAsHM(request?.data?.created_at) }</div>
                    </div>

                    <div className="mx-3 flex justify-between p-2 font-semibold border-2 border-gray-500">
                        <div className=" w-1/4 border-r-2 border-gray-500">Ingresado por:</div>
                        <div className=" w-3/4 ml-4">{ request?.data?.employee?.name }</div>
                    </div>

                    <div className="mx-3 flex justify-between p-2 font-semibold border-2 border-gray-500">
                        <div className=" w-1/4 border-r-2 border-gray-500">Proveedor</div>
                        <div className=" w-3/4 ml-4">{ request?.data?.provider?.name }</div>
                    </div>


                    <div className="mx-3 flex justify-between p-2 font-semibold border-2 border-gray-500">
                        <div className=" w-1/4 border-r-2 border-gray-500">Cantidad</div>
                        <div className=" w-3/4 ml-4">{ request?.data?.quantity }</div>
                    </div>

                    
                    <div className="mx-3 flex justify-between p-2 font-semibold border-2 border-gray-500">
                        <div className=" w-1/4 border-r-2 border-gray-500">Precio Compra</div>
                        <div className=" w-3/4 ml-4">{ numberToMoney(request?.data?.unit_cost) }</div>
                    </div>

                    
                    <div className="mx-3 flex justify-between p-2 font-semibold border-2 border-gray-500">
                        <div className=" w-1/4 border-r-2 border-gray-500">Precio Venta</div>
                        <div className=" w-3/4 ml-4">{ numberToMoney(request?.data?.sale_price) }</div>
                    </div>


                </div>

    
    </div>);
}
