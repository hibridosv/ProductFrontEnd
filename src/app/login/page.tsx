'use client'

import { useState } from "react";

import { Button, Preset } from "@/components/button/button";
import { useForm } from "react-hook-form";
import { sendLogin } from "@/services/oauth";

export default function Page() {
  const [isSending, setIsSending] = useState(false);
  const { register, handleSubmit, reset } = useForm();

  const handleSubmitLogin = async (data: any) => {
    setIsSending(true);
    const response = await sendLogin(data);
    if (!response.error) {
      reset();
    }
    setIsSending(false);
  }


  return (
    <div className="pb-10">
        <div className=" flex justify-center">
        <div className="h-screen flex flex-col md:flex-row justify-center space-y-10 md:space-y-0 md:space-x-16 items-center my-2 mx-5 md:mx-0 md:my-0">
          <div className="md:w-1/3 max-w-sm">
          </div>
          <form onSubmit={handleSubmit(handleSubmitLogin)} className="w-full">
          <div className="md:w-1/3 max-w-sm">
          <input type="text" {...register("username")} className="text-sm w-full px-4 py-2 border border-solid border-gray-300 rounded" />
          <input type="password" {...register("password")} className="text-sm w-full px-4 py-2 border border-solid border-gray-300 rounded mt-4" />

            <div className="text-center md:text-left mt-4">
            <Button type="submit" disabled={isSending} preset={isSending ? Preset.saving : Preset.send} isFull />
            </div>
          </div>
          </form>
        </div>
      </div>
  
    </div>
  )
}
