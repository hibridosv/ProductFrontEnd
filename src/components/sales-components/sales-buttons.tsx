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
  let payDisabled = !cashDrawer || (!invoice?.client_id && invoice?.invoice_assigned?.type == 3) || fieldsRequired && fieldsRequired.length > 0;

  return (<div>
          { !cashDrawer && <Alert
          theme={PresetTheme.danger}
          info="Error"
          text="Debe seleccionar una caja para poder cobrar"
          isDismisible={false}
          className='my-1'
          /> }

        { (!invoice?.client_id && (invoice?.invoice_assigned?.type == 3 || invoice?.invoice_assigned?.type == 4)) && <Alert
          theme={PresetTheme.danger}
          info="Error"
          text={`Seleccione un cliente para el ${invoice?.invoice_assigned?.type == 3 ? "CCF" : "Sujeto Excluido"}`}
          isDismisible={false}
          className='my-1'
          /> }

        { fieldsRequired && fieldsRequired.length > 0 && 
          <div>Faltan los siguientes campos del cliente para facturar: <div className="text-red-500">{`${fieldsRequired.join(', ')}.`}</div></div> 
        }
           <div className='flex'>
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
                <div className='w-full font-semibold text-slate-700 py-2 px-4 hover:bg-slate-100 clickeable' onClick={()=>onClick(OptionsClickOrder.otrasVentas)}> Otras Ventas</div>}
                { config.includes("sales-special") && 
                    <div className='font-semibold text-slate-700 py-2 px-4 hover:bg-slate-100 clickeable' onClick={()=>onClick(OptionsClickOrder.ventaSpecial)}> Venta Especial </div>}
                { config.includes("sales-comment") && 
                <div className='w-full font-semibold text-slate-700 py-2 px-4 hover:bg-slate-100 clickeable' onClick={()=>onClick(OptionsClickOrder.comment)}> Agregar comentario </div>}
                <div className='w-full font-semibold text-slate-700 py-2 px-4 hover:bg-slate-100 clickeable' onClick={()=>onClick(OptionsClickOrder.documentType)}> Tipo de Documento </div>
                <div className='w-full font-semibold text-slate-700 py-2 px-4 hover:bg-slate-100 clickeable' onClick={()=>onClick(OptionsClickOrder.quotes)}> Guardar como Cotización</div>
                </div>
              } style="light" >
                <div className='button-left-grey clickeable'><IoMdOptions className='mr-1' /> Opciones</div>
            </Tooltip>
            
              <div className='button-cyan clickeable' onClick={()=>onClick(2)}> <AiFillSave className='mr-1' /> Guardar </div>
              <div className={`button-lime ${payDisabled ? 'cursor-not-allowed' : 'clickeable'}`} onClick={payDisabled ? ()=>{} : ()=>onClick(1)}> <FaRegMoneyBillAlt className='mr-1' /> Cobrar </div>
              <div className='button-red rounded-r-lg clickeable' onClick={()=>onClick(3)}><GiCancel className='mr-1' /> Cancelar </div>
           </div>
            
    </div>);
}
