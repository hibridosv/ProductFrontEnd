"use client";
import { useContext, useEffect, useState } from "react";
import { Modal } from "flowbite-react";
import { Button, Preset } from "../button/button";
import {  postWithOutToken } from "@/services/resources";
import { Loading } from "../loading/loading";
import { useForm } from 'react-hook-form';
import { useAuthContext } from "@/contexts/authContext";
import { style } from '@/theme';
import { ConfigContext } from '@/contexts/config-context';
import toast, { Toaster } from 'react-hot-toast';
import { API_URL, AUTH_CLIENT, AUTH_SECRET } from "@/constants";
import CryptoJS from "crypto-js";
import { FaEye, FaEyeSlash } from "react-icons/fa";


export interface ConfigChangeTenantModalProps {
  onClose: () => void;
  isShow: boolean;
  tenantSelect: any; 
}

export function ConfigChangeTenantModal(props: ConfigChangeTenantModalProps) {
  const { onClose, isShow, tenantSelect } = props;
  const [isSending, setIsSending] = useState(false);
  const [isMessage, setIsMessage] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isRemoteUrl, setIsRemoteUrl] = useState<any>("");
  const { register, handleSubmit, setValue, watch } = useForm();
  const { login, remoteUrl, tenant, status } = useAuthContext();
  const { setRandomInit, systemInformation } = useContext(ConfigContext);
  const [isShowPassword, setIsShowPassword] = useState(false);


const getRemoteUrl = async () => {
    setIsSending(true);
    try {
      const response = await postWithOutToken(`${API_URL}oauth`, "POST", { email: systemInformation?.user?.email, change: tenantSelect?.url});
      if (response.type == "error") {
        setIsMessage(true); 
    } else {
        setIsRemoteUrl(response)
        setValue("username", systemInformation?.user?.email);
        setIsMessage(false); 
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsSending(false);  
    }
  };

  const handleSubmitLogin = async (data: any) => {
    data.grant_type = 'password';
    data.client_id = AUTH_CLIENT;
    data.client_secret = AUTH_SECRET;
    data.scope = "*"
    try {
      setIsSending(true);
      const response = await postWithOutToken(`${isRemoteUrl?.url}/oauth/token`, "POST", data);
      if (!response.error) {
          toast.success("Recargando nuevos datos!!");
          setIsLoading(true)
          setIsMessage(false);
          login(response.access_token);
          remoteUrl(isRemoteUrl?.url);
          tenant(isRemoteUrl?.system);
          status(CryptoJS.MD5(isRemoteUrl?.status+isRemoteUrl?.url.toString()).toString());
          setRandomInit(Math.random())
          // router.push("/config/transfers");
          onClose()
      } else {
        setIsMessage(true);
      }
    } catch (error) {
      console.error(error);
      setIsMessage(true);
    } finally {
      setIsSending(false);  
      setIsLoading(false)
    }
  };


  useEffect(() => {
    if (isShow) {
        (async () => getRemoteUrl())(); 
    }  
      // eslint-disable-next-line
    }, [isShow]);




  return (
    <Modal size="sm" show={isShow} position="center" onClose={onClose}>
      <Modal.Header>CAMBIAR SISTEMA</Modal.Header>
      <Modal.Body>
        { isSending ? 
            <Loading /> : isLoading ? <Loading text="Cargando datos..." /> :
            <div className="w-full bg-white rounded-lg shadow-lg">
                  <form onSubmit={handleSubmit(handleSubmitLogin)} className="w-full">
                    <div className="md:w-full max-w-sm">
                      <div className={style.input}>{ systemInformation?.user?.email }</div>
                      <input type="hidden" {...register("username")} className="text-sm w-full px-4 py-2 border border-solid border-gray-300 rounded" />
                      
                      {/* <label htmlFor="password" className={style.inputLabel}> Contraseña </label>
                      <input type="password" {...register("password")} className="text-sm w-full px-4 py-2 border border-solid border-gray-300 rounded" />
                       */}
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
                        <Button type="submit" text='Ingresar' disabled={isSending} preset={isSending ? Preset.saving : Preset.send} isFull />
                      </div>
                      {isMessage && <div className="text-red-500 text-center mt-4">Error al ingresar</div>}
                    </div>
                  </form>
            </div> 
        }
      <Toaster position="top-right" reverseOrder={false} />
      </Modal.Body>
      <Modal.Footer className="flex justify-end gap-4">
        <Button onClick={onClose} preset={Preset.close} disabled={isSending} />
      </Modal.Footer>
    </Modal>
  );
}
