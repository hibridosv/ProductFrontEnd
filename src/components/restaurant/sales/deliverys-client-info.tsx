"use client";
import { Button, Preset } from "@/components/button/button";
import Image from "next/image";
import { BiEdit } from "react-icons/bi";
import { GoEye } from "react-icons/go";

export interface DeliveryClientInfoProps {
  isShow?: boolean;
  onClick: (option: any) => void;
  deliveryInfo: any
}

export function DeliveryClientInfo(props: DeliveryClientInfoProps) {
    const { isShow, onClick, deliveryInfo} = props;

      if (!isShow ) return <></>

      return (
        <div className="m-2">
            <div className="w-full px-2 clickeable">
                <div className="flex border rounded-full shadow-md">
                    <div className="rounded-full drop-shadow-lg shadow-lg">
                        <Image src="/img/delivery.jpg" alt="Delivery" width={60} height={60} className="rounded-full" />
                    </div>
                    <div>
                        <div className="mx-4 font-bold flex" title="Ver información" ><GoEye className="mt-1 mr-2 clickeable" color="green" /> { deliveryInfo?.name }</div>
                        <div className="flex justify-between mx-4">
                            <div><span className=" font-medium">Dirección: </span>{ deliveryInfo?.address }</div>
                            <div className="flex"><span className="font-medium mr-1">Telefono: </span> { deliveryInfo?.phone }<BiEdit className="clickeable mt-1 ml-2 " color="green" /></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
  );

}
