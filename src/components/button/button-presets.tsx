import { AiFillPrinter, AiFillSave, AiOutlineClose, AiOutlineSend } from "react-icons/ai"
import { GiCancel } from "react-icons/gi"
import { RiCheckDoubleFill } from "react-icons/ri"
import { ImSpinner5 } from "react-icons/im"
import { AiOutlineCloseCircle, AiOutlinePlusCircle, AiOutlineMinusCircle } from "react-icons/ai"
import { IoMdAddCircle } from "react-icons/io"
import { FaInfoCircle } from "react-icons/fa";

/**
 * All text will start off looking like this.
 */
const BASE = "py-2 px-4 flex justify-center items-center text-white transition ease-in duration-200 text-center text-base font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2  rounded-lg";



export const textPresets = {
  primary: null,
  danger: null,

  close: "Cerrar",
  cancel: "Cancelar",
  save: "Guardar",
  accept: "Aceptar",
  add: "Agregar",
  send: "Enviar",
  saving: "Guardando",
  smallClose: "",
  smallCloseDisable: "",
  smallPlus: "",
  smallPlusDisable: "",
  smallMinus: "",
  smallMinusDisable: "",
  smallInfo: "",
  smallPrint: "",
  smallPrintDisable: "",
}


export const stylePresets = {
    primary: `${BASE} bg-blue-600 hover:bg-blue-700 focus:ring-blue-500 focus:ring-offset-blue-200`,
    danger: `${BASE} bg-red-600 hover:bg-red-700 focus:ring-red-500 focus:ring-offset-red-200`,
  
    close: `${BASE} bg-red-600 hover:bg-red-700 focus:ring-red-500 focus:ring-offset-red-200`,
    cancel: `${BASE} bg-red-600 hover:bg-red-700 focus:ring-red-500 focus:ring-offset-red-200`,
    save: `${BASE} bg-zinc-600 hover:bg-zinc-700 focus:ring-zinc-500 focus:ring-offset-zinc-200`,
    accept: `${BASE} bg-cyan-600 hover:bg-cyan-700 focus:ring-cyan-500 focus:ring-offset-cyan-200`,
    add: `px-2 py-1 flex justify-center items-center text-white transition ease-in duration-200 text-center text-base font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2  rounded-lg bg-sky-600 hover:bg-sky-700 focus:ring-sky-500 focus:ring-offset-sky-200`,
    send: `${BASE} bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500 focus:ring-offset-indigo-200`,
    saving: `${BASE} bg-slate-600 hover:bg-slate-700 focus:ring-slate-500 focus:ring-offset-slate-200`,
    smallClose: `transition ease-in duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 clickeable`,
    smallCloseDisable: `transition ease-in duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2`,
    smallPlus: `transition ease-in duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 clickeable`,
    smallPlusDisable: `transition ease-in duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2`,
    smallMinus: `transition ease-in duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 clickeable`,
    smallMinusDisable: `transition ease-in duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2`,
    smallInfo: `transition ease-in duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2`,
    smallPrint: `transition ease-in duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 clickeable`,
    smallPrintDisable: `transition ease-in duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2`,
  }

export const iconPresets = {
    primary: "",
    danger: "",
  
    close: <AiOutlineClose className="mr-3" />,
    cancel: <GiCancel className="mr-3" />,
    save: <AiFillSave className="mr-3"/>,
    accept: <RiCheckDoubleFill className="mr-3"/>,
    add: <IoMdAddCircle className="mr-3"/>,
    send: <AiOutlineSend className="mr-3"/>,
    saving: <ImSpinner5 className="-p-4 mr-3 animate-spin" />,
    smallClose: <AiOutlineCloseCircle color="red" size={25} />,
    smallCloseDisable: <AiOutlineCloseCircle color="grey" size={25} />,
    smallPlus: <AiOutlinePlusCircle color="green" size={25} />,
    smallPlusDisable: <AiOutlinePlusCircle color="grey" size={25} />,
    smallMinus: <AiOutlineMinusCircle color="green" size={25} />,
    smallMinusDisable: <AiOutlineMinusCircle color="grey" size={25} />,
    smallInfo: <FaInfoCircle color="#5DADE2" size={23} />,
    smallPrint: <AiFillPrinter color="#2FA0B9" size={25} />,
    smallPrintDisable: <AiFillPrinter color="grey" size={25} />,
  }