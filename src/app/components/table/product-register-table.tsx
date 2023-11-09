import { numberToMoney } from "@/utils/functions";
import { NothingHere } from "../nothing-here/nothing-here";
import { formatDateAsDMY } from "@/utils/date-formats";
import { Loading } from "../loading/loading";

interface ProductRegisterProps {
  records: any[];
  isLoading?: boolean;
}

export function ProductRegisterTable(props: ProductRegisterProps) {
  const { records, isLoading } = props;

  if (isLoading) return (<Loading />)

  if (!records) return <NothingHere width="164" height="98" text="No se encuentran productos" />;
  if (!Array.isArray(records) || records.length === 0) return <NothingHere text="No se encuentran productos" width="164" height="98" />;

  const listItems = records?.map((record: any) => (
    <tr key={record.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700" >
      <td className="py-2 px-2 truncate uppercase">{ record?.product?.description }</td>
      <td className="py-2 px-2">{ record?.quantity }</td>
      <td className="py-2 px-2">{ numberToMoney(record.unit_cost ? record.unit_cost : 0) }</td>
      <td className="py-2 px-2 truncate">{ record?.document_number }</td>
      <td className="py-2 px-2 truncate">{ formatDateAsDMY(record.created_at) }</td>
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
          <th scope="col" className="py-2 px-2 border">Documento</th>
          <th scope="col" className="py-2 px-2 border">Fecha</th>
        </tr>
      </thead>
      <tbody>{listItems}</tbody>
    </table>
 </div>
 </div>);
}
