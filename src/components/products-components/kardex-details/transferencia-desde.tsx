"use client";

import { statusOfTransfer } from "@/components/transfers-components/transfers-receive-table";
import { formatDateAsDMY, formatHourAsHM } from "@/utils/date-formats";

export interface TransferenciaDesdeProps {
    request?: any;
}

export function TransferenciaDesde(props: TransferenciaDesdeProps) {
    const { request } = props;

    if (!request?.data) return <></>

    
    return (<div className="w-full">

                <div className="w-full mx-3 shadow-md shadow-amber-500 rounded-md p-4 font-semibold">

                    <div className="mx-3 flex justify-between p-2 font-semibold border-2 border-gray-500">
                        <div className=" w-1/4 border-r-2 border-gray-500">Fecha</div>
                        <div className=" w-3/4 ml-4">{ formatDateAsDMY(request?.data?.created_at) } { formatHourAsHM(request?.data?.created_at) }</div>
                    </div>


                    <div className="mx-3 flex justify-between p-2 font-semibold border-2 border-gray-500">
                        <div className=" w-1/4 border-r-2 border-gray-500">Enviado desde</div>
                        <div className=" w-3/4 ml-4">{ request?.data?.from?.description }</div>
                    </div>


                    <div className="mx-3 flex justify-between p-2 font-semibold border-2 border-gray-500">
                        <div className=" w-1/4 border-r-2 border-gray-500">Envia</div>
                        <div className=" w-3/4 ml-4">{ request?.data?.send }</div>
                    </div>


                    <div className="mx-3 flex justify-between p-2 font-semibold border-2 border-gray-500">
                        <div className=" w-1/4 border-r-2 border-gray-500">Recive</div>
                        <div className=" w-3/4 ml-4">{ request?.data?.receive }</div>
                    </div>


                    <div className="mx-3 flex justify-between p-2 font-semibold border-2 border-gray-500">
                        <div className=" w-1/4 border-r-2 border-gray-500">Estado</div>
                        <div className=" w-3/4 ml-4">{ statusOfTransfer(request?.data?.status) }</div>
                    </div>


                </div>

    </div>);
}
