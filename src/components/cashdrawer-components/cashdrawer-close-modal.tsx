"use client";
import { useContext, useEffect, useState } from "react";
import { Modal } from "flowbite-react";
import { Button, Preset } from "../button/button";
import toast, { Toaster } from 'react-hot-toast';
import { useForm } from "react-hook-form";
import {  postData } from "@/services/resources";
import { style } from "@/theme";
import { Alert } from "../alert/alert";
import { PresetTheme } from "@/services/enums";
import { ConfigContext } from "@/contexts/config-context";
import { loadData, numberToMoney } from "@/utils/functions";

export interface CashdrawerCloseModalProps {
  onClose: () => void;
  isShow?: boolean;
}

export function CashdrawerCloseModal(props: CashdrawerCloseModalProps) {
    const { onClose, isShow } = props;
    const { register, handleSubmit, resetField } = useForm();
    const [isSending, setIsSending] = useState(false);
    const [message, setMessage] = useState<any>({});
    const { cashDrawer, setCashDrawer} = useContext(ConfigContext);
    const [size, setSize] = useState("md");
    const [lastCut, setLastCut] = useState<any>({});

  useEffect(() => { isShow && setSize("md") }, [isShow]);

  const onSubmit = async (data: any) => {
    data.cash_id = cashDrawer;
    try {
        setIsSending(true)
        const response = await postData("cashdrawers/close", "POST", data);
        if (response.type == "successful") {
            toast.success("Caja Cerrada corectamente");
            setLastCut(await loadData(`cut/active`))
            resetField("quantity");
            setMessage({});
            setCashDrawer("");
            setSize("4xl");
        } else {
            toast.error("Ocurrio un error al cerrar!");
            setMessage(response.message);
        }
    } catch (error) {
      console.error(error);
      toast.error("Ha Ocurrido un Error!");
    } finally {
      setIsSending(false)
    }
  };


  return (
    <Modal size={size} show={isShow} position="center" onClose={isSending ? ()=>{} : onClose}>
      <Modal.Header>Corte de caja</Modal.Header>
      <Modal.Body>
    { cashDrawer ? (
        <div className="mx-4">
        <form className="max-w-lg mt-4" onSubmit={handleSubmit(onSubmit)} >
        
            <div className="w-full md:w-full px-3 mb-4">
                <label htmlFor="quantity" className={style.inputLabel} >Ingrese la cantidad de efectivo </label>
                <input {...register("quantity")} className={`${style.input} w-full`} />
            </div>

            <div className="flex justify-center">
            <Button type="submit" disabled={isSending} preset={isSending ? Preset.saving : Preset.save} />
            </div>
      </form>
        {message.errors && (
            <div className="mt-4">
                <Alert
                theme={PresetTheme.danger}
                info="Error"
                text={JSON.stringify(message.message)}
                isDismisible={false}
                />
            </div>
            )}
        </div> ) : (<>
            <div className="grid grid-cols-1 md:grid-cols-6 pb-10">
                <div className="col-span-3 border-2 border-slate-600 shadow-lg shadow-sky-500 rounded-md m-2">
                  <div className="m-2 text-center">Efectivo Apertura</div>
                  <div className="m-2 text-center font-bold text-3xl">{ numberToMoney(lastCut?.data?.inicial_cash ? lastCut?.data?.inicial_cash : 0) }</div>
                </div>
                <div className="col-span-3 border-2 border-slate-600 shadow-lg shadow-sky-500 rounded-md m-2">
                  <div className="m-2 text-center">Efectivo Cierre</div>
                  <div className="m-2 text-center font-bold text-3xl">{ numberToMoney(lastCut?.data?.final_cash ? lastCut?.data?.final_cash : 0) }</div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-9 pb-10">
                <div className="col-span-3 border-2 border-slate-600 shadow-lg shadow-orange-500 rounded-md m-2">
                  <div className="m-2 text-center">Salidas</div>
                  <div className="m-2 text-center font-bold text-3xl">{ numberToMoney(lastCut?.data?.cash_expenses ? lastCut?.data?.cash_expenses : 0) }</div>
                </div>
                <div className="col-span-3 border-2 border-slate-600 shadow-lg shadow-lime-500 rounded-md m-2">
                  <div className="m-2 text-center">Entradas</div>
                  <div className="m-2 text-center font-bold text-3xl">{ numberToMoney(lastCut?.data?.cash_incomes ? lastCut?.data?.cash_incomes : 0) }</div>
                </div>
                <div className="col-span-3 border-2 border-slate-600 shadow-lg shadow-fuchsia-500 rounded-md m-2">
                  <div className="m-2 text-center">Diferencia</div>
                  <div className="m-2 text-center font-bold text-3xl">{ numberToMoney(lastCut?.data?.cash_diference ? lastCut?.data?.cash_diference : 0) }</div>
                </div>
            </div>

        </>)}

      <Toaster position="top-right" reverseOrder={false} />
      </Modal.Body>
      <Modal.Footer className="flex justify-end gap-4">
        <Button onClick={onClose} preset={Preset.close} disabled={isSending} />
      </Modal.Footer>
    </Modal>
  );

}
