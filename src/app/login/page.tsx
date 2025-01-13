'use client'
import { Button, Preset } from '@/components/button/button';
import { useContext, useState } from 'react';
import { useForm } from 'react-hook-form';
import { postWithOutToken } from '@/services/resources';
import Image from 'next/image';
import { useRouter } from "next/navigation";
import { useAuthContext } from "@/contexts/authContext";
import { API_URL, AUTH_CLIENT, AUTH_SECRET } from "@/constants";
import { style } from '@/theme';
import { ConfigContext } from '@/contexts/config-context';



export default function Home() {
  const [isSending, setIsSending] = useState(false);
  const [isMessage, setIsMessage] = useState("");
  const [isRedirect, setIsRedirect] = useState(false);
  const { register, handleSubmit } = useForm();
  const router = useRouter();
  const { login, remoteUrl, tenant } = useAuthContext();
  const { setRandomInit } = useContext(ConfigContext);
  

  const getRemoteUrl = async (data: any) => {
    try {
      setIsSending(true);
      const response = await postWithOutToken(`${API_URL}oauth`, "POST", data);
      if (response.type == "error") {
        setIsMessage("Usuario no registrado"); 
      } else {
        if (response.status == 2) {
          router.push("/error/401");
          return
        }
        remoteUrl(response?.url);
        tenant(response?.system);
        data.username = data.email;
        await handleSubmitLogin(data, response)
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsSending(false);
    }
  };
  
  const handleSubmitLogin = async (data: any, responseInitial: any) => {
    data.grant_type = 'password';
    data.client_id = AUTH_CLIENT;
    data.client_secret = AUTH_SECRET;
    data.scope = "*"
    try {
      setIsSending(true);
      const response = await postWithOutToken(`${responseInitial?.url}/oauth/token`, "POST", data);
      if (!response.error) {
          setIsRedirect(true)
          login(response.access_token);
          setRandomInit(Math.random())
          router.push("/sales");
      } else {
        setIsMessage("Usuario o contraseña incorrecta");
      }
    } catch (error) {
      console.error(error);
    }
  };


  return (
    <div className="mx-auto px-1 my-auto ">
          <div className="flex justify-center">
            <div className="h-screen flex justify-center items-center">
              <div className='flex flex-col md:flex-row justify-center border-2 border-teal-500 w-full px-4 rounded-3xl shadow-xl shadow-teal-500'>

                <div className='md:w-1/2 flex justify-center items-center my-2 mx-5'>
                  <Image
                        src="/img/login.png"
                        alt="Login"
                        width={400}
                        height={400}
                        priority={false}
                      />
                </div>

                <div className='md:w-1/2 flex justify-center items-center my-2 mx-5'>
                    <form onSubmit={handleSubmit(getRemoteUrl)} className="w-full">
                    <div className="md:w-full max-w-sm">
                      <label htmlFor="email" className={style.inputLabel}> Email </label>
                      <input type="email" {...register("email")} className="text-sm w-full px-4 py-2 border border-solid border-gray-300 rounded" />

                      <label htmlFor="password" className={style.inputLabel}> Contraseña </label>
                      <input type="password" {...register("password")} className="text-sm w-full px-4 py-2 border border-solid border-gray-300 rounded" />


                         <div className="text-center md:text-left mt-4">
                        <Button type="submit" text={isRedirect ? 'Ingresando...' : 'Ingresar'} disabled={isSending || isRedirect} preset={isSending ? Preset.saving : Preset.send} isFull />
                      </div>
                      {isMessage && <div className="text-red-500 text-center mt-4">{isMessage}</div>}
                    </div>
                  </form>
   
                </div>

              </div>
            </div>
          </div>
    </div>
    )
}


