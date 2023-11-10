'use client'
import { useContext, useState } from 'react'
import { Loading } from '@/components';
import { ViewTitle } from "@/components/view-title/view-title";
import { ConfigContext } from "@/contexts/config-context";
import { ListGroup, ToggleSwitch } from 'flowbite-react';
import { GoSettings } from "react-icons/go";
import { MdOutlineInventory, MdPointOfSale, MdComputer } from "react-icons/md";
import { FaFileInvoice } from "react-icons/fa"
import { AiFillPrinter } from "react-icons/ai"
// aqui deberian estar las configuraciones principales para poder hacer funcionar el sistema adecuadamente
// Solo los administradores root podran agregar o modificar mas opciones
// Las configuraciones por defecto solo se podran modificar el estado active, no el nombre ni la descripcion
// Agregar o modificar una nueva configuracion debera ser desde una opcion principal solo para root

export default function ConfigPrincipal() {
  const {config, updateConfig} = useContext(ConfigContext);
  const [configFilter, setConfigFilter ] = useState(1)

  const selectOptionType = (type: number = 1): any =>{
    setConfigFilter(type)
  }

  if(!config.configurations) return <Loading />

  let configFiltered = config?.configurations.filter((conf: any) => (conf.group === configFilter));

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 pb-10 mx-3">
        <div className="col-span-1">
          <ViewTitle text="MENU" />
          <div className='mr-3 sm:mt-3'>
          <ListGroup>
            <ListGroup.Item >
              Selecciones una opción
            </ListGroup.Item>
            <ListGroup.Item icon={GoSettings} onClick={()=>selectOptionType(2)} active={configFilter == 2 ? true : false}>
            Configuraciones
            </ListGroup.Item>
            <ListGroup.Item icon={MdOutlineInventory} onClick={()=>selectOptionType(3)} active={configFilter == 3 ? true : false}>
              Inventario
            </ListGroup.Item>
            <ListGroup.Item icon={MdPointOfSale} onClick={()=>selectOptionType(4)} active={configFilter == 4 ? true : false}>
              Ventas
            </ListGroup.Item>
            <ListGroup.Item icon={FaFileInvoice} onClick={()=>selectOptionType(5)} active={configFilter == 5 ? true : false}>
              Facturación
            </ListGroup.Item>
            <ListGroup.Item icon={AiFillPrinter} onClick={()=>selectOptionType(6)} active={configFilter == 6 ? true : false}>
              Impresiones
            </ListGroup.Item>
            <ListGroup.Item icon={MdComputer} onClick={()=>selectOptionType(1)} active={configFilter == 1 ? true : false}>
              Sistema
            </ListGroup.Item>
          </ListGroup>
          </div>
        </div>
        <div className="col-span-3">
             <ViewTitle text="CONFIGURACIONES PRINCIPALES" />
             {configFiltered.map((item: any, index: any) => (
                <div className='grid grid-cols-12 border-y-2' key={index}>
                  <div className='col-span-10 m-3 ml-10 font-semibold'>{item.description}</div>
                    <div className='col-span-2 m-3'>
                        <ToggleSwitch
                        checked={item.active}
                        label={item.active ? 'Activo' : 'Inactivo'}
                        onChange={() => updateConfig(item.id, item.active===1?0:1)}
                      />
                  </div>
                </div>
            ))}
         </div>
   </div>
   );
}
