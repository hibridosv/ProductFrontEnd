'use client'
import { useState } from "react";
import { Alert as Alerta } from "flowbite-react";


interface AlertProps {
    type?: string;
    info?: string;
    text: string;
    isDismisible?: boolean;
  }

export function Alert(props: AlertProps){
  const { type = 'info', info, text, isDismisible = true } = props;
  const [isOpen, setIsOpen] = useState(true);

    return(
        <div>
        { isOpen && <Alerta 
        color={type}
        withBorderAccent={true}
        onDismiss={isDismisible ? () => setIsOpen(false) : false}
        >
            <span>
                <span className="font-medium">
                {info}
                </span>
                {' '}{text}
            </span>
        </Alerta>}
        </div>
    );
}