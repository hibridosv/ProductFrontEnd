
'use client'
import { CharBarWeek } from "./char-bar-week";
import { PrincipalInfo } from "./principal-info";
import { ViewTitle } from "../view-title/view-title";
import { AiFillLock } from "react-icons/ai";
import { useContext, useEffect, useState } from "react";
import { ShowCodeModal } from "./show-code-modal";
import { Toaster, toast } from "react-hot-toast";
import { permissionExists } from "@/utils/functions";
import { ConfigContext } from "@/contexts/config-context";




export function DashBoardIndex(){
  const [isCodeModal, setIsCodeModal] = useState(false);
  const [isCodePermmission, setIsCodePermmission] = useState(false);
  const { systemInformation } = useContext(ConfigContext);

  useEffect(() => {
    setIsCodePermmission(permissionExists(systemInformation?.permission, 'code-view'))
    // eslint-disable-next-line
  }, [systemInformation]);

    return(
      <div className="grid grid-cols-1 md:grid-cols-10 pb-10">
      <div className="col-span-6 border-r md:border-sky-600">
        <div className="flex justify-between">
          <ViewTitle text='PANEL PRINCIPAL' />
          <span className=" m-4 text-2xl" title="Ver código de seguridad" onClick={isCodePermmission ? ()=>setIsCodeModal(true) : ()=>toast.error("No tiene permisos para esta función") }>
            <AiFillLock color="#B28800" className=" shadow-md shadow-yellow-600 clickeable" />
            </span>
        </div>

        <PrincipalInfo  />
      </div>
      <div className="col-span-4">
        <div className='m-4 border-2 flex justify-center font-light text-sm '>VENTAS DE LA SEMANA</div>
        <div className='w-full px-4'>
          <CharBarWeek />
        </div>
      </div>
      <ShowCodeModal isShow={isCodeModal} onClose={()=>setIsCodeModal(false)} />
      <Toaster position="top-right" reverseOrder={false} />
    </div>
    );
}
