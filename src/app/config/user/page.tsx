'use client'
import { Alert, ViewTitle } from "@/components";
import { Button, Preset } from "@/components/button/button";
import { ConfigUsersTable } from "@/components/config-components/config-users-table";
import { PresetTheme } from "@/services/enums";
import { postData } from "@/services/resources";
import { style } from "@/theme";
import { loadData } from "@/utils/functions";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast, { Toaster } from 'react-hot-toast';

export default function UsersPage() {
    const { register, handleSubmit, reset} = useForm();
    const [isSending, setIsSending] = useState(false);
    const [message, setMessage] = useState<any>({});
    const [users, setUsers] = useState([]);
    const [randomNumber, setRandomNumber] = useState(0);


    useEffect(() => {
        (async () => setUsers(await loadData(`register`)) )();
    }, [randomNumber]);

    const onSubmit = async (data: any) => {
        try {
          setIsSending(true)
          const response = await postData(`register`, "POST", data);
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
            const response = await postData(`register/${user}`, "DELETE");
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
                  <option value="Usuario">Usuario</option>
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
                <ViewTitle text="LISTADO DE USUARIOS" />

                    <ConfigUsersTable records={users} onDelete={handleDeleteUsers} random={setRandomNumber} />
            </div>
        <Toaster position="top-right" reverseOrder={false} />
      </div>
      );
}
