"use client";
import { useContext, useEffect, useState } from "react";
import { Modal } from "flowbite-react";
import { Button, Preset } from "../button/button";
import { useForm } from "react-hook-form";
import toast, { Toaster } from 'react-hot-toast';
import { postData } from "@/services/resources";
import { style } from "../../theme";
import { documentType, loadData, numberToMoney } from "@/utils/functions";
import { Alert } from "../alert/alert";
import { PresetTheme } from "@/services/enums";
import { formatDateAsDMY } from "@/utils/date-formats";
import { DeleteModal } from "../modals/delete-modal";
import { CredistPaymentsTable } from "./credits-payments-table";
import { ConfigContext } from "@/contexts/config-context";
import { NothingHere } from "../nothing-here/nothing-here";

export enum Type {
    receivable = 1,
    payable = 2,
  }

export interface CreditAddPaymentReceivableModalProps {
  onClose: () => void;
  isShow: boolean;
  accountType: Type;
  creditSelected?: any; 
}

export function CreditAddPaymentReceivableModal(props: CreditAddPaymentReceivableModalProps) {
  const { onClose, isShow, accountType, creditSelected} = props;
  const { register, handleSubmit, reset, watch, setValue } = useForm();
  const [isSending, setIsSending] = useState(false);
  const [message, setMessage] = useState<any>({});
  const [payments, setPayments] = useState([] as any);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const { cashDrawer } = useContext(ConfigContext);


  useEffect(() => {
    if (isShow) {
        (async () => setPayments(await loadData(`credits/payment/${creditSelected?.id}/${accountType}`)))(); 
    }  
    }, [creditSelected, isShow, accountType]);


  const onSubmit = async (data: any) => {
    if (payments?.balance < data.quantity) {
        toast.error("No puede ingresar una cantidad mayor al saldo pendiente");
        return null;
    }
    data.status = 1;
    data.account_type = accountType;
    data.creditSelected = creditSelected.id;
    try {
        setIsSending(true)
        const response = await postData(`credits/payment`, "POST", data);
        if (response.type == "error") {
            toast.error("Faltan algunos datos importantes!");
            setMessage(response);
        } 
        if (response.data) {
            toast.success("Abonos registrado correctamente");
            setPayments(response)
            setMessage({});
            reset()
            setValue('payment_type', 1)
        }
      } catch (error) {
        console.error(error);
        toast.error("Ha ocurrido un error!");
      } finally {
        setIsSending(false)
      }
  };


  const handleDeleteCredit = () => {
    onDeleteCredit(creditSelected.id);
    setShowDeleteModal(false);
  }

  const onDeleteCredit = async(creditId: any)=>{
    try {
        const response = await postData(`credits/payable/${creditId}`, 'DELETE');
        if (response.type == "successful") {
            onClose();
        }
        toast.error(response.message);
      } catch (error) {
        console.error(error);
        toast.error("Ha ocurrido un error!");
      } 
  }

  const onDeletePayment = async(paymentId: any)=>{
    try {
        const response = await postData(`credits/payment/${paymentId.id}`, 'DELETE');
        if (!response.message) {
            setPayments(response)
        } else {
            toast.error(response.message);
        }
      } catch (error) {
        console.error(error);
        toast.error("Ha ocurrido un error!");
      } 
  }

  const handleCheckIn = async() => {
    try {
      setIsSending(true)
      const response = await postData(`credits/checkin`, "POST", creditSelected);
      if (response.type == "error") {
          toast.error("Error al facturar!");
      } 
      if (response.type == "successful") {
        toast.success("Abonos registrado correctamente");
        onClose();
      }
    } catch (error) {
      console.error(error);
      toast.error("Ha ocurrido un error!");
    } finally {
      setIsSending(false)
    }
  }


  return (
    <Modal size="4xl" show={isShow} position="center" onClose={onClose}>
      <Modal.Header>AGREGAR ABONO</Modal.Header>
      <Modal.Body>
        <div className="grid grid-cols-1 md:grid-cols-10 mx-4">
            <div className="col-span-5">
                <div className="flex justify-between mb-6">
                    <div className="mx-4 border-2 border-slate-600 shadow-lg shadow-teal-500 rounded-md w-full">
                        <div className="w-full text-center">Abonos</div>
                        <div className="w-full text-center text-2xl">{ numberToMoney(payments?.total ? payments?.total :0) }</div>
                    </div>
                    <div className="mx-4 border-2 border-slate-600 shadow-lg shadow-red-500 rounded-md w-full">
                        <div className="w-full text-center">Saldo</div>
                        <div className="w-full text-center text-2xl">{numberToMoney(payments?.balance ? payments?.balance : 0)}</div>
                    </div>
                </div>
                <div>
                    {/* Aqui va el formulario */}
              { cashDrawer ? (
              <form onSubmit={handleSubmit(onSubmit)} className="pb-4 mx-3 border-2 shadow-lg rounded-md">
              <div className="flex flex-wrap mx-3 mb-2 ">

              <div className="w-full md:w-full px-3 mb-2">
                    <label htmlFor="payment_type" className={style.inputLabel}> Tipo de pago </label>
                    <select
                          defaultValue={1}
                          id="payment_type"
                          {...register("payment_type", {disabled: payments?.balance == 0 ? true : false})}
                          className={style.input}
                        >
                        <option value="1">Efectivo</option>
                        <option value="2">Tarjeta</option>
                        <option value="3">Transferencia</option>
                        <option value="4">Cheque</option>
                        <option value="6">BTC</option>
                        <option value="0">Otro</option>
                    </select>
                </div>


                <div className="w-full md:w-full px-3 mb-2">
                    <label htmlFor="quantity" className={style.inputLabel}> Cantidad *</label>
                    <input
                          type="number"
                          id="quantity"
                          {...register("quantity", {disabled: payments?.balance == 0 ? true : false})}
                          className={style.input}
                          step="any"
                          min={0}
                        />
                </div>
               
              </div>

              {message.errors && (
                <div className="mb-3">
                  <Alert theme={PresetTheme.danger} info="Error" text={JSON.stringify(message.message)} isDismisible={false} />
                </div>
              )}

              <div className="flex justify-center">
              <Button type="submit" disabled={isSending || payments?.balance == 0} preset={isSending ? Preset.saving : Preset.save} />
              </div>

            </form>) : 
                <>
                <Alert
                theme={PresetTheme.danger}
                info="Error"
                text="Debe seleccionar una caja para este proceso"
                isDismisible={false}
                />
                <NothingHere text="" width="110" height="110" />
                </>}
                    {/* Termina formulario  */}
                </div>
            </div>
            <div className="col-span-5 ">

                    <div className="w-full flex justify-center  mb-6">
                        <div className="w-1/2 mx-4 border-2 border-slate-600 shadow-lg shadow-lime-500 rounded-md">
                            <div className="text-center">Total</div>
                            <div className="text-center text-2xl">{ numberToMoney(creditSelected?.order?.total ? creditSelected?.order?.total : 0) }</div>
                        </div>
                    </div>
               <div className="pb-4 mx-3 border-2 shadow-lg rounded-md"> 

                    <div className="ml-3 text-xl mt-2 font-semibold ">Cliente { creditSelected?.client?.name }</div>
                    <div className="ml-3 text-sm">Documento: { creditSelected?.order?.invoice_assigned?.name } | Numero: { creditSelected?.order?.invoice }</div>
                    <div className="ml-3 text-lg mt-1">Total Productos: { creditSelected?.order?.products.length }</div>
                    <div className="ml-3 text-lg mt-1">Usuario: { creditSelected?.employee?.name}</div>
                    <div className="ml-3 text-lg mt-1">Asignado: { formatDateAsDMY(creditSelected?.created_at) }</div>
                    <div className="ml-3 text-lg mt-1">Expira: { formatDateAsDMY(creditSelected?.expiration) }</div>
               </div>
            </div>
        </div>
            {payments?.data &&
            <div className="mt-3">
                <CredistPaymentsTable records={payments} onDelete={onDeletePayment}  isDisabled={!cashDrawer} />
            </div>}

          <DeleteModal isShow={showDeleteModal} text="¿Estas seguro de eliminar este elemento?" onDelete={handleDeleteCredit}  onClose={()=>setShowDeleteModal(false)} /> 
      <Toaster position="top-right" reverseOrder={false} />
      </Modal.Body>
      <Modal.Footer className="flex justify-end gap-4">
        {
          payments?.balance == 0 && creditSelected?.order?.status == 5 && 
          <Button onClick={handleCheckIn} preset={isSending ? Preset.saving : Preset.save} text="Facturar Credito" disabled={isSending} />
        }
        <Button onClick={onClose} preset={Preset.close} disabled={isSending} />
      </Modal.Footer>
    </Modal>
  );
}
