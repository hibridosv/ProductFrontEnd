'use client';
import { OptionsClickOrder, PaymentType, PresetTheme } from '@/services/enums';
import { Tooltip } from 'flowbite-react';
import { AiFillSave } from 'react-icons/ai';
import { FaRegMoneyBillAlt } from 'react-icons/fa';
import { IoMdOptions } from 'react-icons/io';
import { style } from '@/theme';
import { useForm } from 'react-hook-form';
import { useContext, useEffect, useState } from 'react';
import { countSendPrintZero, getCountryProperty, sumarCantidad } from '@/utils/functions';
import { Alert } from '@/components/alert/alert';
import Keyboard from 'react-simple-keyboard';
import 'react-simple-keyboard/build/css/index.css';
import { ConfigContext } from '@/contexts/config-context';


export interface SalesButtonsRestaurantProps {
    onClickOrder: (option: OptionsClickOrder)=>void
    order?: any;
    payOrder: (cash: number) => void
    payType: PaymentType;
    config: string[];
    isSending:boolean;
    cashDrawer?: boolean;
    selectType: number;
    isShow?: boolean;
}

export function SalesButtonsRestaurant(props: SalesButtonsRestaurantProps) {
  const {onClickOrder, order, payOrder, payType, config, isSending, cashDrawer, selectType, isShow } = props
  const { register, handleSubmit, reset, setFocus, setValue } = useForm();
  const [input, setInput] = useState('');
  const [keyboard, setKeyboard] = useState<any>(null);
  const [showInput, setShowInput] = useState<boolean>(false);
  const { systemInformation } = useContext(ConfigContext);
  const total = sumarCantidad(order?.invoiceproducts);
  const blockMaxQuantityWithOutNit = systemInformation?.system?.country == 3 && total >= 2500 && !order?.client_id;

  useEffect(() => {
    if (payType == 1 && config.includes("input-sales-focus")) {
        setFocus('cash')
    }
  }, [setFocus, order, payType, config])

  
const onSubmit =(data: any)=> {
    payOrder(data.cash)
    reset(); // Resetea el estado del formulario en react-hook-form
    if (config.includes("input-sales-keyboard")) {
        setInput(''); // Resetea el estado del input
        if (keyboard) {
            keyboard.clearInput(); // Resetea el teclado virtual
        }
        setShowInput(false)
    }
}



//////keyboard
const handleKeyboardChange = (inputValue: string) => {
    // Actualiza el estado del campo de entrada y el valor en react-hook-form
    setInput(inputValue);
    setValue('cash', inputValue, { shouldValidate: true });
  };

  const handleKeyPress = (button: string) => {
    if (button === '{bksp}') {
      handleKeyboardChange(input.slice(0, -1));
    } else if (button === '.') {
      // Solo agrega el punto si no existe ya uno en el input
      if (!input.includes('.')) {
        handleKeyboardChange(input + button);
      }
    } else if (button === '{submit}') {
      handleSubmit(onSubmit)();
    } else {
      handleKeyboardChange(input + button);
    }
  };
//////// termina keyboard

if (!isShow) return <></>

  return (
    <div className="border rounded-md shadow-md m-2">
        { !cashDrawer && <Alert
          theme={PresetTheme.danger}
          info="Error"
          text="Debe seleccionar una caja para poder cobrar"
          isDismisible={false}
          className='my-1'
          /> }

          { blockMaxQuantityWithOutNit && <Alert
          theme={PresetTheme.info}
          info="Importante: "
          text="Debe ingresar un NIT para realizar esta venta"
          isDismisible={false}
          className='my-1'
          /> }

        <form onSubmit={handleSubmit(onSubmit)} className="w-full">
        { payType == 1 && <>
        { config.includes("input-sales-keyboard") ? <>
        { showInput &&
        <Keyboard inputName='cash' display={{'{bksp}': '<'}} layout={{ default: ["1 2 3", "4 5 6", "7 8 9", ". 0 {bksp}"] }}  onKeyPress={handleKeyPress} keyboardRef={r => setKeyboard(r)}/> }
        <div onClick={()=>setShowInput(!showInput)} className='clickeable p-1'>
            <input className={style.inputDisable} type="text" {...register('cash')} value={input} placeholder="Ingrese una cantidad" readOnly />
        </div>
        </> :
        <input type="number" step="any" min={0} readOnly={isSending} className={style.input} placeholder='Ingrese una cantidad' {...register("cash")} />
        }
        </>}
        <div className='flex justify-center'>
                <Tooltip animation="duration-300" content={
                    <div className="">
                    { config.includes("sales-discount") && 
                    <div className='font-semibold text-slate-700 py-2 px-4 hover:bg-slate-100 clickeable' onClick={isSending ? ()=>{} : ()=>onClickOrder(OptionsClickOrder.discount)}>  Agregar Descuento</div>}
                    <div className='font-semibold text-slate-700 py-2 px-4 hover:bg-slate-100 clickeable' onClick={isSending ? ()=>{} : ()=>onClickOrder(OptionsClickOrder.client)}> Asignar Cliente</div>

                    { config.includes("sales-other-seller") && 
                    <div className='font-semibold text-slate-700 py-2 px-4 hover:bg-slate-100 clickeable' onClick={isSending ? ()=>{} : ()=>onClickOrder(OptionsClickOrder.seller)}>Asignar Vendedor</div>}
                    { config.includes("sales-referred") && 
                    <div className='font-semibold text-slate-700 py-2 px-4 hover:bg-slate-100 clickeable' onClick={isSending ? ()=>{} : ()=>onClickOrder(OptionsClickOrder.referred)}> Asignar Referido</div>}
                    { config.includes("sales-delivery-man") && 
                    <div className='font-semibold text-slate-700 py-2 px-4 hover:bg-slate-100 clickeable' onClick={isSending ? ()=>{} : ()=>onClickOrder(OptionsClickOrder.delivery)}> Asignar Repartidor </div>}
                    { config.includes("sales-other-sales") && 
                    <div className='font-semibold text-slate-700 py-2 px-4 hover:bg-slate-100 clickeable' onClick={isSending ? ()=>{} : ()=>onClickOrder(OptionsClickOrder.otrasVentas)}> Otras Ventas</div>}
                    <div className='font-semibold text-slate-700 py-2 px-4 hover:bg-slate-100 clickeable' onClick={isSending ? ()=>{} : ()=>onClickOrder(OptionsClickOrder.documentType)}> Tipo de Documento </div>
                    { config.includes("sales-comment") && 
                    <div className='font-semibold text-slate-700 py-2 px-4 hover:bg-slate-100 clickeable' onClick={isSending ? ()=>{} : ()=>onClickOrder(OptionsClickOrder.comment)}> Agregar comentario </div>}
                    { config.includes("sales-special") && 
                    <div className='font-semibold text-slate-700 py-2 px-4 hover:bg-slate-100 clickeable' onClick={isSending ? ()=>{} : ()=>onClickOrder(OptionsClickOrder.ventaSpecial)}> Venta Especial </div>}
                    <div className='font-semibold text-slate-700 py-2 px-4 hover:bg-slate-100 clickeable' onClick={()=>{}}> Imprimir pre cuenta</div>
                    { selectType == 2 &&
                      <div className='font-semibold text-slate-700 py-2 px-4 hover:bg-slate-100 clickeable' onClick={isSending ? ()=>{} : ()=>onClickOrder(OptionsClickOrder.addClientTable)}> Agregar cliente a la mesa</div>}
                    { selectType == 2 &&
                      <div className='font-semibold text-slate-700 py-2 px-4 hover:bg-slate-100 clickeable' onClick={isSending ? ()=>{} : ()=>onClickOrder(OptionsClickOrder.divideAccount)}> Dividir Cuenta</div>}
                    { systemInformation?.system?.country == 3 &&
                    <div className='font-semibold text-slate-700 py-2 px-4 hover:bg-slate-100 clickeable' onClick={isSending ? ()=>{} : ()=>onClickOrder(OptionsClickOrder.sendNit)}> Buscar por NIT</div> }
                    </div>
                } style="light" >
                    <div className='button-grey clickeable w-4/10'><IoMdOptions className='mr-1' /> Opciones</div>
                </Tooltip>
            <div className='button-lime clickeable w-2/10 relative' title='Guardar' onClick={isSending ? ()=>{} : () => onClickOrder(OptionsClickOrder.setPrinter)} >
                <AiFillSave size={24} className='mr-1' />
                { countSendPrintZero(order) != 0 &&
                    <span className="absolute top-0 right-0 flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
                    </span>
                }
            </div>

            { payType == 1 ?
            <button disabled={isSending || !cashDrawer || blockMaxQuantityWithOutNit} type='submit'  className='button-cyan clickeable w-full'><FaRegMoneyBillAlt className='mr-1' /> Cobrar</button>
            : 
            <div className='button-cyan clickeable w-full' title='Cobrar' onClick={(isSending || !cashDrawer || blockMaxQuantityWithOutNit) ? ()=>{} : ()=>payOrder(0)}><FaRegMoneyBillAlt className='mr-1' /> Cobrar</div>
            }
        </div>
        </form>
    </div>);
}
