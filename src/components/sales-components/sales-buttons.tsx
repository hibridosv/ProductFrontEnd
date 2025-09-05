'use client';
import { OptionsClickOrder, PresetTheme } from '@/services/enums';
import { Tooltip } from 'flowbite-react';
import { AiFillSave } from 'react-icons/ai';
import { FaRegMoneyBillAlt } from 'react-icons/fa';
import { GiCancel } from 'react-icons/gi';
import { IoMdOptions } from 'react-icons/io';
import { Alert } from '../alert/alert';
import { requiredFieldsCCF, requiredFieldsFactura, validateInvoiceFields, validateInvoiceFieldsCount } from '@/utils/validator-functions';
import { DeleteModal } from '../modals/delete-modal';
import { useState } from 'react';

export interface SalesButtonsProps {
  onClick: (option: number) => void;
  cashDrawer?: boolean;
  config: string[];
  invoice?: any;
  order?: any;
}

export function SalesButtons(props: SalesButtonsProps) {
  const {onClick, cashDrawer, config, invoice, order } = props
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const isDiscount = config.includes("sales-discount");
  const isOtherSeller = config.includes("sales-other-seller");
  const isReferred = config.includes("sales-referred");
  const isDelivery = config.includes("sales-delivery-man");
  const isOtherSales = config.includes("sales-other-sales");
  const isSpecial = config.includes("sales-special");
  const isComment = config.includes("sales-comment");

  //const validateFields = ()=>{
  //  if (invoice?.client_id && (invoice?.invoice_assigned?.type == 2 || invoice?.invoice_assigned?.type == 3)) {
  //    return validateInvoiceFields(invoice?.client, invoice?.invoice_assigned?.type == 2 ? requiredFieldsFactura : requiredFieldsCCF) 
  //  }
  // }

  if(!order) return null;

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
                { isDiscount && 
                <div className='button-options-sales' onClick={()=>onClick(OptionsClickOrder.discount)}>  Agregar Descuento</div>}
                <div className='button-options-sales' onClick={()=>onClick(OptionsClickOrder.client)}> Asignar Cliente</div>
                { isOtherSeller && 
                <div className='button-options-sales' onClick={()=>onClick(OptionsClickOrder.seller)}>Asignar Vendedor</div>}
                { isReferred && 
                <div className='button-options-sales' onClick={()=>onClick(OptionsClickOrder.referred)}> Asignar Referido</div>}
                { isDelivery && 
                <div className='button-options-sales' onClick={()=>onClick(OptionsClickOrder.delivery)}> Asignar Repartidor </div>}
                { isOtherSales && 
                <div className='button-options-sales' onClick={()=>onClick(OptionsClickOrder.otrasVentas)}> Otras Ventas</div>}
                { isSpecial && 
                <div className='button-options-sales' onClick={()=>onClick(OptionsClickOrder.ventaSpecial)}> Venta Especial </div>}
                { isComment && 
                <div className='button-options-sales' onClick={()=>onClick(OptionsClickOrder.comment)}> Agregar comentario </div>}
                <div className='button-options-sales' onClick={()=>onClick(OptionsClickOrder.documentType)}> Tipo de Documento </div>
                <div className='button-options-sales' onClick={()=>onClick(OptionsClickOrder.quotes)}> Guardar como Cotización</div>
                <div className='button-options-sales' onClick={()=>onClick(OptionsClickOrder.remission)}> Crear Nota de Remisión</div>
                <div className='button-options-sales' onClick={()=>onClick(OptionsClickOrder.renta)}> Agregar Retención Renta</div>
                </div>
              } style="light" >
                <div className='button-left-grey clickeable'><IoMdOptions className='mr-1' /> Opciones</div>
            </Tooltip>
            
              <div className='button-cyan clickeable' onClick={()=>onClick(2)}> <AiFillSave className='mr-1' /> Guardar </div>
              <div className={`button-lime ${payDisabled ? 'cursor-not-allowed' : 'clickeable'}`} onClick={payDisabled ? ()=>{} : ()=>onClick(1)}> <FaRegMoneyBillAlt className='mr-1' /> Cobrar </div>
              <div className='button-red rounded-r-lg clickeable' onClick={()=>setShowDeleteModal(true)}><GiCancel className='mr-1' /> Cancelar </div>
           </div>
          <DeleteModal isShow={showDeleteModal}
            title="Eliminar Orden"
            text="¿Estas seguro de anular esta orden?"
            onDelete={()=>{
              setShowDeleteModal(false)
              onClick(3); 
            }} 
            onClose={()=>setShowDeleteModal(false)} />
    </div>);
}
