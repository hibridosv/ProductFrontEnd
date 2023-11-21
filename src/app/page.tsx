'use client'
import { Button, Preset } from '@/components/button/button';
import { Header, Loading, SideBar } from '../components'
import { useEffect, useState } from 'react';
import { getAuthTokenFromCookie, setAuthTokenCookie } from '@/services/oauth';
import { useForm } from 'react-hook-form';
import { DashBoardIndex } from '@/components/dashboard-components/dashboard-index';
import { postWithOutApi } from '@/services/resources';
import Image from 'next/image';
import { URL } from '@/constants';


export default function Home() {
  const [isSending, setIsSending] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isRegister, setIsRegister] = useState(false);
  const [isMessage, setIsMessage] = useState("");
  const { register, handleSubmit, reset } = useForm();



  useEffect(() => {
    setIsLoading(true);
    if (!isSending) {
      (async () => {
        const token = getAuthTokenFromCookie();
        if (token) setIsRegister(true);
      })(); 
    }
    setIsLoading(false);
  }, [isSending]);
  


  const handleSubmitLogin = async (data: any) => {
    data.grant_type = 'password';
    data.client_id = process.env.CLIENT_ID;
    data.client_secret = process.env.CLIENT_SECRET;
    data.scope = "*"
    try {
      setIsSending(true);
      const response = await postWithOutApi(`oauth/token`, "POST", data);
      if (!response.error) {
          setAuthTokenCookie(response.access_token);
          setIsRegister(true);
          reset();
          setIsMessage("");
      } else {
        setIsMessage("Usuario o contraseña incorrecta");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsSending(false);  
    }
  };


  if (isLoading) return <Loading />

  const imageLoader = ({ src, width, quality }: any) => {
    return `${URL}images/logo/${src}?w=${width}&q=${quality || 75}`
  }

  return (
      <div className="mx-auto px-1 my-auto ">
      { isRegister ? (<>
      <Header />
      <div>
        <div>
        <SideBar />
        </div>
        <div className="w-full h-full">
          <DashBoardIndex />
        </div>
      </div>
      </>):(
        <div className="flex justify-center">
        <div className="h-screen flex justify-center items-center my-2 mx-5">
          <div className=' flex justify-center border-2 border-teal-500 w-full pt-8 px-4 rounded-3xl shadow-xl shadow-teal-500'>
        
          <Image loader={imageLoader} src="hibrido.jpg" alt="Hibrido" width={200} height={200} />

          <form onSubmit={handleSubmit(handleSubmitLogin)} className="w-full">
          <div className="md:w-full max-w-sm">
          <input type="text" {...register("username")} className="text-sm w-full px-4 py-2 border border-solid border-gray-300 rounded" />
          <input type="password" {...register("password")} className="text-sm w-full px-4 py-2 border border-solid border-gray-300 rounded mt-4" />

            <div className="text-center md:text-left mt-4">
            <Button type="submit" disabled={isSending} preset={isSending ? Preset.saving : Preset.send} isFull />
            </div>
            { isMessage && <div className="text-red-500 text-center mt-4">{isMessage}</div> }
          </div>
          </form>
          </div>
        </div>
    </div>
      )}
    </div>
    )
}


