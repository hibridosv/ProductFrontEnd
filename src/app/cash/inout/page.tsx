'use client'
import { Alert, ViewTitle } from "@/components";
import { Button, Preset } from "@/components/button/button";
import { CashInOutTable } from "@/components/cash-components/cash-in-out-table";
import { PresetTheme } from "@/services/enums";
import { postData } from "@/services/resources";
import { style } from "@/theme";
import { loadData } from "@/utils/functions";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast, { Toaster } from 'react-hot-toast';


export default function InOutPage() {
  const { register, handleSubmit, reset, watch, setValue } = useForm();
  const [isSending, setIsSending] = useState(false);
  const [message, setMessage] = useState<any>({});
  const [accounts, setAccounts] = useState([] as any);
  const [inOuts, setInOuts] = useState([] as any);


  useEffect(() => {
    (async () => { 
      setAccounts(await loadData(`cash/accounts`));
      setInOuts(await loadData(`cash/in-out`));
    })();
}, []);

const onSubmit = async (data: any) => {
  data.status = 1;
  try {
    setIsSending(true)
    const response = await postData(`cash/in-out`, "POST", data);
    if (!response.message) {
      toast.success("Registro agregado correctamente");
      setInOuts(response)
      setAccounts(await loadData(`cash/accounts`));
      setMessage({});
      reset()
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
}


const handleDeleteInOuts = async (iden: string) => {
  try {
    const response = await postData(`cash/in-out/${iden}`, 'DELETE');
    toast.success(response.message);
    setAccounts(await loadData(`cash/accounts`));
    setInOuts(await loadData(`cash/in-out`));
  } catch (error) {
    console.error(error);
    toast.error("Ha ocurrido un error!");
  } 
}



  return (
    <div className="grid grid-cols-1 md:grid-cols-10 pb-10">
        <div className="col-span-4 border-r md:border-sky-600">
            <ViewTitle text="ENTRADA O SALIDA DE EFECTIVO" />
            <div className="mx-4"> 
            <form onSubmit={handleSubmit(onSubmit)} className="w-full">
              <div className="flex flex-wrap -mx-3 mb-6">


              <div className="w-full md:w-full px-3 mb-2">
                    <label htmlFor="transaction_type" className={style.inputLabel}> Tipo de gasto *</label>
                    <select
                          defaultValue={0}
                          id="transaction_type"
                          {...register("transaction_type")}
                          className={style.input}
                        >
                        <option value="1">Ingreso de efectivo</option>
                        <option value="0">Salida de efectivo</option>
                    </select>
                </div>

                <div className="w-full md:w-full px-3 mb-2">
                  <label htmlFor="description" className={style.inputLabel}> Descripción{" "} </label>
                  <textarea
                    {...register("description", {})}
                    rows={2}
                    className={`${style.input} w-full`}
                  />
                </div>


                <div className="w-full md:w-full px-3 mb-2">
                    <label htmlFor="cash_accounts_id" className={style.inputLabel}> Cuenta de tranferencia </label>
                    <select
                          defaultValue={accounts && accounts.data && accounts.data.length > 0 ? accounts.data[0].id : 0}
                          id="cash_accounts_id"
                          {...register("cash_accounts_id")}
                          className={style.input}
                        >
                        {accounts?.data?.map((value: any) => {
                          return (
                            <option key={value.id} value={value.id}> {value.account}{" | "}{value.bank}{" | $"}{value.balance}</option>
                          );
                        })}
                    </select>
                </div> 



                <div className="w-full md:w-full px-3 mb-2">
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
        </div>
        <div className="col-span-6">
            <ViewTitle text="LISTADO DE TRANSACCIONES" />
            <CashInOutTable records={inOuts} onDelete={handleDeleteInOuts} />
        </div>
        <Toaster position="top-right" reverseOrder={false} />
    </div>
      );
}
