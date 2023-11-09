'use client';
import { OptionsClickOrder } from '@/services/enums';
import { Button, Dropdown } from 'flowbite-react';
import { AiFillSave } from 'react-icons/ai';
import { FaRegMoneyBillAlt } from 'react-icons/fa';
import { GiCancel } from 'react-icons/gi';
import { IoMdOptions } from 'react-icons/io';

export interface SalesButtonsProps {
  onClick: (option: number) => void;
}

export function SalesButtons(props: SalesButtonsProps) {
  const {onClick } = props

  return (<div>
           <div>
            <Button.Group>
            <Dropdown
            label={<div className='button-left-grey'><IoMdOptions className='mr-1' /> Opciones</div>}
            inline={true}
            arrowIcon={false}>
              <Dropdown.Item onClick={()=>onClick(OptionsClickOrder.discount)}> Agregar Descuento </Dropdown.Item>
              <Dropdown.Item onClick={()=>onClick(OptionsClickOrder.client)}> Asignar Cliente </Dropdown.Item>
              <Dropdown.Item onClick={()=>onClick(OptionsClickOrder.seller)}> Asignar Vendedor </Dropdown.Item>
              <Dropdown.Item onClick={()=>onClick(OptionsClickOrder.referred)}> Asignar Referido </Dropdown.Item>
              <Dropdown.Item onClick={()=>onClick(OptionsClickOrder.delivery)}> Asignar Repartidor </Dropdown.Item>
              <Dropdown.Item onClick={()=>onClick(OptionsClickOrder.special)}> Venta Especial </Dropdown.Item>
              <Dropdown.Item onClick={()=>onClick(OptionsClickOrder.documentType)}> Tipo de Documento </Dropdown.Item>
            </Dropdown>
            
            <Button color="blue" gradientMonochrome="info" onClick={()=>onClick(2)}>
              <AiFillSave className='mr-1' /> Guardar
            </Button>
            <Button color="green" gradientMonochrome="success" onClick={()=>onClick(1)}>
               <FaRegMoneyBillAlt className='mr-1' /> Cobrar
            </Button>
            <Button color="red" gradientMonochrome="failure" onClick={()=>onClick(3)}>
               <GiCancel className='mr-1' /> Cancelar
            </Button>
            </Button.Group>
           </div>
            
    </div>);
}
