'use client'

import { useEffect, useState } from "react";
import { ViewTitle } from "@/components"
import { postData } from "@/services/resources";
import toast, { Toaster } from 'react-hot-toast';
import { loadData } from "@/utils/functions";
import { style } from "@/theme";
import { useForm } from "react-hook-form";
import { CommissionsListTable } from "@/components/tools-components/commissions-list-table";
import { Button, Preset } from "@/components/button/button";
import { CommissionAddModal } from "@/components/tools-components/commission-add-modal";

export default function Page() {
  const [commissions, setCommissions] = useState([]);
  const [users, setUsers] = useState([] as any);
  const [isAddCommissionModal, setIsAddCommissionModal] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const { register, watch } = useForm();
  const [randomNumber, setRandomNumber] = useState(0);

  useEffect(() => {
      (async () => setUsers(await loadData(`contacts/referrals`)))();
  }, []);

    const handlegetSales = async () => {
        let userId = watch("userId")
        try {
          setIsSending(true);
          const response = await postData(`tools/commissions`, "POST", {userId});
          if (!response.message) {
            setCommissions(response);
            toast.success("Datos obtenidos correctamente");
          } else {
            toast.error("Faltan algunos datos importantes!");
          }
        } catch (error) {
          console.error(error);
          toast.error("Ha ocurrido un error!");
        } finally {
          setIsSending(false);
        }
    };

    useEffect(() => {
      if (!isAddCommissionModal) {
        (async () => await handlegetSales())();
      }
    // eslint-disable-next-line
    }, [isAddCommissionModal, watch("userId"), randomNumber]);
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-10 pb-10">
        <div className="col-span-7 border-r md:border-sky-600">
            <div className="flex justify-between">
            <ViewTitle text="REPORTE DE COMISIONES POR CLIENTE" />
              <span className=" m-4 text-2xl "><Button preset={Preset.add} text="AGREGAR" onClick={()=>setIsAddCommissionModal(true)} /></span>
            </div>
            <CommissionsListTable records={commissions} isLoading={isSending} random={setRandomNumber}/>
        </div>
        <div className="col-span-3">
        <ViewTitle text="SELECCIONAR CLIENTE" />
          <div className="flex flex-wrap m-4 shadow-lg border-2 rounded-md mb-8">
              <div className="w-full md:w-full px-3 mb-2">
                    <label htmlFor="userId" className={style.inputLabel}> Seleccione el usuario </label>
                    <select defaultValue={1} id="userId" {...register("userId")} className={style.input} >
                    <option  value=""> Todos los Clientes</option>
                        {users?.data?.map((value: any) => {
                          return (
                            <option key={value.id} value={value.id}> {value.name} </option>
                          );
                        })}
                    </select>
                </div>
            </div>

        </div>
        <CommissionAddModal isShow={isAddCommissionModal} onClose={()=>setIsAddCommissionModal(false)} />
      <Toaster position="top-right" reverseOrder={false} />
    </div>
  )
}
