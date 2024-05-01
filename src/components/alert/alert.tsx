'use client'
import { useState } from "react";
import { CloseIcon } from "@/theme/svg";
import { PresetTheme } from "@/services/enums";


interface AlertProps {
    theme?: PresetTheme;
    info?: string;
    text: string;
    isDismisible?: boolean;
    className?: string;
  }


export const stylePresets = {
    primary: `px-2 rounded-md border-t-2  w-full bg-cyan-300 text-cyan-900 border-cyan-900`,
    danger: `px-2 rounded-md border-t-2  w-full bg-red-300 text-red-900 border-red-900`,
    success: `px-2 rounded-md border-t-2  w-full bg-green-300 text-green-900 border-green-900`,
    info: `px-2 rounded-md border-t-2  w-full bg-blue-300 text-blue-900 border-blue-900`,
    warning: `px-2 rounded-md border-t-2  w-full bg-orange-300 text-orange-900 border-orange-900`,
  }

export function Alert(props: AlertProps){
  const { theme = PresetTheme.danger, info, text, isDismisible = true, className } = props;
  const [isOpen, setIsOpen] = useState(true);

  const textStyle = stylePresets[theme];
    return(
        <div className={className}>
        { isOpen && 
        <div className={textStyle}>
           <div className="flex justify-between">
            <div>{info && <span className="font-medium mr-2">{info}</span>}
               <span className="text-center font-normal bg">{text}</span></div>
               { isDismisible && 
              <span className="ml-2 cursor-pointer my-1 text-end" 
               onClick={isDismisible ? () => setIsOpen(false) : ()=> {}}>{ CloseIcon }</span>
              }
           </div>
        </div>
        }
        </div>
    );
}