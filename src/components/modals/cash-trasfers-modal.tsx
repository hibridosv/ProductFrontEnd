"use client";
import { useState } from "react";
import { Modal } from "flowbite-react";
import { Button, Preset } from "../button/button";
import { useForm } from "react-hook-form";
import toast, { Toaster } from 'react-hot-toast';

import { Account } from "@/services/Bills";
import { style } from "@/theme";
import { PresetTheme } from "@/services/enums";
import { Alert } from "../alert/alert";
import { postData } from "@/services/resources";

export interface CashTransferModalProps {
  onClose: () => void;
  accounts?: any;
  isShow: boolean;
}



export function CashTransferModal(props: CashTransferModalProps) {
  const { onClose, accounts, isShow } = props;
  const { register, handleSubmit, reset, setFocus } = useForm();
  const [isSending, setIsSending] = useState(false);
  const [message, setMessage] = useState<any>({});



  const onSubmit = async (data: any) => {
    data.status = 1;
    if (data.from_cash_accounts_id == data.to_cash_accounts_id) {
        toast.error("No puede tranferir a la misma cuenta");
        return 
    }
    if (data.quantity <= 0) {
        toast.error("La cantidad debe ser mayor a cero");
        return 
    }
    try {
      setIsSending(true)
      const response = await postData(`cash/accounts/transfer`, "POST", data);
      if (response.type == "successful") {
        toast.success("Tranferencia realizada correctamente");
        setMessage({});
        reset()
        onClose()
      } else {
          toast.error("Faltan algunos datos importantes!");
          setMessage(response);
      }
      console.log(response)
    } catch (error) {
      console.error(error);
      toast.error("Ha ocurrido un error!");
    } finally {
      setIsSending(false)
    }
  }


  return (
    <Modal show={isShow} position="center" onClose={onClose} size="md">
      <Modal.Body>
        <div className="mx-4">
        <form onSubmit={handleSubmit(onSubmit)} className="w-full">
              <div className="flex flex-wrap -mx-3 mb-6">

              <div className="w-full md:w-full px-3 mb-2">
                    <label htmlFor="from_cash_accounts_id" className={style.inputLabel}> Cuenta origen </label>
                    <select
                          id="from_cash_accounts_id"
                          {...register("from_cash_accounts_id")}
                          className={style.input}
                        >
                            <option  value={0}> Selecccione...</option>
                        {accounts?.data?.map((value: any) => {
                          return (
                            <option key={value.id} value={value.id}> {value.account}{" | "}{value.bank}{" | $"}{value.balance}</option>
                          );
                        })}
                    </select>
                </div> 

                <div className="w-full md:w-full px-3 mb-2">
                    <label htmlFor="to_cash_accounts_id" className={style.inputLabel}> Cuenta destino </label>
                    <select
                          id="to_cash_accounts_id"
                          {...register("to_cash_accounts_id")}
                          className={style.input}
                        >
                            <option  value={0}> Selecccione...</option>
                        {accounts?.data?.map((value: any) => {
                          return (
                            <option key={value.id} value={value.id}> {value.account}{" | "}{value.bank}{" | $"}{value.balance}</option>
                          );
                        })}
                    </select>
                </div> 


                <div className="w-full md:w-full px-3 mb-2">
                    <label htmlFor="quantity" className={style.inputLabel}> Cantidad Inicial *</label>
                    <input
                          type="number"
                          id="quantity"
                          {...register("quantity")}
                          className={style.input}
                          step="any"
                          min={0}
                        />
                </div>
               
              </div>

              {message.errors && (
                <div className="mb-4">
                  <Alert
                    theme={PresetTheme.danger}
                    info="Error"
                    text={JSON.stringify(message.message)}
                    isDismisible={false}
                  />
                </div>
              )}

              <div className="flex justify-center">
              <Button type="submit" disabled={isSending} preset={isSending ? Preset.saving : Preset.save} />
              </div>

            </form>
        </div>
      <Toaster position="top-right" reverseOrder={false} />
      </Modal.Body>
      <Modal.Footer className="flex justify-end">
        <Button onClick={onClose} preset={Preset.close} isFull />
      </Modal.Footer>
    </Modal>
  );
}
