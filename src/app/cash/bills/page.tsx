'use client'
import { Alert, Loading, ViewTitle } from "@/components";
import { Button, Preset } from "@/components/button/button";
import { CashBillsTable } from "@/components/table/cash-bills-table";
import { PresetTheme } from "@/services/enums";
import { postData } from "@/services/resources";
import { style } from "@/theme";
import { loadData } from "@/utils/functions";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast, { Toaster } from 'react-hot-toast';

export default function BillsPage() {
    const { register, handleSubmit, reset, watch, setValue } = useForm();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isSending, setIsSending] = useState(false);
    const [message, setMessage] = useState<any>({});
    const [bills, setBills] = useState([]);
    const [categories, setCategories] = useState([] as any);
    const [accounts, setAccounts] = useState([] as any);


    useEffect(() => {
        (async () => { 
          setCategories(await loadData(`cash/categories`));
          setBills(await loadData(`cash/bills`));
          setAccounts(await loadData(`cash/accounts`));
        })();
  }, []);


    const onSubmit = async (data: any) => {
        data.status = 1;
        data.cash_accounts_id = data.payment_type == 1 ? null : data.cash_accounts_id;
        data.invoice = data.type == 0 ? 0 : data.invoice;
        data.invoice_number = data.type == 0 ? null : data.invoice_number;
        try {
          setIsSending(true)
          const response = await postData(`cash/bills`, "POST", data);
          if (!response.message) {
            toast.success("Gasto agregado correctamente");
            setMessage({});
            console.log(response)
            setBills(response)
            reset()
            setValue("payment_type", 1)
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

      const handleDeleteBill = async (iden: string) => {
        try {
          const response = await postData(`cash/bills/${iden}`, 'DELETE');
          toast.success(response.message);
          setBills(await loadData(`cash/bills`));
        } catch (error) {
          console.error(error);
          toast.error("Ha ocurrido un error!");
        } 
      }

  return (
       <div className="grid grid-cols-1 md:grid-cols-10 pb-10">
            <div className="col-span-4 border-r md:border-sky-600">
                <ViewTitle text="INGRESAR GASTO" />

                <div className="mx-4"> 
            <form onSubmit={handleSubmit(onSubmit)} className="w-full">
              <div className="flex flex-wrap -mx-3 mb-6">

              <div className="w-full md:w-full px-3 mb-2">
                    <label htmlFor="name" className={style.inputLabel}>Nombre del Gasto *</label>
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
                    <label htmlFor="type" className={style.inputLabel}> Tipo de gasto *</label>
                    <select
                          defaultValue={0}
                          id="type"
                          {...register("type")}
                          className={style.input}
                        >
                        <option value="0">Sin Comprobante</option>
                        <option value="1">Con Comprobante</option>
                    </select>
                </div>
                

                { watch("type") == 1 && <> <div className="w-full md:w-1/2 px-3 mb-2">
                    <label htmlFor="invoice" className={style.inputLabel}> Tipo de Documento </label>
                    <select
                          id="invoice"
                          {...register("invoice")}
                          className={style.input}
                        >
                        {/* <option value="0">Ninguno</option> */}
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
                          {...register("invoice_number")}
                          className={style.input}
                          step="any"
                          min={0}
                        />
                </div> </>}

                <div className="w-full md:w-1/2 px-3 mb-2">
                    <label htmlFor="payment_type" className={style.inputLabel}> Tipo de pago </label>
                    <select
                          defaultValue={1}
                          id="payment_type"
                          {...register("payment_type")}
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


                <div className="w-full md:w-1/2 px-3 mb-2">
                    <label htmlFor="cash_bills_categories_id" className={style.inputLabel}> Categoria de gasto </label>
                    <select
                          defaultValue={categories && categories.data && categories.data.length > 0 ? categories.data[0].id : 0}
                          id="cash_bills_categories_id"
                          {...register("cash_bills_categories_id")}
                          className={style.input}
                        >
                        {categories?.data?.map((value: any) => {
                          return (
                            <option key={value.id} value={value.id}> {value.name}</option>
                          );
                        })}
                    </select>
                </div>

               { watch("payment_type") != 1 && <div className="w-full md:w-full px-3 mb-2">
                    <label htmlFor="cash_accounts_id" className={style.inputLabel}> Cuenta de tranferencia </label>
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
                </div> }


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
                <ViewTitle text="LISTADO DE GASTOS" />
                    <CashBillsTable records={bills} onDelete={handleDeleteBill} />
            </div>
        <Toaster position="top-right" reverseOrder={false} />
      </div>
      );
}
