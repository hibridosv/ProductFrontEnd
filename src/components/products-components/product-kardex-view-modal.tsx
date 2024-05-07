"use client";
import { Modal } from "flowbite-react";
import { Button, Preset } from "../button/button";
import { NothingHere } from "../nothing-here/nothing-here";
import { useEffect, useState } from "react";
import { getData } from "@/services/resources";
import { Loading } from "../loading/loading";
import { InventarioInicial } from "./kardex-details/inventario-inicial";
import { Ventas } from "./kardex-details/ventas";
import { IngresoProducto } from "./kardex-details/ingreso-producto";
import { AjusteInventario } from "./kardex-details/ajuste-inventario";
import { RegistroAverias } from "./kardex-details/registro-averias";
import { RetornoInventario } from "./kardex-details/retorno-inventario";
import { TransferenciaDesde } from "./kardex-details/transferencia-desde";
import { TransferenciaA } from "./kardex-details/transferencia-a";



export interface ProductKardexViewModalProps {
    onClose: () => void;
    isShow: boolean;
    record?: any;
}

export function ProductKardexViewModal(props: ProductKardexViewModalProps) {
    const { onClose, isShow, record } = props;
    const [isLoading, setIsLoading] = useState(false);
    const [request, setRequest] = useState([] as any);

    const loadRequest = async () => {
        setIsLoading(true);
        try {
          const response = await getData(`kardex/${record.id}`);
          setRequest(response);
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };
    
    useEffect(() => {
        if (record.identification && isShow) {
            (async () => { await loadRequest() })();
        }
        // eslint-disable-next-line
    }, [record, isShow]);


    const getTemplate = (description: string) => {
        if (!request) return;
        switch (description) {
            case 'Ventas':                          return <Ventas request={request} />;
            case 'Ingreso de producto':             return <IngresoProducto request={request} />;
            case 'Ajuste de inventario':            return <AjusteInventario request={request} />;
            case 'Registro de averias':             return <RegistroAverias request={request} />;
            case 'Registro de translados':          return <RegistroAverias request={request} />;
            case 'Registro de devoluciones':        return <RegistroAverias request={request} />;
            case 'Registro de cambios':             return <RegistroAverias request={request} />;
            case 'Inventario Inicial':              return <InventarioInicial request={request} />;
            case 'Retorno de inventario':           return <RetornoInventario request={request} />;
            case 'Transferencia desde sucursal':    return <TransferenciaDesde request={request} />;
            case 'Transferencia a sucursal':        return <TransferenciaA request={request} />;
            default:                                return <></>;
        }
    }

  return (
    <Modal size="2xl" show={isShow} position="center" onClose={onClose}>
      <Modal.Header>DETALLES DE LA TRANSACCION</Modal.Header>
      <Modal.Body>
          <div>
            {
            request && request?.type == "error" ? <NothingHere text="No se encuentran registros de esta transacción" /> :
            <div>
                {
                isLoading ? <Loading /> :
                <div>
                    <div className="text-center uppercase font-semibold">{record?.description}</div>
                    <div>
                        { getTemplate(record?.description) }
                    </div>
                </div>
                }
            </div>
            }

          </div>
      </Modal.Body>
      <Modal.Footer className="flex justify-end gap-4">
        <Button onClick={onClose} preset={Preset.close} />
      </Modal.Footer>
    </Modal>
  );
}
