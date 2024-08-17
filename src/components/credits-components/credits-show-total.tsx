'use client'
import { numberToMoney } from "@/utils/functions";
import { ConfigContext } from "@/contexts/config-context";
import { useContext } from "react";

export interface CreditsShowTotalProps {
 quantity: number;
 text: string;
 number?: boolean;
}

export function CreditsShowTotal(props: CreditsShowTotalProps) {
  const { quantity = 0, text, number = false } = props;
  const { systemInformation } = useContext(ConfigContext);




  return (<div className="mx-4">
    <div  className="w-full my-4 shadow-neutral-600 shadow-lg rounded-md">
      <div className="flex justify-center pt-2 font-bold">{text}</div>
      <div className="flex justify-center text-3xl mb-4 pb-4 font-bold">{ number ? quantity : numberToMoney(quantity, systemInformation)}</div>
    </div>
   </div>);
}
