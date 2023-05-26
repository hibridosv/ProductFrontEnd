'use client'
import { useContext} from 'react'
import { Loading } from '../components';
import { ViewTitle } from "../components/view-title/view-title";
import { ConfigContext } from "../../contexts/config-context";
import { ToggleSwitch } from 'flowbite-react';

// aqui deberian estar las configuraciones principales para poder hacer funcionar el sistema adecuadamente
// Solo los administradores root podran agregar o modificar mas opciones
// Las configuraciones por defecto solo se podran modificar el estado active, no el nombre ni la descripcion
// Agregar o modificar una nueva configuracion debera ser desde una opcion principal solo para root

export default function ConfigPrincipal() {
  const {config, updateConfig} = useContext(ConfigContext);

  if(!config.configurations) return <Loading />


  return (
    <div className="grid grid-cols-1 md:grid-cols-4 pb-10 mx-3">
        <div className="col-span-3">
             <ViewTitle text="CONFIGURACIONES PRINCIPALES" />
             {config.configurations.map((item: any, index: any) => (
                <div className='grid grid-cols-12' key={index}>
                  <div className='col-span-11 m-3 ml-10 font-semibold'>{item.description}</div>
                    <div className='col-span-1 m-3'>
                        <ToggleSwitch
                        checked={item.active}
                        label={item.active ? 'Activo' : 'Inactivo'}
                        onChange={() => updateConfig(item.id, item.active===1?0:1)}
                      />
                  </div>
                </div>
            ))}
         </div>
         <div>
         </div>
   </div>
   );
}
