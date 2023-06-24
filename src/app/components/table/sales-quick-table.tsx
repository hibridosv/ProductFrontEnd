'use client'
import { numberToMoney } from "@/utils/functions";
import { NothingHere } from "../nothing-here/nothing-here";
import { Button, Preset } from "../button/button";

interface SalesQuickProps {
  records?:  any;
  onDelete: (id: number) => void;
}

export function SalesQuickTable(props: SalesQuickProps) {
  const { records, onDelete } = props;

  if (!records) return <NothingHere widht="164" height="98" />;
  if (records.length == 0) return <NothingHere text="Agregue un producto" widht="164" height="98" />;



  const listItems = records.map((record: any) => (
    <tr key={record.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700" >
      <td className="py-2 px-2">{ record.quantity }</td>
      <td className="py-2 px-2 truncate uppercase">{ record.product }</td>
      <td className="py-2 px-2">{ numberToMoney(record.unit_price ? record.unit_price : 0) }</td>
      <td className="py-2 px-2 truncate">{ numberToMoney(record.subtotal ? record.subtotal : 0) }</td>
      <td className="py-2 px-2 truncate">{ numberToMoney(record.taxes ? record.taxes : 0) }</td>
      <td className="py-2 px-2 truncate">{ numberToMoney(record.total ? record.total : 0) }</td>
      <td className="py-2 px-2"><Button preset={Preset.smallClose} noText onClick={()=> onDelete(record.id)} /></td>
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
          <th scope="col" className="py-2 px-2 border">Sub Total</th>
          <th scope="col" className="py-2 px-2 border">Impuestos</th>
          <th scope="col" className="py-2 px-2 border">Total</th>
          <th scope="col" className="py-2 px-2 border">Del</th>
        </tr>
      </thead>
      <tbody>{listItems}</tbody>
    </table>
 </div>
 </div>);
}
