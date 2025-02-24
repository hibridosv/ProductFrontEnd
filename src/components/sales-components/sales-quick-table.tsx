'use client'
import { getTotalPercentage, numberToMoney, sumarDiscount, sumarTotales } from "@/utils/functions";
import { NothingHere } from "../nothing-here/nothing-here";
import { Button, Preset } from "../button/button";
import { ConfigContext } from "@/contexts/config-context";
import { useContext } from "react";
import { RequestCodeModal } from "../common/request-code-modal";
import { useCodeRequest } from "@/hooks/useCodeRequest";
import { IoMdLock, IoMdUnlock } from "react-icons/io";
import { FaPen, FaPenAlt } from "react-icons/fa";




interface SalesQuickProps {
  records?:  any;
  onClick: (product: any, option: OptionsClickSales) => void;
  config: string[];
}

export enum OptionsClickSales {
  delete = 1,
  plus = 2,
  minus = 3,
  quantity = 4,
  discount = 5,
  commisssion = 6,
  productView = 7,
  price = 8,
  changeName = 9,
  selectClient = 10, // asignar cliente al producto para ventas divididas
  changeComment = 11,
}


export function SalesQuickTable(props: SalesQuickProps) {
  const { records, onClick, config } = props;
  const { systemInformation } = useContext(ConfigContext);
  const { codeRequestPice, 
    verifiedCode, 
    isRequestCodeModal, 
    setIsRequestCodeModal, 
    isShowError, 
    setIsShowError } = useCodeRequest('code-request-change-price', false);

    
  if (!records) return <NothingHere width="164" height="98" text="Agregue un producto" />;
  if (records.length == 0) return <NothingHere text="Agregue un producto" width="164" height="98" />;

  const listItems = records.map((record: any) => (
    <tr key={record.id} className="bg-white border-b text-slate-950 font-semibold" >
       { record.cod == 9999999999 ?
      <td className="py-1 px-2"> { record.quantity } </td> :
      <td className="py-1 px-2 cursor-pointer" onClick={()=> onClick(record, OptionsClickSales.quantity)}> { record.quantity } </td> }
      {config.includes("sales-show-code") &&
      <td className="py-1 px-2">{ record.cod }</td>
      }
      <td className="py-1 px-2 truncate uppercase">
        <div className="flex justify-between" >
          <span className="clickeable w-full" onClick={()=> onClick(record, OptionsClickSales.productView)}>{ record.product.slice(0, 50) }</span>
          {config.includes("sales-change-name") && <span title="Cambiar Nombre del producto" className="ml-2 mt-1 clickeable" 
          onClick={()=> onClick(record, OptionsClickSales.changeName)}><FaPen color="black" /></span> }
          {config.includes("sales-change-comment") && <span title={record?.comment ?? "Sin comentarios"} className="ml-2 mt-1 clickeable" 
          onClick={()=> onClick(record, OptionsClickSales.changeComment)}><FaPen color={record.comment ? 'green' : 'black'} /></span> }
        </div>
      </td>
      <td className="py-1 px-2  cursor-pointer" onClick={codeRequestPice.requestPrice && codeRequestPice.required ?
         ()=> setIsRequestCodeModal(true) : 
         ()=> onClick(record, OptionsClickSales.price)}>
        { numberToMoney(record.unit_price ? record.unit_price : 0, systemInformation) }
      </td>
      {
        config.includes("sales-discount") ?
        <td className="py-1 px-2 truncate cursor-pointer" onClick={()=> onClick(record, OptionsClickSales.discount)}>
        { numberToMoney(record.discount ? record.discount : 0, systemInformation) }</td>
        :
        <td className="py-1 px-2 truncate" >
        { numberToMoney(record.discount ? record.discount : 0, systemInformation) }</td>
      }
      {config.includes("product-default-commission") &&
      <td className="py-1 px-2 clickeable" onClick={()=> onClick(record, OptionsClickSales.commisssion)}>{ record.commission ? record.commission : 0 } % -  { numberToMoney(getTotalPercentage(record?.subtotal, record?.commission), systemInformation) }</td>
      }
      <td className="py-1 px-2 truncate">{ numberToMoney(record.total ? record.total : 0, systemInformation) }</td>
      <td className="py-1 px-2">
      { record.cod == 9999999999 ? <Button preset={Preset.smallMinusDisable} noText /> : <Button preset={Preset.smallMinus} noText onClick={()=> onClick(record, OptionsClickSales.minus)} /> }
      { record.cod == 9999999999 ? <Button preset={Preset.smallPlusDisable} noText /> : <Button preset={Preset.smallPlus} noText onClick={()=> onClick(record, OptionsClickSales.plus)} /> }
      </td>
      <td className="py-1 px-2"><Button preset={Preset.smallClose} noText onClick={()=> onClick(record, OptionsClickSales.delete)} /></td>
    </tr>
  ));

  const commissionTotal = (records: any)=>{
    let commission = 0;
        records.forEach((element: any) => {
          let comissionPercentage = getTotalPercentage(element?.subtotal, element?.commission)
        commission = commission + comissionPercentage;
      });
    return commission;
  }


  return (<div>
  <div className="w-full overflow-auto">
    <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
      <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
        <tr>
          <th scope="col" className="py-2 px-2 border">Cant</th>
          {config.includes("sales-show-code") &&
          <th scope="col" className="py-2 px-2 border">Cod</th>
          }
          <th scope="col" className="py-2 px-2 border">Producto</th>
          <th scope="col" className="py-2 px-2 border">Precio</th>
          <th scope="col" className="py-2 px-2 border">Descuento</th>
          {config.includes("product-default-commission") &&
          <th scope="col" className="py-2 px-2 border">Comisión</th>
          }
          <th scope="col" className="py-2 px-2 border">Total</th>
          <th scope="col" className="py-2 px-2 border">OP</th>
          <th scope="col" className="py-2 px-2 border">Del</th>
        </tr>
      </thead>
      <tbody>{listItems}</tbody>
      <tfoot>
      <tr>
          <th scope="col"></th>
          {config.includes("sales-show-code") &&
          <th scope="col"></th>
          }
          <th scope="col"></th>
          <th scope="col"></th>
          <th scope="col" className="py-2 px-2 border">{ numberToMoney(sumarDiscount(records), systemInformation)}</th>
          {config.includes("product-default-commission") &&
          <th scope="col" className="py-2 px-2 border">{ numberToMoney(commissionTotal(records), systemInformation) }</th>
          }
          <th scope="col" className="py-2 px-2 border">{ numberToMoney(sumarTotales(records), systemInformation) }</th>
          <th scope="col"></th>
          <th scope="col"></th>
        </tr>
      </tfoot>
    </table>
 </div>

 <RequestCodeModal isShow={isRequestCodeModal}  
      onClose={()=>setIsRequestCodeModal(false)} 
      verifiedCode={verifiedCode} 
      isShowError={isShowError} 
      setIsShowError={()=>setIsShowError(false)} />

 </div>);
}
