"use client";

import { formatDateAsDMY, formatHourAsHM } from "@/utils/date-formats";

export interface AjusteInventarioProps {
    request?: any;
}

export function AjusteInventario(props: AjusteInventarioProps) {
    const { request } = props;

    if (!request?.data) return <></>

    
    return (<div className="w-full">
                <div className="w-full mx-3 flex justify-between shadow-md shadow-lime-600 rounded-md m-4 p-4 font-semibold">
                    <div>Producto: { request?.data?.product?.cod } | { request?.data?.product?.description }</div>
                </div>

                <div className="w-full mx-3 shadow-md shadow-amber-500 rounded-md p-4 font-semibold">

                    <div className="mx-3 flex justify-between p-2 font-semibold border-2 border-gray-500">
                        <div className=" w-1/4 border-r-2 border-gray-500">Inicio</div>
                        <div className=" w-3/4 ml-4">{ formatDateAsDMY(request?.data?.adjustment?.initial_date) } { formatHourAsHM(request?.data?.adjustment?.initial_date) }</div>
                    </div>

                    <div className="mx-3 flex justify-between p-2 font-semibold border-2 border-gray-500">
                        <div className=" w-1/4 border-r-2 border-gray-500">Finalizado</div>
                        <div className=" w-3/4 ml-4">{ formatDateAsDMY(request?.data?.adjustment?.final_date) } { formatHourAsHM(request?.data?.adjustment?.final_date) }</div>
                    </div>

                    <div className="mx-3 flex justify-between p-2 font-semibold border-2 border-gray-500">
                        <div className=" w-1/4 border-r-2 border-gray-500">Estado</div>
                        <div className=" w-3/4 ml-4">{ request?.data?.adjustment?.status == 1 ? "Activo" : "Finalizado" }</div>
                    </div>


                    <div className="mx-3 flex justify-between p-2 font-semibold border-2 border-gray-500">
                        <div className=" w-1/4 border-r-2 border-gray-500">Cantidad</div>
                        <div className=" w-3/4 ml-4">{ request?.data?.quantity }</div>
                    </div>


                    <div className="mx-3 flex justify-between p-2 font-semibold border-2 border-gray-500">
                        <div className=" w-1/4 border-r-2 border-gray-500">Establecido</div>
                        <div className=" w-3/4 ml-4">{ request?.data?.stablished }</div>
                    </div>


                    <div className="mx-3 flex justify-between p-2 font-semibold border-2 border-gray-500">
                        <div className=" w-1/4 border-r-2 border-gray-500">Diferencia</div>
                        <div className=" w-3/4 ml-4">{ request?.data?.difference }</div>
                    </div>


                </div>

    </div>);
}
