"use client";
import { useEffect, useState } from "react";
import { Modal } from "flowbite-react";
import { Button, Preset } from "../button/button";
import { useForm } from "react-hook-form";
import toast, { Toaster } from 'react-hot-toast';

import { postData } from "@/services/resources";
import { style } from "../../theme";
import { Contacts } from "@/services/Contacts";
import { loadData } from "@/utils/functions";
import { Alert } from "../alert/alert";
import { PresetTheme } from "@/services/enums";

export interface CreditAddPayableModalProps {
  onClose: () => void;
  isShow: boolean;
}

export function CreditAddPayableModal(props: CreditAddPayableModalProps) {
  const { onClose, isShow} = props;
  const { register, handleSubmit, reset, watch } = useForm();
  const [isSending, setIsSending] = useState(false);
  const [message, setMessage] = useState<any>({});
  const [providers, setProviders] = useState<Contacts>([] as Contacts);

  useEffect(() => {
    if (isShow) {
        (async () => setProviders(await loadData(`contacts/providers`)))();  
    }
}, [isShow]);

  const onSubmit = async (data: any) => {
    data.status = 1;
    data.balance = data.quantity;
    data.invoice_number = data.invoice == 0 ? 0 : data.invoice_number;
    try {
      setIsSending(true)
      const response = await postData(`credits/payable`, "POST", data);
      if (response.type == "successful") {
        toast.success("Orden registrada correctamente");
        setMessage({});
        reset()
        onClose()
      } else {
        toast.error("Faltan algunos datos importantes!");
        setMessage(response);
      }
    } catch (error) {
      console.error(error);
      toast.error("Ha ocurrido un error!");
    } finally {
      setIsSending(false)
    }
  };


  return (
    <Modal size="lg" show={isShow} position="center" onClose={onClose}>
      <Modal.Header>AGREGAR CUENTA POR PAGAR</Modal.Header>
      <Modal.Body>
        <div className="mx-4">

        <form onSubmit={handleSubmit(onSubmit)} className="w-full">
              <div className="flex flex-wrap -mx-3 mb-6">

              <div className="w-full md:w-full px-3 mb-2">
                    <label htmlFor="provider_id" className={style.inputLabel}> Proveedor </label>
                    <select
                          defaultValue={providers && providers.data && providers.data.length > 0 ? providers.data[0].id : 0}
                          id="provider_id"
                          {...register("provider_id")}
                          className={style.input}
                        >
                        {providers?.data?.map((value: any) => {
                          return (
                            <option key={value.id} value={value.id}> {value.name}</option>
                          );
                        })}
                    </select>
                </div>


              <div className="w-full md:w-full px-3 mb-2">
                    <label htmlFor="name" className={style.inputLabel}>Nombre de la cuenta *</label>
                    <input
                          type="text"
                          id="name"
                          {...register("name")}
                          className={style.input}
                          step="any"
                          min={0}
                        />
                </div>

                <div className="w-full md:w-full px-3 mb-2">
                  <label htmlFor="description" className={style.inputLabel}> Descripción{" "} </label>
                  <textarea
                    {...register("description")}
                    rows={2}
                    className={`${style.input} w-full`}
                  />
                </div>


                <div className="w-full md:w-1/2 px-3 mb-2">
                    <label htmlFor="invoice" className={style.inputLabel}> Tipo de Documento </label>
                    <select
                          id="invoice"
                          {...register("invoice")}
                          className={style.input} >
                        <option value="0">Ninguno</option>
                        <option value="1">Ticket</option>
                        <option value="2">Factura</option>
                        <option value="3">Credito Fiscal</option>
                    </select>
                </div>



                <div className="w-full md:w-1/2 px-3 mb-2">
                    <label htmlFor="invoice_number" className={style.inputLabel}>Numero de Documento</label>
                    <input
                          type="number"
                          id="invoice_number"
                          {...register("invoice_number", {disabled: watch("invoice") == 0})}
                          className={`${style.input} ${watch("invoice") == 0 && "bg-red-200"}`}
                          step="any"
                          min={0}
                        />
                </div> 

                <div className="w-full md:w-1/2 px-3 mb-2">
                    <label htmlFor="quantity" className={style.inputLabel}> Cantidad *</label>
                    <input
                          type="number"
                          id="quantity"
                          {...register("quantity")}
                          className={style.input}
                          step="any"
                          min={0}
                        />
                </div>

                
                <div className="w-full md:w-1/2 px-3 mb-2">
                    <label htmlFor="expiration" className={style.inputLabel}>
                      Fecha de vencimiento
                    </label>
                    <input
                      type="date"
                      id="expiration"
                      {...register("expiration")}
                      className={style.input}
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
      <Modal.Footer className="flex justify-end gap-4">
        <Button onClick={onClose} preset={Preset.close} disabled={isSending} />
      </Modal.Footer>
    </Modal>
  );
}
