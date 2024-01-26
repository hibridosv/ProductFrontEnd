'use client'
import { Button, Preset } from '@/components/button/button';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { postWithOutToken } from '@/services/resources';
import Image from 'next/image';
import { useRouter } from "next/navigation";
import { useAuthContext } from "@/contexts/authContext";
import { API_URL, URL } from "@/constants";



export default function Home() {
  const [isSending, setIsSending] = useState(false);
  const [isMessage, setIsMessage] = useState("");
  const [isRemoteUrl, setIsRemoteUrl] = useState<string>("");
  const { register, handleSubmit, setValue } = useForm();
  const router = useRouter();
  const { login, remoteUrl } = useAuthContext();


  const getRemoteUrl = async (data: any) => {
    try {
      setIsSending(true);
      const response = await postWithOutToken(`${API_URL}remote`, "POST", data);
      if (response.type == "error") {
        setIsMessage("Usuario no registrado"); 
      } else {
        remoteUrl(response?.data?.url);
        setIsRemoteUrl(response?.data?.url)
        setValue("username", data.email);
      }
      console.log(response)
    } catch (error) {
      console.error(error);
    } finally {
      setIsSending(false);  
    }
  };

  const handleSubmitLogin = async (data: any) => {
    data.grant_type = 'password';
    data.client_id = process.env.CLIENT_ID;
    data.client_secret = process.env.CLIENT_SECRET;
    data.scope = "*"
    try {
      setIsSending(true);
      const response = await postWithOutToken(`${isRemoteUrl}/oauth/token`, "POST", data);
      if (!response.error) {
          login(response.access_token);
          router.push("/dashboard");
      } else {
        setIsMessage("Usuario o contraseña incorrecta");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsSending(false);  
    }
  };


  const imageLoader = ({ src, width, quality }: any) => {
    return `${URL}images/common/${src}?w=${width}&q=${quality || 75}`
  }

  return (
    <div className="mx-auto px-1 my-auto ">
          <div className="flex justify-center">
            <div className="h-screen flex justify-center items-center my-2 mx-5">
              <div className='flex flex-col md:flex-row justify-center border-2 border-teal-500 w-full pt-8 px-4 rounded-3xl shadow-xl shadow-teal-500'>

                <div className='md:w-1/2 flex justify-center items-center my-2 mx-5'>
                  <Image loader={imageLoader} src="hibrido.jpg" alt="Hibrido" width={200} height={200} />
                </div>

                <div className='md:w-1/2 flex justify-center items-center my-2 mx-5'>
                  {
                    isRemoteUrl === "" ? 
                    <>
                    <form onSubmit={handleSubmit(getRemoteUrl)} className="w-full">
                    <div className="md:w-full max-w-sm">
                      <input type="email" {...register("email")} className="text-sm w-full px-4 py-2 border border-solid border-gray-300 rounded" />
                         <div className="text-center md:text-left mt-4">
                        <Button type="submit" text='Siguiente' disabled={isSending} preset={isSending ? Preset.saving : Preset.send} isFull />
                      </div>
                      {isMessage && <div className="text-red-500 text-center mt-4">{isMessage}</div>}
                    </div>
                  </form>
                  </> :
                  <>
                  <form onSubmit={handleSubmit(handleSubmitLogin)} className="w-full">
                    <div className="md:w-full max-w-sm">
                      <input type="hidden" {...register("username")} className="text-sm w-full px-4 py-2 border border-solid border-gray-300 rounded" />
                      <input type="password" {...register("password")} className="text-sm w-full px-4 py-2 border border-solid border-gray-300 rounded mt-4" />
                      <div className="text-center md:text-left mt-4">
                        <Button type="submit" text='Ingresar' disabled={isSending} preset={isSending ? Preset.saving : Preset.send} isFull />
                      </div>
                      {isMessage && <div className="text-red-500 text-center mt-4">{isMessage}</div>}
                    </div>
                  </form>
                  </>
                  }
                  {/* <form onSubmit={handleSubmit(handleSubmitLogin)} className="w-full">
                    <div className="md:w-full max-w-sm">
                      <input type="text" {...register("username")} className="text-sm w-full px-4 py-2 border border-solid border-gray-300 rounded" />
                      <input type="password" {...register("password")} className="text-sm w-full px-4 py-2 border border-solid border-gray-300 rounded mt-4" />

                      <div className="text-center md:text-left mt-4">
                        <Button type="submit" text='Ingresar' disabled={isSending} preset={isSending ? Preset.saving : Preset.send} isFull />
                      </div>
                      {isMessage && <div className="text-red-500 text-center mt-4">{isMessage}</div>}
                    </div>
                  </form> */}
                </div>

              </div>
            </div>
          </div>
    </div>
    )
}


