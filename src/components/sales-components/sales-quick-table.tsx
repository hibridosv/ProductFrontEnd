'use client'
import { numberToMoney } from "@/utils/functions";
import { NothingHere } from "../nothing-here/nothing-here";
import { Button, Preset } from "../button/button";

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
}


export function SalesQuickTable(props: SalesQuickProps) {
  const { records, onClick, config } = props;

  if (!records) return <NothingHere width="164" height="98" text="Agregue un producto" />;
  if (records.length == 0) return <NothingHere text="Agregue un producto" width="164" height="98" />;

  const listItems = records.map((record: any) => (
    <tr key={record.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700" >
       { record.cod == 9999999999 ?
      <td className="py-1 px-2"> { record.quantity } </td> :
      <td className="py-1 px-2 cursor-pointer" onClick={()=> onClick(record, OptionsClickSales.quantity)}> { record.quantity } </td> }
      <td className="py-1 px-2 truncate uppercase clickeable" onClick={()=> onClick(record, OptionsClickSales.productView)}>{ record.product.slice(0, 50) }</td>
      <td className="py-1 px-2">{ numberToMoney(record.unit_price ? record.unit_price : 0) }</td>
      {
        config.includes("sales-discount") ?
        <td className="py-1 px-2 truncate cursor-pointer" onClick={()=> onClick(record, OptionsClickSales.discount)}>
        { numberToMoney(record.discount ? record.discount : 0) }</td>
        :
        <td className="py-1 px-2 truncate" >
        { numberToMoney(record.discount ? record.discount : 0) }</td>
      }
      {config.includes("product-default-commission") &&
      <td className="py-1 px-2 clickeable" onClick={()=> onClick(record, OptionsClickSales.commisssion)}>{ record.commission ? record.commission : 0 } %</td>
      }
      <td className="py-1 px-2 truncate">{ numberToMoney(record.total ? record.total : 0) }</td>
      <td className="py-1 px-2">
      { record.cod == 9999999999 ? <Button preset={Preset.smallMinusDisable} noText /> : <Button preset={Preset.smallMinus} noText onClick={()=> onClick(record, OptionsClickSales.minus)} /> }
      { record.cod == 9999999999 ? <Button preset={Preset.smallPlusDisable} noText /> : <Button preset={Preset.smallPlus} noText onClick={()=> onClick(record, OptionsClickSales.plus)} /> }
      </td>
      <td className="py-1 px-2"><Button preset={Preset.smallClose} noText onClick={()=> onClick(record, OptionsClickSales.delete)} /></td>
    </tr>
  ));


  return (<div>
  <div className="w-full overflow-auto">
    <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
      <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
        <tr>
          <th scope="col" className="py-2 px-2 border">Cant</th>
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
    </table>
 </div>
 </div>);
}
