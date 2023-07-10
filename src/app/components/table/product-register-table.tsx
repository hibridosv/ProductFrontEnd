import { numberToMoney } from "@/utils/functions";
import { NothingHere } from "../nothing-here/nothing-here";

interface ProductRegisterProps {
  records:  any;
}

export function ProductRegisterTable(props: ProductRegisterProps) {
  const { records } = props;

  if (!records) return <NothingHere widht="164" height="98" text="Agregue un producto" />;
  if (records.length == 0) return <NothingHere text="Agregue un producto" widht="164" height="98" />;

  const listItems = records?.map((record: any) => (
    <tr key={record.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700" >
      <td className="py-2 px-2 truncate uppercase">{ record?.product?.description }</td>
      <td className="py-2 px-2">{ record?.quantity }</td>
      <td className="py-2 px-2">{ numberToMoney(record.unit_cost ? record.unit_cost : 0) }</td>
      <td className="py-2 px-2 truncate cursor-pointer">{ record?.product?.provider?.name }</td>
      <td className="py-2 px-2 truncate">{ record?.document_number }</td>
    </tr>
  ));


  return (<div>
  <div className="w-full overflow-auto">
    <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
      <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
        <tr>
          <th scope="col" className="py-2 px-2 border">Producto</th>
          <th scope="col" className="py-2 px-2 border">Cantidad</th>
          <th scope="col" className="py-2 px-2 border">Precio Costo</th>
          <th scope="col" className="py-2 px-2 border">Proveedor</th>
          <th scope="col" className="py-2 px-2 border">Documento</th>
        </tr>
      </thead>
      <tbody>{listItems}</tbody>
    </table>
 </div>
 </div>);
}
