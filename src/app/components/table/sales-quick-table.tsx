'use client'
import { numberToMoney } from "@/utils/functions";
import { NothingHere } from "../nothing-here/nothing-here";
import { Button, Preset } from "../button/button";

interface SalesQuickProps {
  records?:  any;
  onClick: (product: any, option: OptionsClickSales) => void;
}

export enum OptionsClickSales {
  delete = 1,
  plus = 2,
  minus = 3,
  quantity = 4,
  discount = 5,
}


export function SalesQuickTable(props: SalesQuickProps) {
  const { records, onClick } = props;

  if (!records) return <NothingHere width="164" height="98" text="Agregue un producto" />;
  if (records.length == 0) return <NothingHere text="Agregue un producto" width="164" height="98" />;

  const listItems = records.map((record: any) => (
    <tr key={record.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700" >
      <td className="py-1 px-2 cursor-pointer" onClick={()=> onClick(record, OptionsClickSales.quantity)}>
        { record.quantity }
        </td>
      <td className="py-1 px-2 truncate uppercase">{ record.product.slice(0, 50) }</td>
      <td className="py-1 px-2">{ numberToMoney(record.unit_price ? record.unit_price : 0) }</td>
      {/* <td className="py-2 px-2 truncate">{ numberToMoney(record.subtotal ? record.subtotal : 0) }</td> */}
      <td className="py-1 px-2 truncate cursor-pointer" onClick={()=> onClick(record, OptionsClickSales.discount)}>
        { numberToMoney(record.discount ? record.discount : 0) }</td>
      <td className="py-1 px-2 truncate">{ numberToMoney(record.total ? record.total : 0) }</td>
      <td className="py-1 px-2">
      <Button preset={Preset.smallMinus} noText onClick={()=> onClick(record, OptionsClickSales.minus)} />
      <Button preset={Preset.smallPlus} noText onClick={()=> onClick(record, OptionsClickSales.plus)} />
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
          {/* <th scope="col" className="py-2 px-2 border">Sub Total</th> */}
          <th scope="col" className="py-2 px-2 border">Descuento</th>
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
