'use client'
import { Alert, ViewTitle } from "@/components";
import { Button, Preset } from "@/components/button/button";
import { ConfigUsersTable } from "@/components/config-components/config-users-table";
import { ConfigContext } from "@/contexts/config-context";
import { PresetTheme } from "@/services/enums";
import { postData } from "@/services/resources";
import { style } from "@/theme";
import { loadData } from "@/utils/functions";
import { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast, { Toaster } from 'react-hot-toast';
import { BiUserCircle } from "react-icons/bi";
import { RiRefreshFill } from "react-icons/ri";

export default function UsersPage() {
    const { register, handleSubmit, reset} = useForm();
    const [isSending, setIsSending] = useState(false);
    const [message, setMessage] = useState<any>({});
    const [users, setUsers] = useState([]);
    const [randomNumber, setRandomNumber] = useState(0);
    const { systemInformation } = useContext(ConfigContext);
    const userType  = systemInformation?.system?.tenant?.system == 2 || systemInformation?.system?.tenant?.system == 4 ? "Mesero" : "Usuario";
    const [showAll, setShowAll] = useState(false);

    useEffect(() => {
        (async () => setUsers(await loadData(`users`)) )();
    }, [randomNumber]);

    const onSubmit = async (data: any) => {
        try {
          setIsSending(true)
          const response = await postData(`users`, "POST", data);
          if (!response.message) {
            toast.success("Usuario agregado correctamente");
            setMessage({});
            setUsers(response)
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

      const handleDeleteUsers = async (user: any)=>{
        try {
            const response = await postData(`users/${user}`, "DELETE");
            if (!response.message) {
              toast.success("Usuario Eliminado correctamente");
              setUsers(response)
            } else {
              toast.error("Faltan algunos datos importantes!");
            }
          } catch (error) {
            console.error(error);
            toast.error("Ha ocurrido un error!");
          }
      }

  return (
       <div className="grid grid-cols-1 md:grid-cols-10 pb-10">
            <div className="col-span-4 border-r md:border-sky-600">
                <ViewTitle text="INGRESAR USUARIO" />

                <div className="mx-4"> 
          <form onSubmit={handleSubmit(onSubmit)} className="w-full">
            <div className="flex flex-wrap -mx-3 mb-6">

              <div className="w-full md:w-full px-3 mb-2">
                <label htmlFor="name" className={style.inputLabel}>Nombre  *</label>
                <input type="text" id="name" {...register("name")} className={style.input} />
              </div>
              
              <div className="w-full md:w-full px-3 mb-2">
                <label htmlFor="email" className={style.inputLabel}>Email *</label>
                <input type="email" id="email"  {...register("email")} className={style.input} />
              </div>

              <div className="w-full md:w-full px-3 mb-2">
                <label htmlFor="password" className={style.inputLabel}>Password *</label>
                <input  type="password"  id="password" {...register("password")} className={style.input} />
              </div>

              <div className="w-full md:w-full px-3 mb-2">
                <label htmlFor="password_confirmation" className={style.inputLabel}>Repeat Password *</label>
                <input type="password" id="password_confirmation" {...register("password_confirmation")} className={style.input} />
              </div>

              <div className="w-full md:w-full px-3 mb-2">
                <label htmlFor="type" className={style.inputLabel}> Tipo de usuario *</label>
                <select id="type" {...register("type")} className={style.input} >
                  <option value="Gerencia">Gerencia</option>
                  <option value="Administracion">Administracion</option>
                  <option value="Cajero">Cajero</option>
                  <option value={userType}>{userType}</option>
                  <option value="Contador">Contador</option>
                </select>
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
                
                    <div className="flex justify-between">
                        <ViewTitle text="LISTADO DE USUARIOS" />
                        <div title={ showAll ? "Ocultar usuarios eliminados" : "Mostrar todos los usuarios"} onClick={()=>setShowAll(!showAll)} className="text-sm text-right">{ showAll ? <RiRefreshFill size={32} className="col-span-11 m-4 text-2xl text-sky-900 clickeable" /> : <BiUserCircle size={32} className="col-span-11 m-4 text-2xl text-red-900 clickeable" /> }</div>
                      </div>
                    <ConfigUsersTable records={users} onDelete={handleDeleteUsers} random={setRandomNumber} showAll={showAll} />
            </div>
        <Toaster position="top-right" reverseOrder={false} />
      </div>
      );
}
