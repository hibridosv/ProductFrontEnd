"use client";
import { Button, Preset } from "@/components/button/button";

export interface DeliveryCancelBtnProps {
  isShow?: boolean;
  onClick: (option: any) => void;
}

export function DeliveryCancelBtn(props: DeliveryCancelBtnProps) {
    const { isShow, onClick} = props;

      if (!isShow ) return <></>

      return (
        <div className="m-2">
            <Button preset={Preset.cancel} text="Cancelar Delivery" isFull onClick={()=>onClick([])} />
        </div>
  );

}
