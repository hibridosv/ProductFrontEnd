"use client"

import { Alert, Loading, ViewTitle } from "@/components"
import { InvoiceSystemTable } from "@/components/config-components/invoice-system-table";
import { ConfigContext } from "@/contexts/config-context";
import useReverb from "@/hooks/useReverb";
import { PresetTheme } from "@/services/enums";
import { getData, postData } from "@/services/resources";
import { getLastElement, sumarTotalesStatus } from "@/utils/functions";
import Image from "next/image";
import { useContext, useEffect, useState } from "react";


export default function Invoices() {
    const [invoices, setInvoices] = useState([] as any);
    const [isSending, setIsSending] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [payLink, setPayLink] = useState({} as any);
    const [lastInvoice, setLastInvoice] = useState({}) as any;
    const { systemInformation } = useContext(ConfigContext);
    const total = sumarTotalesStatus(invoices?.data)
    let pusherEvent = useReverb(`${systemInformation?.system?.tenant?.id}-channel-pay`, 'PusherPayInvoiceEvent', true).random;
    
    
    const loadInvoices = async () => {
        try {
            setIsLoading(true)
            const response = await getData(`system/invoices?filterWhere[tenant_id]==${systemInformation?.system?.tenant?.id}&included=items.payment,tenant&sort=-created_at&perPage=10`);
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
        const response = await postData(`system/invoices/payments/${lastInvoice?.id}`, 'POST');
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
    }, [systemInformation, pusherEvent]);

    useEffect(() => {
        if (invoices) {
            setLastInvoice(getLastElement(invoices?.data));
        }
        // eslint-disable-next-line
    }, [invoices]);

    useEffect(() => {
        if (lastInvoice?.id && total > 0) {
            (async () => { await loadLink();})();   
        }
        // eslint-disable-next-line
    }, [lastInvoice, total]);

    const imageLoader = ({ src, width, quality }: any) => {
        return `${src}?w=${width}&q=${quality || 75}`
    }

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
                    <div className=" text-center font-semibold text-6xl p-3">$ { total.toFixed(2) }</div>
                </div>

                { isSending ? 
                <div className="m-3 border-slate-700 shadow-md shadow-gray-700 rounded-md">
                    <div className=" text-center">Generando Enlace de pago</div>
                    <div className="flex justify-center p-3">
                    <Loading size="sm" text="Cargando" /> 
                    </div>
                </div> : payLink?.urlQrCodeEnlace && total > 0 &&
                <div className="m-3 border-slate-700 shadow-md shadow-lime-700 rounded-md">
                    <div className=" text-center bg-slate-300 font-semibold rounded-t-md uppercase">Pagar con tarjeta de credito</div>
                    <Alert className="m-2" theme={PresetTheme.info} isDismisible={false} text="Transacción segura a traves de Wompi del Banco Agricola, No guardamos ningun tipo de dato de su tarjeta" />
                    <div className="flex justify-center font-semibold text-6xl p-3">
                     <a target="_blank" href={payLink?.urlEnlace ? payLink?.urlEnlace : "#"} className="button-green rounded-md">Pagar factura</a> 
                    </div>
                    <div className=" border-2 "></div>
                    <div className="flex justify-center">
                        {payLink?.urlQrCodeEnlace &&
                            <Image loader={imageLoader} src={payLink?.urlQrCodeEnlace} alt="QR de pago" width={250} height={250} />
                        }
                    </div>
                </div>
                }
                { total > 0 ? 
                <div className="m-3 border-slate-700 shadow-md shadow-lime-700 rounded-md">
                    <div className=" text-center bg-slate-300 font-semibold rounded-t-md uppercase">Pagar con Transferencia Electrónica</div>
                    <div className="font-semibold p-3">
                        <Image loader={imageLoader} src="https://digital.promerica.com.sv/promerica//assets/img/logo-promerica.png" alt="QR de pago" width={375} height={57} />
                        <div><span>Numero de Cuenta: </span><span className="ml-2">20000066001071</span></div>
                        <div><span>Nombre: </span><span className="ml-2">Erick Adonai Nuñez Martinez</span></div>
                        <div><span>Concepto: </span><span className="ml-2 uppercase">Factura { systemInformation?.system?.tenant?.id }-{lastInvoice?.id.slice(-4)}</span></div>
                        <div><span className="text-xs text-red-700">Es importante incluya el concepto en la Transferencia para identificar su factura</span></div>
                    </div>
                </div> :
                <div className="m-3 border-slate-700 shadow-md shadow-lime-700 rounded-md">
                <div className=" text-center bg-slate-300 font-semibold rounded-t-md uppercase">Gracias por mantenerse al dia con sus facturas</div>
                <div className="font-semibold p-3 text-center">
                    <div>Si tiene alguna duda no dude en contactarnos</div>
                </div>
            </div>
                }
                


            </div>
        </div>

   </div>
  )
}
