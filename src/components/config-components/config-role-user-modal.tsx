"use client";
import { useEffect, useState } from "react";
import { Modal } from "flowbite-react";
import { Button, Preset } from "../button/button";
import { loadData } from "@/utils/functions";
import { postData } from "@/services/resources";
import toast, { Toaster } from 'react-hot-toast';
import { Loading } from "../loading/loading";



export interface ConfigRoleUserModalProps {
  onClose: () => void;
  isShow: boolean;
  user: any; 
  random: (value: number) => void;
}

export function ConfigRoleUserModal(props: ConfigRoleUserModalProps) {
  const { onClose, isShow, user, random } = props;
  const [isSending, setIsSending] = useState(false);
  const [roles, setRoles] = useState([] as any);


  useEffect(() => {
    if (isShow) {
        (async () => setRoles(await loadData(`register/roles`)))(); 
    }  
    }, [isShow]);


    const handleRoleUpdate = async (role: any) =>{
        var data = { role: role, user: user.id };
        try {
          setIsSending(true)
          const response = await postData(`register/role`, "POST", data);
          if (response.type == "successful") {
            random && random(Math.random());
            onClose()
          } else {
            toast.error("Faltan algunos datos importantes!");
          }
        } catch (error) {
          console.error(error);
          toast.error("Ha ocurrido un error!");
        } finally {
          setIsSending(false)
        }
      }

      

    const listItems = roles?.data?.map((role: any):any => {
        if (role.name == "Root") return;
        return (
            <div key={role.id} onClick={()=>handleRoleUpdate(role.name)}>
                <li className="flex justify-between p-3 hover:bg-blue-200 hover:text-blue-800 cursor-pointer">
                {role.name}
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24"
                        stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                </li>
            </div>
          )
    })

  return (
    <Modal size="sm" show={isShow} position="center" onClose={onClose}>
      <Modal.Header>{ user?.name }</Modal.Header>
      <Modal.Body>
        { isSending ? 
            <Loading /> : 
            <div className="w-full bg-white rounded-lg shadow-lg">
              <ul className="divide-y-2 divide-gray-400">
              { listItems }
              </ul>
            </div> 
        }
      </Modal.Body>
      <Modal.Footer className="flex justify-end gap-4">
        <Button onClick={onClose} preset={Preset.close} disabled={isSending} />
      </Modal.Footer>
    <Toaster position="top-right" reverseOrder={false} />
    </Modal>
  );
}
