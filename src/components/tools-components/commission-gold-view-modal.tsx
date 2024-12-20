"use client";
import { Modal } from "flowbite-react";
import { Button, Preset } from "../button/button";
import { useState, useEffect, useContext } from "react";
import toast, { Toaster } from 'react-hot-toast';
import { getData, postData } from "@/services/resources";
import { formatDuiWithAll, getRandomInt, getTotalPercentage, numberToMoney } from "@/utils/functions";
import { Loading } from "../loading/loading";
import { Alert } from "../alert/alert";
import { formatDate, formatDateAsDMY, formatHourAsHM } from "@/utils/date-formats";
import { ButtonDownload } from "../button/button-download";
import { FaDownload } from "react-icons/fa";
import { ConfigContext } from "@/contexts/config-context";



export interface CommissionGoldViewModalProps {
    onClose: () => void;
    isShow: boolean;
    record?: any;
    random?: (value: number) => void;
}

export function CommissionGoldViewModal(props: CommissionGoldViewModalProps) {
    const { onClose, isShow, record, random } = props;
    const [isSending, setIsSending] = useState(false);
    const { systemInformation } = useContext(ConfigContext);
    const [ordersCommission, setOrdersCommission] = useState({} as any);
    const [orderProduct, setOrderProduct] = useState({} as any);

    console.log("ordersCommission: ", ordersCommission)

    const handleGetCommissions = async () => {
        try {
            const active = await getData(`tools/commissions/gold/${record?.id}`);
            if (!active.message) {
                setOrdersCommission(active)
              } 
          } catch (error) {
              console.error(error);
          }
      };
      
      useEffect(() => {
          if (record) {
              (async () => await handleGetCommissions())();
              if (ordersCommission.data) {
                setOrderProduct(ordersCommission.data.length);
              }
          }
          // eslint-disable-next-line
      }, [record]);


    const payReport = async () => {
      try {
        setIsSending(true);
        const response = await postData(`tools/commissions/pay/${record?.id}`, "PUT");
        if (response.type === "successful") {
          toast.success("Orden Guardada!");
          random && random(getRandomInt(100));
          onClose();
        } else {
          toast.error("Error al guardar!");
        }
      } catch (error) {
        console.error(error);
        toast.error("Ha ocurrido un error!");
      } finally {
        setIsSending(false);
      }
    }

    const deleteReport = async () => {
      try {
        setIsSending(true);
        const response = await postData(`tools/commissions/cancel/gold/${record?.id}`, "DELETE");
        if (response.type === "successful") {
          toast.success("Orden Eliminada!");
          random && random(getRandomInt(100));
          onClose();
        } else {
          toast.error("Error al Eliminar!");
        }
      } catch (error) {
        console.error(error);
        toast.error("Ha ocurrido un error!");
      } finally {
        setIsSending(false);
      }
    }

    
    const setType = (status: number): any =>{
        switch (status) {
          case 1: return <span className="status-info">Normal</span>
          case 2: return <span className="status-warning">Puntos Oro</span>
        }
    }
    


    const listItems = ordersCommission.data && ordersCommission.data.map((record: any, key: any) => (
        <tr key={record.id} className="border-b">
          <td className="py-2 px-6 truncate">{ formatDate(record?.initial_date) } { formatHourAsHM(record?.initial_date) }</td>
          <td className="py-2 px-6 truncate">{ formatDate(record?.final_date) } { formatHourAsHM(record?.updated_at) }</td>
          <td className="py-2 px-6">{ setType(record?.type) }</td>
          <td className="py-2 px-6">{ numberToMoney(record?.total ? record?.total : 0, systemInformation) }</td>
          <th className="py-2 px-6">{ numberToMoney(record?.commissions ? record.type == 1 ? record?.commissions : record?.commissions * 0.10 : 0, systemInformation) }</th>
        </tr>
      ));


    return (
        <Modal size="6xl" show={isShow} position="center" onClose={onClose}>
            <Modal.Header>REPORTE DE COMISIONES</Modal.Header>
            <Modal.Body>
                {isSending ? <Loading /> :
                    <div>
                        <div className="flex justify-between font-semibold text-lg m-4">
                            <div>{ record?.referred && record?.referred?.name }</div>
                            <div>{ record?.referred && record?.referred?.document ? formatDuiWithAll(record?.referred?.document) : formatDuiWithAll(record?.referred?.id_number) }</div>
                        </div>
                        <div className="w-full overflow-auto">
                            <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                                <tr>
                                    <th scope="col" className="py-3 px-4 border">Fecha Inicio</th>
                                    <th scope="col" className="py-3 px-4 border">Fecha Fin</th>
                                    <th scope="col" className="py-3 px-4 border">Tipo</th>
                                    <th scope="col" className="py-3 px-4 border">Total</th>
                                    <th scope="col" className="py-3 px-4 border">Comisiones</th>
                                </tr>
                                </thead>
                                <tbody>{listItems}</tbody>
                            </table>
                            {ordersCommission?.data ? (
                                <div className="uppercase border-x-2 m-4 ">
                                    <div>
                                        <div className="py-1 pl-5 border border-b-2 ">Ordenes afectadas: <span className="font-semibold">{record.quantity_commissions}</span></div>
                                        <div className="py-1 pl-5 border border-b-2 ">Total de ventas: <span className="font-semibold">{numberToMoney(record.total, systemInformation)}</span></div>
                                        <div className="py-1 pl-5 border border-b-2 ">Total de Comisión: <span className="font-semibold">{numberToMoney(record.commissions, systemInformation)}</span></div>
                                        <div className="py-1 pl-5 border border-b-2 ">Total de Retenciones: <span className="font-semibold">{numberToMoney(record.commissions.toFixed(2) * 0.10, systemInformation)}</span></div>
                                        <div className="py-1 pl-5 border border-b-2 bg-lime-200">Total a Pagar: <span className="font-semibold">{numberToMoney(record.commissions - (record.commissions * 0.10), systemInformation)}</span></div>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex justify-center">
                                    <Alert text="No se encuentran registros" isDismisible={false} />
                                </div>
                            )}
                        </div>

                        {ordersCommission.data && record.status === 0 && (
                            <div className="mt-4">
                                <span className="mx-2 font-semibold text-red-600 uppercase">ELIMINADO POR:</span>
                                <span className="mx-2 font-semibold text-red-600 uppercase">{record?.employee_deleted?.name}</span>
                                <span className="mx-2 font-bold text-slate-800">{formatDateAsDMY(record?.deleted_at)} {formatHourAsHM(record?.deleted_at)}</span>
                            </div>
                        )}
                    </div>
                }
            </Modal.Body>
            <Modal.Footer className="flex justify-end gap-4">
                {record && record.status === 3 && <ButtonDownload href={`/download/pdf/commission/${record.id}`}><FaDownload size={24} /></ButtonDownload>}
                {record && record.status === 2 && <Button onClick={deleteReport} preset={Preset.cancel} disabled={isSending} text="ELIMINAR REPORTE" />}
                <Button onClick={onClose} preset={Preset.close} disabled={isSending} />
                {record && record.status === 2 && <Button onClick={payReport} preset={isSending ? Preset.saving : Preset.save} disabled={isSending} text="PAGAR REPORTE" />}
            </Modal.Footer>
            <Toaster position="top-right" reverseOrder={false} />
        </Modal>
    );
}
