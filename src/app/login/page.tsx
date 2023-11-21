'use client'

import { useEffect, useState } from "react";
import { useRouter } from 'next/navigation'
import { Button, Preset } from "@/components/button/button";
import { useForm } from "react-hook-form";
import { getAuthTokenFromLocalStorage, sendLogin } from "@/services/oauth";
import { Loading } from "@/components";

export default function Page() {
  const [isSending, setIsSending] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { register, handleSubmit, reset } = useForm();
  const router = useRouter();


  useEffect(() => {
    setIsLoading(true);
    if (!isSending) {
      (async () => {
        const token = getAuthTokenFromLocalStorage();
        if (token) router.push('/'); 
      })(); 
    }
    setIsLoading(false);
  }, [router, isSending]);
  

  const handleSubmitLogin = async (data: any) => {
    setIsSending(true);
    const response = await sendLogin(data);
    if (!response.error) {
      reset();
    }
    setIsSending(false);
  }

  if (isLoading) return <Loading />

  return (
    <div className="pb-10 flex justify-center">
        <div className="h-screen flex flex-col md:flex-row justify-center space-y-10 md:space-y-0 md:space-x-16 items-center my-2 mx-5 md:mx-0 md:my-0">
          <form onSubmit={handleSubmit(handleSubmitLogin)} className="w-full">
          <div className="md:w-1/2 max-w-sm">
          <input type="text" {...register("username")} className="text-sm w-full px-4 py-2 border border-solid border-gray-300 rounded" />
          <input type="password" {...register("password")} className="text-sm w-full px-4 py-2 border border-solid border-gray-300 rounded mt-4" />

            <div className="text-center md:text-left mt-4">
            <Button type="submit" disabled={isSending} preset={isSending ? Preset.saving : Preset.send} isFull />
            </div>
          </div>
          </form>
        </div>
    </div>
  )
}
