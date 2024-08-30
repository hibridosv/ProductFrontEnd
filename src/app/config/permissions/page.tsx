'use client'
import { useContext, useEffect, useState } from 'react'
import { Alert, Loading } from '@/components';
import { ViewTitle } from "@/components/view-title/view-title";
import { ListGroup, ToggleSwitch } from 'flowbite-react';
import { loadData, permissionExists } from '@/utils/functions';
import { BiAnalyse } from 'react-icons/bi';
import { postData } from '@/services/resources';
import { ConfigContext } from '@/contexts/config-context';
import { PresetTheme } from '@/services/enums';


export default function ConfigPrincipal() {
  const [roles, setRoles ] = useState([] as any)
  const [roleSelect, setRoleSelect ] = useState([] as any)
  const [permissions, setPermissions ] = useState([] as any)
  const [isSending, setIsSending] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { systemInformation } = useContext(ConfigContext);


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
          <ViewTitle text="ROLES" />
          <div className='mr-3 sm:mt-3'>
          <ListGroup>
            <ListGroup.Item >
              Selecciones una opción
            </ListGroup.Item>

            {roles.data && roles.data.map((item: any, index: any) => {
              if (systemInformation?.role === "Root") {
                // Mostrar todas las opciones
                return (
                  <ListGroup.Item key={index} icon={BiAnalyse} onClick={() => handleGetPermissions(item.name)}>
                    {item.name}
                  </ListGroup.Item>
                );
              } else if (systemInformation?.role === "Gerencia" && item.name !== "Root") {
                // Mostrar todas menos "Root"
                return (
                  <ListGroup.Item key={index} icon={BiAnalyse} onClick={() => handleGetPermissions(item.name)}>
                    {item.name}
                  </ListGroup.Item>
                );
              } else if (systemInformation?.role === "Administracion" && item.name !== "Gerencia" && item.name !== "Root") {
                // Mostrar todas menos "Gerencia" y "Root"
                return (
                  <ListGroup.Item key={index} icon={BiAnalyse} onClick={() => handleGetPermissions(item.name)}>
                    {item.name}
                  </ListGroup.Item>
                );
              }
              return null; // No mostrar el item si no cumple las condiciones
            })}
          </ListGroup>
          </div>
        </div>
        <div className="col-span-3">
             <ViewTitle text="PERMISOS ASIGNADOS" />
             { systemInformation?.role == roleSelect?.data?.name && <Alert info='Advertencia!' theme={PresetTheme.danger} isDismisible={false} text='Eliminar un permiso de usuario en su mismo rol no es revertible' />}
             {
              isLoading ? <Loading text='Obteniendo Permisos' /> :
             <div>
             {permissions && permissions?.data?.map((item: any, index: any) => {
              return (
                  <div className='grid grid-cols-12 border-y-2' key={index}>
                    <div className='col-span-10 m-3 ml-10 font-semibold'>{index + 1} - {item.description}</div>
                      <div className='col-span-2 m-3'>
                          <ToggleSwitch
                          disabled={isSending || !permissionExists(systemInformation?.permission, item.name) || roleSelect?.data?.name === "Root"}
                          checked={roleSelect ? permissionExists(roleSelect?.data?.roles, item.name) : false}
                          label={isSending ?  "Espere" : roleSelect && permissionExists(roleSelect?.data?.roles, item.name) ? "Activo" : "Inactivo"}
                          onChange={() => handleChangePermission(permissionExists(roleSelect?.data?.roles, item.name), item?.uuid, roleSelect?.data?.name)}
                        />
                    </div>
                  </div>
              )
             })}
            </div>
          }
         </div>
   </div>
   );
}
