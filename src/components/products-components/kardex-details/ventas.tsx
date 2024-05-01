"use client";

import { PaymentType } from "@/services/enums";
import { formatDateAsDMY, formatHourAsHM } from "@/utils/date-formats";
import { getPaymentTypeName, numberToMoney } from "@/utils/functions";

export interface VentasProps {
    request?: any;
}

export function Ventas(props: VentasProps) {
    const { request } = props;

    if (!request?.data) return <></>

    
    return (<div className="w-full">

                <div className="w-full mx-3 shadow-md shadow-amber-500 rounded-md p-4 font-semibold">

                    <div className="mx-3 flex justify-between p-2 font-semibold border-2 border-gray-500">
                        <div className=" w-1/4 border-r-2 border-gray-500">Fecha</div>
                        <div className=" w-3/4 ml-4">{ formatDateAsDMY(request?.data?.charged_at) } { formatHourAsHM(request?.data?.charged_at) }</div>
                    </div>

                    <div className="mx-3 flex justify-between p-2 font-semibold border-2 border-gray-500">
                        <div className=" w-1/4 border-r-2 border-gray-500">Documento</div>
                        <div className=" w-3/4 ml-4">{ request?.data?.invoice_assigned?.name } # { request?.data?.invoice }</div>
                    </div>


                    <div className="mx-3 flex justify-between p-2 font-semibold border-2 border-gray-500">
                        <div className=" w-1/4 border-r-2 border-gray-500">Orden Numero</div>
                        <div className=" w-3/4 ml-4">{ request?.data?.number }</div>
                    </div>


                    <div className="mx-3 flex justify-between p-2 font-semibold border-2 border-gray-500">
                        <div className=" w-1/4 border-r-2 border-gray-500">Cajero</div>
                        <div className=" w-3/4 ml-4">{ request?.data?.casheir?.name }</div>
                    </div>


                    <div className="mx-3 flex justify-between p-2 font-semibold border-2 border-gray-500">
                        <div className=" w-1/4 border-r-2 border-gray-500">Cliente</div>
                        <div className=" w-3/4 ml-4">{ request?.data?.client?.name ? request?.data?.client?.name : "N/A" }</div>
                    </div>

                    <div className="mx-3 flex justify-between p-2 font-semibold border-2 border-gray-500">
                        <div className=" w-1/4 border-r-2 border-gray-500">Tipo Pago</div>
                        <div className=" w-3/4 ml-4">{ getPaymentTypeName(request?.data?.payment_type) }</div>
                    </div>

                    <div className="mx-3 flex justify-between p-2 font-semibold border-2 border-gray-500">
                        <div className=" w-1/4 border-r-2 border-gray-500">Total</div>
                        <div className=" w-3/4 ml-4">{ numberToMoney(request?.data?.total) }</div>
                    </div>

                </div>

    </div>);
}
