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
import CryptoJS from "crypto-js";
import { FaEye, FaEyeSlash } from 'react-icons/fa';


export default function Home() {
  const [isSending, setIsSending] = useState(false);
  const [isMessage, setIsMessage] = useState("");
  const [isRedirect, setIsRedirect] = useState(false);
  const [isShowPassword, setIsShowPassword] = useState(false);
  const { register, handleSubmit } = useForm();
  const router = useRouter();
  const { login, remoteUrl, tenant, status } = useAuthContext();
  const { setRandomInit } = useContext(ConfigContext);



  const getRemoteUrl = async (data: any) => {
    data.email = data.email.includes("@") ? data.email : data.email + "@hibridosv.com";
    try {
      setIsSending(true);
      const response = await postWithOutToken(`${API_URL}oauth`, "POST", data);
      if (response.type == "error") {
        setIsMessage("Usuario no registrado"); 
      } else {
        remoteUrl(response?.url);
        tenant(response?.system);
        status(CryptoJS.MD5(response?.status+response?.url.toString()).toString());
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
                        src="/img/login2.png"
                        alt="Login"
                        width={400}
                        height={400}
                        priority={false}
                      />
                </div>

                <div className='md:w-1/2 flex justify-center items-center my-2 mx-5'>
                    <form onSubmit={handleSubmit(getRemoteUrl)} className="w-full">
                    <div className="md:w-full max-w-sm">
                      <div>
                        <label htmlFor="email" className={style.inputLabel}> Email </label>
                        <input type="text" {...register("email")} className="text-sm w-full px-4 py-2 border border-solid border-gray-300 rounded" />
                      </div>

                      <div className='flex justify-between items-center mt-4'>
                        <div className='w-full'>
                          <label htmlFor="password" className={style.inputLabel}> Contraseña </label>
                          <input type={isShowPassword ? "text" : "password"} {...register("password")} className="text-sm w-full px-4 py-2 border border-solid border-gray-300 rounded" />
                        </div>
                        <div className='flex items-center justify-center w-6 h-6 bg-gray-200 rounded-full cursor-pointer hover:bg-gray-300 transition duration-200 ease-in-out mt-4 ml-2'>
                          { isShowPassword ? (
                            <FaEyeSlash className='text-gray-600' onClick={() => setIsShowPassword(false)} />
                          ) : (
                            <FaEye className='text-gray-600' onClick={() => setIsShowPassword(true)} />
                          )}
                        </div>
                      </div>


                         <div className="text-center md:text-left mt-4">
                        <Button type="submit" text={isRedirect ? 'Ingresando...' : 'Ingresar'} disabled={isSending || isRedirect} preset={isSending ? Preset.saving : Preset.send} isFull />
                      </div>
                      {isMessage && <div className="text-red-500 text-center mt-4">{isMessage}</div>}
                      <div className="text-red-500 text-center mt-4">Es posible que en este momento nuestro sistema tenga problemas, esto se debe a una caida mundial de los servicios de Cloudflare que esta afectando miles de sistemas como ChatGpt, X, Canva, e incluido nuestro sistema. Estamos trabajando para restablecer el servicio lo antes posible.  Disculpa las molestias ocasionadas.
                      </div>
                    </div>
                  </form>
   
                </div>

              </div>
            </div>
          </div>
    </div>
    )
}


