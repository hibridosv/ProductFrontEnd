'use client';
import { OptionsClickOrder, PaymentType, PresetTheme } from '@/services/enums';
import { Tooltip } from 'flowbite-react';
import { AiFillSave } from 'react-icons/ai';
import { FaRegMoneyBillAlt } from 'react-icons/fa';
import { IoMdOptions } from 'react-icons/io';
import { style } from '@/theme';
import { useForm } from 'react-hook-form';
import { useEffect } from 'react';
import { countSendPrintZero } from '@/utils/functions';

export interface SalesButtonsRestaurantProps {
    onClickOrder: (option: OptionsClickOrder)=>void
    order?: any;
    payOrder: (cash: number) => void
    payType: PaymentType;
    config: string[];
}

export function SalesButtonsRestaurant(props: SalesButtonsRestaurantProps) {
  const {onClickOrder, order, payOrder, payType, config } = props
  const { register, handleSubmit, reset, setFocus } = useForm();

  useEffect(() => {
    if (payType == 1) {
        setFocus('cash')
    }
  }, [setFocus, order, payType])

const onSubmit =(data: any)=> {
    payOrder(data.cash)
    reset()
}

if (!order?.invoiceproducts) return <></>
if (order?.invoiceproducts.length == 0) return <></>

  return (
    <div className="border rounded-md shadow-md m-2">
        <form onSubmit={handleSubmit(onSubmit)} className="w-full">
        { payType == 1 &&
        <input type="number" step="any" className={style.input} placeholder='$0.00' {...register("cash")} />
        }
        <div className='flex justify-center'>
                <Tooltip animation="duration-300" content={
                    <div className="">
                    { config.includes("sales-discount") && 
                    <div className='font-semibold text-slate-700 py-2 px-4 hover:bg-slate-100 clickeable' onClick={()=>onClickOrder(OptionsClickOrder.discount)}>  Agregar Descuento</div>}
                    <div className='font-semibold text-slate-700 py-2 px-4 hover:bg-slate-100 clickeable' onClick={()=>onClickOrder(OptionsClickOrder.client)}> Asignar Cliente</div>
                    { config.includes("sales-other-seller") && 
                    <div className='font-semibold text-slate-700 py-2 px-4 hover:bg-slate-100 clickeable' onClick={()=>onClickOrder(OptionsClickOrder.seller)}>Asignar Vendedor</div>}
                    { config.includes("sales-referred") && 
                    <div className='font-semibold text-slate-700 py-2 px-4 hover:bg-slate-100 clickeable' onClick={()=>onClickOrder(OptionsClickOrder.referred)}> Asignar Referido</div>}
                    { config.includes("sales-delivery-man") && 
                    <div className='font-semibold text-slate-700 py-2 px-4 hover:bg-slate-100 clickeable' onClick={()=>onClickOrder(OptionsClickOrder.delivery)}> Asignar Repartidor </div>}
                    { config.includes("sales-other-sales") && 
                    <div className='font-semibold text-slate-700 py-2 px-4 hover:bg-slate-100 clickeable' onClick={()=>onClickOrder(OptionsClickOrder.special)}> Venta Especial</div>}
                    <div className='font-semibold text-slate-700 py-2 px-4 hover:bg-slate-100 clickeable' onClick={()=>onClickOrder(OptionsClickOrder.documentType)}> Tipo de Documento </div>
                    { config.includes("sales-comment") && 
                    <div className='font-semibold text-slate-700 py-2 px-4 hover:bg-slate-100 clickeable' onClick={()=>onClickOrder(OptionsClickOrder.comment)}> Agregar comentario </div>}
                    
                    <div className='font-semibold text-slate-700 py-2 px-4 hover:bg-slate-100 clickeable' onClick={()=>{}}> Imprimir pre cuenta</div>
                    </div>
                } style="light" >
                    <div className='button-grey clickeable w-4/10'><IoMdOptions className='mr-1' /> Opciones</div>
                </Tooltip>
            <div className='button-lime clickeable w-2/10 relative' title='Guardar' onClick={() => onClickOrder(OptionsClickOrder.setPrinter)}>
                <AiFillSave size={24} className='mr-1' />
                { countSendPrintZero(order) != 0 &&
                    <span className="absolute top-0 right-0 flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
                    </span>
                }
            </div>

            { payType == 1 ?
            <button type='submit' className='button-cyan clickeable w-full'><FaRegMoneyBillAlt className='mr-1' /> Cobrar</button>
            : 
            <div className='button-cyan clickeable w-full' title='Cobrar' onClick={()=>payOrder(0)}><FaRegMoneyBillAlt className='mr-1' /> Cobrar</div>
            }
        </div>
        </form>
    </div>);
}
