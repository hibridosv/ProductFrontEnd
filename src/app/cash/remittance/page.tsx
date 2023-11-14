'use client'
import { useEffect, useState } from "react";
import { Alert, ViewTitle } from "@/components";
import { useForm } from "react-hook-form";
import { postData } from "@/services/resources";
import toast, { Toaster } from 'react-hot-toast';
import { style } from "@/theme";
import { PresetTheme } from "@/services/enums";
import { Button, Preset } from "@/components/button/button";
import { loadData } from "@/utils/functions";
import { CashRemittancesTable } from "@/components/table/cash-remittances-table";


export default function RemittancePage() {
    const { register, handleSubmit, reset } = useForm();
    const [isSending, setIsSending] = useState(false);
    const [message, setMessage] = useState<any>({});
    const [remittances, setRemittances] = useState([]);
    const [accounts, setAccounts] = useState([] as any);

    useEffect(() => {
        (async () => { 
          setRemittances(await loadData(`cash/remittances`));
          setAccounts(await loadData(`cash/accounts`));
        })();
  }, []);


    const onSubmit = async (data: any) => {
        data.status = 1;
        try {
          setIsSending(true)
          const response = await postData(`cash/remittances`, "POST", data);
            if (!response.message) {
              toast.success("Remesa agregada correctamente");
              setMessage({});
              setRemittances(response)
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

      
      const handleDeleteRemittance = async (iden: string) => {
        try {
          const response = await postData(`cash/remittances/${iden}`, 'DELETE');
          toast.success(response.message);
          setRemittances(await loadData(`cash/remittances`));
        } catch (error) {
          console.error(error);
          toast.error("Ha ocurrido un error!");
        } 
      }



  return (
       <div className="grid grid-cols-1 md:grid-cols-10 pb-10">
            <div className="col-span-4 border-r md:border-sky-600">
                <ViewTitle text="INGRESAR REMESA" />
                <div className="mx-4"> 
            <form onSubmit={handleSubmit(onSubmit)} className="w-full">
              <div className="flex flex-wrap -mx-3 mb-6">

              <div className="w-full md:w-full px-3 mb-2">
                    <label htmlFor="name" className={style.inputLabel}>Nombre de la remesa *</label>
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
                    {...register("description", {})}
                    rows={2}
                    className={`${style.input} w-full`}
                  />
                </div>



               <div className="w-full md:w-full px-3 mb-2">
                    <label htmlFor="cash_accounts_id" className={style.inputLabel}> Cuenta a transferir </label>
                    <select
                          defaultValue={accounts && accounts.data && accounts.data.length > 0 ? accounts.data[0].id : 0}
                          id="cash_accounts_id"
                          {...register("cash_accounts_id")}
                          className={style.input}
                        >
                        {accounts?.data?.map((value: any) => {
                          return (
                            <option key={value.id} value={value.id}> {value.account}{" | "}{value.bank}</option>
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
                <ViewTitle text="LISTADO DE REMESAS" />
                <CashRemittancesTable records={remittances} onDelete={handleDeleteRemittance} />
            </div>
        <Toaster position="top-right" reverseOrder={false} />
      </div>
      );
}
