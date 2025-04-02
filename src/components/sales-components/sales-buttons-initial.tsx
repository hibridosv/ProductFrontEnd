'use client';
import { OptionsClickOrder } from '@/services/enums';
import { MdMoney, MdOutlinePointOfSale } from 'react-icons/md';

export interface SalesButtonsInitialProps {
  onClick: (option: number) => void;
  isShow?: boolean;
  config: string[];
}

export function SalesButtonsInitial(props: SalesButtonsInitialProps) {
  const {onClick, isShow, config } = props
  const isOtherSales = config.includes("sales-other-sales");
  const isSpecial = config.includes("sales-special");


    if (!isShow) return <></>;

  return (
            <div className="flex justify-center space-x-4 mt-4 ">
              { isOtherSales && 
              <MdOutlinePointOfSale className="clickeable text-lime-500 shadow-md" size={24} title="Otras Ventas" onClick={()=>onClick(OptionsClickOrder.otrasVentas)} /> 
              }
              { isSpecial && 
              <MdMoney className="clickeable text-teal-500 shadow-md" size={24} title="Ventas Especiales" onClick={()=>onClick(OptionsClickOrder.ventaSpecial)} />
              }
            </div>
            );
}
