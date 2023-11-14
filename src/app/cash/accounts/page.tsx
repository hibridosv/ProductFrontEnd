'use client'
import { Alert, ViewTitle } from "@/components";
import { Button, Preset } from "@/components/button/button";
import { CashTransferModal } from "@/components/modals/cash-trasfers-modal";
import { CashAccountsTable } from "@/components/table/cash-accounts-table";
import { PresetTheme } from "@/services/enums";
import { postData } from "@/services/resources";
import { style } from "@/theme";
import { loadData } from "@/utils/functions";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast, { Toaster } from 'react-hot-toast';
import { RiRefreshFill } from 'react-icons/ri'

export default function AccountsPage() {
  const { register, handleSubmit, reset, watch, setValue } = useForm();
  const [isSending, setIsSending] = useState(false);
  const [message, setMessage] = useState<any>({});
  const [accounts, setAccounts] = useState([] as any);
  const [isCashTranferModal, setIsCashTranferModal] = useState(false);


  useEffect(() => {
    if (!isCashTranferModal) {
        (async () => setAccounts(await loadData(`cash/accounts`)))();
    }
}, [isCashTranferModal]);


const onSubmit = async (data: any) => {
  data.status = 1;
  try {
    setIsSending(true)
    const response = await postData(`cash/accounts`, "POST", data);
    if (!response.message) {
      toast.success("Cuenta agregada correctamente");
      setMessage({});
      setAccounts(response)
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

const handleDeleteAccount = async (iden: string) => {
  try {
    const response = await postData(`cash/accounts/${iden}`, 'DELETE');
    toast.success(response.message);
    setAccounts(await loadData(`cash/accounts`));
  } catch (error) {
    console.error(error);
    toast.error("Ha ocurrido un error!");
  } 
}


  return (
    <div className="grid grid-cols-1 md:grid-cols-10 pb-10">
        <div className="col-span-4 border-r md:border-sky-600">
            <div className="flex justify-between">
            <ViewTitle text="NUEVA CUENTA" />
            <RiRefreshFill size={32} className="col-span-11 m-4 text-2xl text-sky-900 clickeable" onClick={()=>setIsCashTranferModal(true)} />
            </div>

            <div className="mx-4"> 
            <form onSubmit={handleSubmit(onSubmit)} className="w-full">
              <div className="flex flex-wrap -mx-3 mb-6">

              <div className="w-full md:w-full px-3 mb-2">
                    <label htmlFor="account" className={style.inputLabel}>Nombre o numero de cuenta *</label>
                    <input
                          type="text"
                          id="account"
                          {...register("account")}
                          className={style.input}
                        />
                </div>

                <div className="w-full md:w-full px-3 mb-2">
                    <label htmlFor="bank" className={style.inputLabel}>Nombre del Banco *</label>
                    <input
                          type="text"
                          id="bank"
                          {...register("bank")}
                          className={style.input}
                        />
                </div>

                <div className="w-full md:w-full px-3 mb-2">
                    <label htmlFor="type" className={style.inputLabel}> Tipo de cuenta </label>
                    <select
                          defaultValue={1}
                          id="type"
                          {...register("type")}
                          className={style.input}
                        >
                        <option value="1">Caja Chica</option>
                        <option value="2">Cuenta</option>
                        <option value="3">Chequera</option>
                        <option value="4">Tarjeta</option>
                    </select>
                </div>


                <div className="w-full md:w-full px-3 mb-2">
                    <label htmlFor="balance" className={style.inputLabel}> Cantidad Inicial *</label>
                    <input
                          type="number"
                          id="balance"
                          {...register("balance")}
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
            <ViewTitle text="LISTADO DE CUENTAS" />
            <CashAccountsTable records={accounts} onDelete={handleDeleteAccount} />
        </div>
        <CashTransferModal isShow={isCashTranferModal} accounts={accounts} onClose={()=>setIsCashTranferModal(false)} />
        <Toaster position="top-right" reverseOrder={false} />
    </div>
      );
}
