'use client';
import { OptionsClickOrder, PresetTheme } from '@/services/enums';
import { Button, Dropdown } from 'flowbite-react';
import { AiFillSave } from 'react-icons/ai';
import { FaRegMoneyBillAlt } from 'react-icons/fa';
import { GiCancel } from 'react-icons/gi';
import { IoMdOptions } from 'react-icons/io';
import { Alert } from '../alert/alert';

export interface SalesButtonsProps {
  onClick: (option: number) => void;
  cashDrawer?: boolean;
  config: string[];
  invoice?: any;
}

export function SalesButtons(props: SalesButtonsProps) {
  const {onClick, cashDrawer, config, invoice } = props



  return (<div>
          { !cashDrawer && <Alert
          theme={PresetTheme.danger}
          info="Error"
          text="Debe seleccionar una caja para poder cobrar"
          isDismisible={false}
          className='my-1'
          /> }

        { (!invoice?.client_id && invoice?.invoice_assigned?.type == 3) && <Alert
          theme={PresetTheme.danger}
          info="Error"
          text="Seleccione un cliente para el CCF"
          isDismisible={false}
          className='my-1'
          /> }
           <div>
            <Button.Group>
            <Dropdown
            label={<div className='button-left-grey'><IoMdOptions className='mr-1' /> Opciones</div>}
            inline={true}
            arrowIcon={false}>
              { config.includes("sales-discount") && 
              <Dropdown.Item onClick={()=>onClick(OptionsClickOrder.discount)}> Agregar Descuento </Dropdown.Item>}
              <Dropdown.Item onClick={()=>onClick(OptionsClickOrder.client)}> Asignar Cliente </Dropdown.Item>
              { config.includes("sales-other-seller") && 
              <Dropdown.Item onClick={()=>onClick(OptionsClickOrder.seller)}> Asignar Vendedor </Dropdown.Item>}
              { config.includes("sales-referred") && 
              <Dropdown.Item onClick={()=>onClick(OptionsClickOrder.referred)}> Asignar Referido </Dropdown.Item>}
              { config.includes("sales-delivery-man") && 
              <Dropdown.Item onClick={()=>onClick(OptionsClickOrder.delivery)}> Asignar Repartidor </Dropdown.Item>}
              { config.includes("sales-other-sales") && 
              <Dropdown.Item onClick={()=>onClick(OptionsClickOrder.special)}> Venta Especial </Dropdown.Item>}
              { config.includes("sales-comment") && 
              <Dropdown.Item onClick={()=>onClick(OptionsClickOrder.comment)}> Agregar comentario </Dropdown.Item>}
              <Dropdown.Item onClick={()=>onClick(OptionsClickOrder.documentType)}> Tipo de Documento </Dropdown.Item>
            </Dropdown>
            <Button color="blue" gradientMonochrome="info" onClick={()=>onClick(2)}>
              <AiFillSave className='mr-1' /> Guardar </Button>
            <Button color="green" gradientMonochrome="success" 
                              disabled={!cashDrawer || (!invoice?.client_id && invoice?.invoice_assigned?.type == 3)} 
                              onClick={()=>onClick(1)}>
               <FaRegMoneyBillAlt className='mr-1' /> Cobrar </Button>
            <Button color="red" gradientMonochrome="failure" onClick={()=>onClick(3)}>
               <GiCancel className='mr-1' /> Cancelar </Button>
            </Button.Group>
           </div>
            
    </div>);
}
