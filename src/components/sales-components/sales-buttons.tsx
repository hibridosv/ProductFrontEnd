'use client';
import { OptionsClickOrder, PresetTheme } from '@/services/enums';
import { Button, Dropdown, Tooltip } from 'flowbite-react';
import { AiFillSave } from 'react-icons/ai';
import { FaRegMoneyBillAlt } from 'react-icons/fa';
import { GiCancel } from 'react-icons/gi';
import { IoMdOptions } from 'react-icons/io';
import { Alert } from '../alert/alert';
import { requiredFieldsCCF, requiredFieldsFactura, validateInvoiceFields, validateInvoiceFieldsCount } from '@/utils/validator-functions';

export interface SalesButtonsProps {
  onClick: (option: number) => void;
  cashDrawer?: boolean;
  config: string[];
  invoice?: any;
}

export function SalesButtons(props: SalesButtonsProps) {
  const {onClick, cashDrawer, config, invoice } = props


  //const validateFields = ()=>{
  //  if (invoice?.client_id && (invoice?.invoice_assigned?.type == 2 || invoice?.invoice_assigned?.type == 3)) {
  //    return validateInvoiceFields(invoice?.client, invoice?.invoice_assigned?.type == 2 ? requiredFieldsFactura : requiredFieldsCCF) 
  //  }
  // }


  const validateFields = ()=>{
    if (invoice?.client_id && invoice?.invoice_assigned?.type == 3) {
      return validateInvoiceFields(invoice?.client, requiredFieldsCCF) 
    }
  }

  let fieldsRequired = validateFields();


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

        { fieldsRequired && fieldsRequired.length > 0 && 
          <div>Faltan los siguientes campos del cliente para facturar: <div className="text-red-500">{`${fieldsRequired.join(', ')}.`}</div></div> 
        }
           <div>
            <Button.Group>
            {/* <Dropdown
                      dismissOnClick={true}
                      label={<div className='button-left-grey'><IoMdOptions className='mr-1' /> Opciones</div>}
                      inline={true}
                      floatingArrow={false}
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
              <Dropdown.Item onClick={()=>onClick(OptionsClickOrder.quotes)}> Guardar como Cotización </Dropdown.Item>
            </Dropdown> */}
            <Tooltip animation="duration-300" content={
                <div className="w-8/10">
                { config.includes("sales-discount") && 
                <div className='w-full font-semibold text-slate-700 py-2 px-4 hover:bg-slate-100 clickeable' onClick={()=>onClick(OptionsClickOrder.discount)}>  Agregar Descuento</div>}
                <div className='w-full font-semibold text-slate-700 py-2 px-4 hover:bg-slate-100 clickeable' onClick={()=>onClick(OptionsClickOrder.client)}> Asignar Cliente</div>
                { config.includes("sales-other-seller") && 
                <div className='w-full font-semibold text-slate-700 py-2 px-4 hover:bg-slate-100 clickeable' onClick={()=>onClick(OptionsClickOrder.seller)}>Asignar Vendedor</div>}
                { config.includes("sales-referred") && 
                <div className='w-full font-semibold text-slate-700 py-2 px-4 hover:bg-slate-100 clickeable' onClick={()=>onClick(OptionsClickOrder.referred)}> Asignar Referido</div>}
                { config.includes("sales-delivery-man") && 
                <div className='w-full font-semibold text-slate-700 py-2 px-4 hover:bg-slate-100 clickeable' onClick={()=>onClick(OptionsClickOrder.delivery)}> Asignar Repartidor </div>}
                { config.includes("sales-other-sales") && 
                <div className='w-full font-semibold text-slate-700 py-2 px-4 hover:bg-slate-100 clickeable' onClick={()=>onClick(OptionsClickOrder.special)}> Venta Especial</div>}
                { config.includes("sales-comment") && 
                <div className='w-full font-semibold text-slate-700 py-2 px-4 hover:bg-slate-100 clickeable' onClick={()=>onClick(OptionsClickOrder.comment)}> Agregar comentario </div>}
                <div className='w-full font-semibold text-slate-700 py-2 px-4 hover:bg-slate-100 clickeable' onClick={()=>onClick(OptionsClickOrder.documentType)}> Tipo de Documento </div>
                <div className='w-full font-semibold text-slate-700 py-2 px-4 hover:bg-slate-100 clickeable' onClick={()=>onClick(OptionsClickOrder.quotes)}> Guardar como Cotización</div>
                </div>
              } style="light" >
                <div className='button-left-grey clickeable'><IoMdOptions className='mr-1' /> Opciones</div>
            </Tooltip>
            
            <Button color="blue" gradientMonochrome="info" onClick={()=>onClick(2)}>
              <AiFillSave className='mr-1' /> Guardar </Button>
            <Button color="green" gradientMonochrome="success" 
                              disabled={!cashDrawer || (!invoice?.client_id && invoice?.invoice_assigned?.type == 3) || fieldsRequired && fieldsRequired.length > 0} 
                              onClick={()=>onClick(1)}>
               <FaRegMoneyBillAlt className='mr-1' /> Cobrar </Button>
            <Button color="red" gradientMonochrome="failure" onClick={()=>onClick(3)}>
               <GiCancel className='mr-1' /> Cancelar </Button>
            </Button.Group>
           </div>
            
    </div>);
}
