"use client";
import { useContext, useEffect, useState } from "react";
import { Modal } from "flowbite-react";
import { Button, Preset } from "../button/button";
import {  postWithOutToken } from "@/services/resources";
import { Loading } from "../loading/loading";
import { useForm } from 'react-hook-form';
import { useRouter } from "next/navigation";
import { useAuthContext } from "@/contexts/authContext";
import { API_URL } from "@/constants";
import { style } from '@/theme';
import { ConfigContext } from '@/contexts/config-context';


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
  const router = useRouter();
  const { login, remoteUrl, tenant } = useAuthContext();
  const { setRandomInit, systemInformation } = useContext(ConfigContext);

const getRemoteUrl = async () => {
    try {
      setIsSending(true);
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
    data.client_id = isRemoteUrl?.id;
    data.client_secret = isRemoteUrl?.hash;
    data.scope = "*"
    try {
      setIsSending(true);
      const response = await postWithOutToken(`${isRemoteUrl?.url}/oauth/token`, "POST", data);
      if (!response.error) {
          setIsLoading(true)
          setIsMessage(false);
          login(response.access_token);
          remoteUrl(isRemoteUrl?.url);
          tenant(isRemoteUrl?.system);
          setRandomInit(Math.random())
          router.push("/dashboard");
      } else {
        setIsMessage(true);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsSending(false);  
    }
  };


  useEffect(() => {
    if (isShow) {
        (async () => getRemoteUrl())(); 
    }  
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
                      <input type="hidden" {...register("username")} className="text-sm w-full px-4 py-2 border border-solid border-gray-300 rounded" />
                      <label htmlFor="password" className={style.inputLabel}> Contraseña </label>
                      <input type="password" {...register("password")} className="text-sm w-full px-4 py-2 border border-solid border-gray-300 rounded" />
                      <div className="text-center md:text-left mt-4">
                        <Button type="submit" text='Ingresar' disabled={isSending} preset={isSending ? Preset.saving : Preset.send} isFull />
                      </div>
                      {isMessage && <div className="text-red-500 text-center mt-4">Error al ingresar</div>}
                    </div>
                  </form>
            </div> 
        }
      </Modal.Body>
      <Modal.Footer className="flex justify-end gap-4">
        <Button onClick={onClose} preset={Preset.close} disabled={isSending} />
      </Modal.Footer>
    </Modal>
  );
}
