"use client";
import { Modal } from "flowbite-react";
import { Button, Preset } from "../button/button";
import { formatDate, formatTime } from "@/utils/date-formats";
import { numberToMoney } from "@/utils/functions";
import { ButtonDownload } from "../button/button-download";
import { FaDownload } from "react-icons/fa";

export interface CutDetailsModalProps {
  onClose: () => void;
  isShow?: boolean;
  record?: any;
}

export function CutDetailsModal(props: CutDetailsModalProps) {
    const { onClose, isShow, record } = props;

    const setStatus =(status: number)=>{
      switch (status) {
        case 0: return "Eliminado";
        case 1: return "Abierto";
        case 2: return "Cerrado";
      }
    }


  return (
    <Modal size="xl" show={isShow} position="center" onClose={onClose}>
      {/* <Modal.Header>DETALLES DEL CORTE</Modal.Header> */}
      <Modal.Body>
        <div className="mx-4">
          <div>
              <div className=" font-semibold text-xl text-center">Cajero {record?.employee?.name}</div>
              <div className=" font-semibold text-xl text-center uppercase">{record?.cashdrawer?.name}</div>
              <div className="mt-2 rounded-md border-2 border-lime-600 font-semibold text-xl text-center text-lime-600 uppercase">
                { setStatus(record?.status) }
                </div>
              <div className="flex justify-between text-sm">
                <div>Apertura: { formatDate(record?.opening)} | {formatTime(record?.opening)}</div>
                <div>Cierre: { formatDate(record?.close)} | {formatTime(record?.close)}</div>
              </div>
          </div>
          <div className="flex justify-between mt-3 rounded-md border-2 border-cyan-600 font-semibold text-xl text-center text-cyan-600 uppercase">
            <span className="mx-3">Efectivo inicial</span><span className="mx-3">{ numberToMoney(record?.inicial_cash ? record?.inicial_cash : 0)}</span>
          </div>
          <div className=" border-2 shadow-lg mt-2 rounded-lg">
            <div className="mx-3 flex justify-between py-1 border-b-2 border-cyan-500">
              <span>Ventas Efectivo</span><span>{ numberToMoney(record?.sales_cash ? record?.sales_cash : 0) }</span>
            </div>
            <div className="mx-3 flex justify-between  border-y-2 border-cyan-500">
              <span>Total ventas</span><span>{ numberToMoney(record?.sales_total ? record?.sales_total : 0) }</span>
            </div>
            <div className="mx-3 flex justify-between  border-y-2 border-cyan-500">
              <span>Gastos Efectivo</span><span>{ numberToMoney(record?.bills_cash ? record?.bills_cash : 0) }</span>
            </div>
            <div className="mx-3 flex justify-between  border-y-2 border-cyan-500">
              <span>Total Gastos</span><span>{ numberToMoney(record?.bills_total ? record?.bills_total : 0) }</span>
            </div>
            <div className="mx-3 flex justify-between  border-y-2 border-cyan-500">
              <span>Remesas</span><span>{ numberToMoney(record?.remittances ? record?.remittances : 0) }</span>
            </div>
            <div className="mx-3 flex justify-between  border-y-2 border-cyan-500">
              <span>Cuentas por pagar Efectivo</span><span>{ numberToMoney(record?.payments_payable_cash ? record?.payments_payable_cash : 0) }</span>
            </div>
            <div className="mx-3 flex justify-between  border-t-2 border-cyan-500">
              <span>Total Cuentas por pagar </span><span>{ numberToMoney(record?.payments_payable_total ? record?.payments_payable_total : 0) }</span>
            </div>
            <div className="mx-3 flex justify-between  border-y-2 border-cyan-500">
              <span>Cuentas por cobrar Efectivo</span><span>{ numberToMoney(record?.payments_receivable_cash ? record?.payments_receivable_cash : 0) }</span>
            </div>
            <div className="mx-3 flex justify-between  border-t-2 border-cyan-500">
              <span>Total Cuentas por cobrar </span><span>{ numberToMoney(record?.payments_receivable_total ? record?.payments_receivable_total : 0) }</span>
            </div>
            <div className="mx-3 flex justify-between  border-y-2 border-cyan-500">
              <span>Retenciones Efectivo</span><span>{ numberToMoney(record?.sales_cash_retention ? record?.sales_cash_retention : 0) }</span>
            </div>
            <div className="mx-3 flex justify-between  border-t-2 border-cyan-500">
              <span>Total Retenciones </span><span>{ numberToMoney(record?.sales_total_retention ? record?.sales_total_retention : 0) }</span>
            </div>
          </div>
          <div className="flex justify-between mt-3 rounded-md border-2 border-cyan-600 font-semibold text-xl text-center text-cyan-600 uppercase">
            <span className="mx-3">Efectivo de cierre</span><span className="mx-3">{ numberToMoney(record?.final_cash ? record?.final_cash : 0)}</span>
          </div>
          <div className="flex justify-between mt-3 rounded-md border-2 border-red-600 font-semibold text-xl text-center text-red-600 uppercase">
            <span className="mx-3">Efectivo Diferencia</span><span className="mx-3">{ numberToMoney(record?.cash_diference ? record?.cash_diference : 0)}</span>
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer className="flex justify-end gap-4">
        {/* <Button onClick={()=>{}} preset={Preset.accept} /> */}
        <ButtonDownload href={`/download/pdf/cut/${record.id}`}><FaDownload  size={24}/></ButtonDownload>
        <Button onClick={onClose} preset={Preset.close} />
      </Modal.Footer>
    </Modal>
  );

}
