'use client'
import { useEffect, useState } from 'react'
import { Loading } from '@/components';
import { ViewTitle } from "@/components/view-title/view-title";
import { ListGroup, ToggleSwitch } from 'flowbite-react';
import { loadData, permissionExists } from '@/utils/functions';
import { BiAnalyse } from 'react-icons/bi';
import { postData } from '@/services/resources';


export default function ConfigPrincipal() {
  const [roles, setRoles ] = useState([] as any)
  const [roleSelect, setRoleSelect ] = useState([] as any)
  const [permissions, setPermissions ] = useState([] as any)
  const [isSending, setIsSending] = useState(false);
  const [isLoading, setIsLoading] = useState(false);


  const handleGetPermissions = async (role: string = "Root")=>{
    setIsLoading(true)
    try {
        const response = await loadData(`roles/find/${role}`);
        if (response.data) {
          setRoleSelect(response)
        }
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false)
      }
  }


  const handleChangePermission = async (isActive: boolean, iden: string, role: string) => {
    let data = { is_active: isActive, iden, role }
    try {
      setIsSending(true);
      const response = await postData(`roles/change`, "POST", data);
      if (response.data) {
        setRoleSelect(response)
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsSending(false);
    }
  };


  useEffect(() => {
      (async () => setPermissions(await loadData(`roles/permissions`)) )();
      (async () => setRoles(await loadData(`roles/roles`)) )();
      (async () => handleGetPermissions())();
    // eslint-disable-next-line
  }, []);

  if(!permissions.data) return <Loading />

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 pb-10 mx-3">
        <div className="col-span-1">
          <ViewTitle text="MENU" />
          <div className='mr-3 sm:mt-3'>
          <ListGroup>
            <ListGroup.Item >
              Selecciones una opción
            </ListGroup.Item>

            {roles.data && roles?.data.map((item: any, index: any) => (
                <ListGroup.Item key={index} icon={BiAnalyse} onClick={()=> handleGetPermissions(item.name)}>
                {item.name}
                </ListGroup.Item>
            ))}
          </ListGroup>
          </div>
        </div>
        <div className="col-span-3">
             <ViewTitle text="PERMISOS ASIGNADOS" />
             {
              isLoading ? <Loading text='Obteniendo Permisos' /> :
             <div>
             {permissions && permissions?.data?.map((item: any, index: any) => (
                <div className='grid grid-cols-12 border-y-2' key={index}>
                  <div className='col-span-10 m-3 ml-10 font-semibold'>{index + 1} - {item.description}</div>
                    <div className='col-span-2 m-3'>
                        <ToggleSwitch
                        disabled={isSending}
                        checked={roleSelect ? permissionExists(roleSelect?.data?.roles, item.name) : false}
                        label={isSending ?  "Espere" : roleSelect && permissionExists(roleSelect?.data?.roles, item.name) ? "Activo" : "Inactivo"}
                        onChange={() => handleChangePermission(permissionExists(roleSelect?.data?.roles, item.name), item?.uuid, roleSelect?.data?.name)}
                      />
                  </div>
                </div>
            ))}
            </div>
          }
         </div>
   </div>
   );
}
