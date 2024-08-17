"use client";
import { Button, Preset } from "@/components/button/button";
import { Loading } from "@/components/loading/loading";
import { nameOfPaymentType } from "@/components/sales-components/sales-pay-modal";
import { numberToMoney } from "@/utils/functions";
import { Modal } from "flowbite-react";
import { ConfigContext } from "@/contexts/config-context";
import { useContext } from "react";



export interface PayFinishMModalProps {
  onClose: () => void;
  invoice?: any;
  isShow?: boolean;
  isSending?: boolean;
}

export function PayFinishMModal(props: PayFinishMModalProps) {
  const { onClose, invoice, isShow, isSending } = props;
  const { systemInformation } = useContext(ConfigContext);


  return (
    <Modal show={isShow} position="center" onClose={onClose} size="md">
      <Modal.Body>
        <div className="mx-4">
              <div onClick={onClose} className='cursor-pointer'>
              <div className="w-full my-4">
                { invoice?.invoice_assigned?.type != 8 &&
                <div  className='flex justify-between  border-y-4'>
                  <div><span className="flex justify-center">Descuentos</span> <span className="flex justify-center">{numberToMoney(invoice?.discount, systemInformation)}</span></div>
                  <div><span className="flex justify-center">Impuestos</span> <span className="flex justify-center">{numberToMoney(invoice?.taxes, systemInformation)}</span></div>
                  <div><span className="flex justify-center">Sub Total</span> <span className="flex justify-center">{numberToMoney(invoice?.subtotal, systemInformation)}</span></div>
                </div>
                }
                { isSending ? <Loading text="Procesando..." /> :
                <div>
                    <div className="flex justify-center mt-4">TOTAL</div>
                    <div className="flex justify-center text-7xl mb-4 font-bold">{numberToMoney(invoice?.total - invoice?.retention, systemInformation)}</div>
                    { invoice?.payment_type === 1 && invoice?.invoice_assigned?.type != 8 ? <>
                    <div className="flex justify-center">CAMBIO</div>
                    <div className="flex justify-center text-7xl mb-4 text-red-600 font-bold">{numberToMoney(invoice?.change, systemInformation)}
                    </div></> : 
                    <div className='flex justify-center text-lg font-semibold uppercase text-blue-600'>
                      { invoice?.payment_type === 5 ? 
                      <span>Credito Otorgado correctamente</span> : invoice?.invoice_assigned?.type == 8 ? <span>Nota de envío realizada</span> :
                      <span>Pago realizado con {nameOfPaymentType(invoice?.payment_type)}</span> }
                    </div>}
                </div>
                  }
              </div>
            </div>
        </div>
      </Modal.Body>
      <Modal.Footer className="flex justify-end">
        <Button onClick={onClose} preset={Preset.close} isFull disabled={isSending} /> 
      </Modal.Footer>
    </Modal>
  );
}
