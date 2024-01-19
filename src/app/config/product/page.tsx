"use client"
import { useState, useEffect, useContext } from 'react'

import { ViewTitle } from "@/components";
import { ListGroup } from "flowbite-react";
import { BiCategoryAlt, BiCurrentLocation } from "react-icons/bi";
import { GiWeight } from "react-icons/gi";
import { TbBrandOnlyfans } from "react-icons/tb";
import { AiFillCrown } from "react-icons/ai";
import { QuantityUnitList } from '@/components/products-components/quantity-units-list';
import { CategoryAddList } from '@/components/products-components/category-add-list';
import { BrandAddList } from '@/components/products-components/brand-add-list';
import { ConfigContext } from "@/contexts/config-context";
import { getConfigStatus } from "@/utils/functions";
import { LocationAddList } from '@/components/products-components/location-add-list';


export default function Config() {
  const [screen, setScreen ] = useState(1)
  const [brandStatus, setBrandStatus] = useState<boolean>(false);
  const [locationsStatus, setLocationsStatus] = useState<boolean>(false);
  const { config } = useContext(ConfigContext);

  const selectOptionType = (type: number = 1): any =>{
    setScreen(type)
  }

  const getNameOption = (type: number = 1): any =>{
      switch (type) {
        case 1: return "Categorías"
        case 2: return "Unidades de Medida"
        case 3: return "Marcas"
        case 4: return "Ubicaciones"
      }
  }
  
  useEffect(() => {
    setBrandStatus(getConfigStatus("product-brand", config));
    setLocationsStatus(getConfigStatus("product-locations", config));
    // eslint-disable-next-line
  }, [config]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 pb-10">
        <div className="col-span-1">
          <ViewTitle text="OPCIONES" />
          <div className='mr-3 sm:mt-3'>
          <ListGroup>
            <ListGroup.Item >
              Selecciones una opción
            </ListGroup.Item>
            <ListGroup.Item icon={BiCategoryAlt} onClick={()=>selectOptionType(1)} active={screen == 1 ? true : false}>
            {getNameOption(1)}
            </ListGroup.Item>
            <ListGroup.Item icon={GiWeight} onClick={()=>selectOptionType(2)} active={screen == 2 ? true : false}>
            {getNameOption(2)}
            </ListGroup.Item>
            {brandStatus && 
            <ListGroup.Item icon={TbBrandOnlyfans} onClick={()=>selectOptionType(3)} active={screen == 3 ? true : false}>
            {getNameOption(3)}
            </ListGroup.Item> }
            {locationsStatus && 
            <ListGroup.Item icon={BiCurrentLocation} onClick={()=>selectOptionType(4)} active={screen == 4 ? true : false}>
            {getNameOption(4)}
            </ListGroup.Item> }
          </ListGroup>
          </div>
        </div>
      <div className="col-span-3">
          <QuantityUnitList option={screen} name={getNameOption(screen).toUpperCase()} />
          <CategoryAddList option={screen} name={getNameOption(screen).toUpperCase()} />
          <BrandAddList option={screen} name={getNameOption(screen).toUpperCase()} />
          <LocationAddList option={screen} name={getNameOption(screen).toUpperCase()} />
      </div>

   </div>
  )
}
