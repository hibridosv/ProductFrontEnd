import { AiFillSave, AiOutlineClose, AiOutlineSend } from "react-icons/ai"
import { GiCancel } from "react-icons/gi"
import { RiCheckDoubleFill } from "react-icons/ri"

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
  send: "Enviar",
}


export const stylePresets = {
    primary: `${BASE} bg-blue-600 hover:bg-blue-700 focus:ring-blue-500 focus:ring-offset-blue-200`,
    danger: `${BASE} bg-red-600 hover:bg-red-700 focus:ring-red-500 focus:ring-offset-red-200`,
  
    close: `${BASE} bg-red-600 hover:bg-red-700 focus:ring-red-500 focus:ring-offset-red-200`,
    cancel: `${BASE} bg-red-600 hover:bg-red-700 focus:ring-red-500 focus:ring-offset-red-200`,
    save: `${BASE} bg-zinc-600 hover:bg-zinc-700 focus:ring-zinc-500 focus:ring-offset-zinc-200`,
    accept: `${BASE} bg-cyan-600 hover:bg-cyan-700 focus:ring-cyan-500 focus:ring-offset-cyan-200`,
    send: `${BASE} bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500 focus:ring-offset-indigo-200`,
  }

export const iconPresets = {
    primary: "",
    danger: "",
  
    close: <AiOutlineClose className="mr-3" />,
    cancel: <GiCancel className="mr-3" />,
    save: <AiFillSave className="mr-3"/>,
    accept: <RiCheckDoubleFill className="mr-3"/>,
    send: <AiOutlineSend className="mr-3"/>,
  }