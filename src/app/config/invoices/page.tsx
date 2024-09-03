"use client"

import { Alert, Loading, ViewTitle } from "@/components"
import { InvoiceSystemTable } from "@/components/config-components/invoice-system-table";
import { ConfigContext } from "@/contexts/config-context";
import { PresetTheme } from "@/services/enums";
import { getData, postData } from "@/services/resources";
import { numberToMoney } from "@/utils/functions";
import Image from "next/image";
import { useContext, useEffect, useState } from "react";


export default function Invoices() {
    const [invoices, setInvoices] = useState([] as any);
    const [isSending, setIsSending] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [payLink, setPayLink] = useState({} as any);
    const { systemInformation } = useContext(ConfigContext);


    const loadInvoices = async () => {
        try {
        setIsLoading(true)
        const response = await getData(`system/invoices?filterWhere[status]==1&filterWhere[tenant_id]==${systemInformation?.system?.tenant?.id}&included=items,tenant&sort=-created_at&perPage=10`);
        setInvoices(response);
        } catch (error) {
        console.error(error);
        } finally {
            setIsLoading(false)
        }
    };
  
    const loadLink = async () => {
        try {
            setIsSending(true)
        const response = await postData(`system/invoices/payments/${invoices?.data?.[0].id}`, 'POST');
        setPayLink(response);
        } catch (error) {
        console.error(error);
        } finally {
            setIsSending(false)
        }
    };

    useEffect(() => {
            (async () => { await loadInvoices();})();   
        // eslint-disable-next-line
    }, [systemInformation]);

    useEffect(() => {
        if (invoices?.data?.[0].id) {
            (async () => { await loadLink();})();   
        }
        // eslint-disable-next-line
    }, [invoices]);

    const imageLoader = ({ src, width, quality }: any) => {
        return `${src}?w=${width}&q=${quality || 75}`
        }

    console.log("payLink: ", payLink)
  return (
    <div className="grid grid-cols-1 md:grid-cols-5 pb-10">
        <div className="col-span-3">
          <ViewTitle text="ULTIMAS FACTURAS" />
            <div className='mr-3 sm:mt-3'>
                <InvoiceSystemTable records={invoices} isLoading={isLoading} />
            </div>
        </div>
        <div className="col-span-2">
        <ViewTitle text="SALDO PENDIENTE" />
            <div className='mr-3 sm:mt-3'>
                <div className="m-3 border-slate-700 shadow-md shadow-lime-700 rounded-md">
                    <div className=" text-center">Saldo pendiente</div>
                    <div className=" text-center font-semibold text-6xl p-3">{ numberToMoney(invoices?.data ? invoices?.data?.[0].total : 0, systemInformation) }</div>
                </div>

                { isSending ? 
                <div className="m-3 border-slate-700 shadow-md shadow-gray-700 rounded-md">
                    <div className=" text-center">Generando Enlace de pago</div>
                    <div className="flex justify-center p-3">
                    <Loading size="sm" text="Cargando" /> 
                    </div>
                </div> : payLink?.urlQrCodeEnlace ?
                <div className="m-3 border-slate-700 shadow-md shadow-lime-700 rounded-md">
                    <div className=" text-center">Pagar con tarjeta de credito</div>
                    <Alert className="m-2" theme={PresetTheme.info} isDismisible={false} text="Transacción completamente segura a traves de Wompi del Banco Agricola, No guardamos ningun tipo de dato de su tarjeta" />
                    <div className="flex justify-center font-semibold text-6xl p-3">
                     <a target="_blank" href={payLink?.urlEnlace ? payLink?.urlEnlace : "#"} className="button-green rounded-md">Pagar factura</a> 
                    </div>
                    <div className=" border-2 "></div>
                    <div className="flex justify-center">
                    <Image loader={imageLoader} src={payLink?.urlQrCodeEnlace && payLink?.urlQrCodeEnlace} alt="QR de pago" width={250} height={250} />
                    </div>
                </div> : 
                <div className="m-3 border-slate-700 shadow-md shadow-gray-700 rounded-md">
                    <div className=" text-center">No existen Facturas pendientes</div>
                </div>
                }
                <div className="m-3 border-slate-700 shadow-md shadow-lime-700 rounded-md">
                    <div className=" text-center">Pagar con Transferencia Electrónica</div>
                    <div className="font-semibold p-3">
                        <div>Banco Promerica</div>
                        <div><span>Numero de Cuenta: </span><span className="ml-2">20000066001071</span></div>
                        <div><span>Nombre: </span><span className="ml-2">Erick Adonai Nuñez Martinez</span></div>
                        <div><span>Concepto: </span><span className="ml-2 uppercase">Factura { systemInformation?.system?.tenant?.id }-{invoices?.data?.[0].id.slice(-4)}</span></div>
                    </div>
                </div>
                


            </div>
        </div>

   </div>
  )
}
