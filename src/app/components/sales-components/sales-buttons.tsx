'use client';
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
            label={<Button color="gray" positionInGroup='start'><IoMdOptions className='mr-1' /> Opciones</Button>}
            inline={true}
            arrowIcon={false}>
              <Dropdown.Item onClick={()=>onClick(11)}> Agregar Descuento </Dropdown.Item>
              <Dropdown.Item onClick={()=>onClick(12)}> Asignar Credito </Dropdown.Item>
              <Dropdown.Item onClick={()=>onClick(13)}> Asignar Cliente </Dropdown.Item>
              <Dropdown.Item onClick={()=>onClick(14)}> Asignar Vendedor </Dropdown.Item>
              <Dropdown.Item onClick={()=>onClick(15)}> Asignar Referido </Dropdown.Item>
              <Dropdown.Item onClick={()=>onClick(15)}> Asignar Repartidor </Dropdown.Item>
              <Dropdown.Item onClick={()=>onClick(17)}> Venta Especial </Dropdown.Item>
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
