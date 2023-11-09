import { documentType } from "@/utils/functions";
import { NothingHere } from "../nothing-here/nothing-here";

interface ProductRegisterPrincipalProps {
  records: any[];
}

export function ProductRegisterPrincipalTable(props: ProductRegisterPrincipalProps) {
  const { records } = props;

  if (!records) return <NothingHere width="164" height="98" text="Agregue un producto" />;
  if (!Array.isArray(records) || records.length === 0) return <NothingHere text="Agregue un producto" width="164" height="98" />;

  const listItems = records?.map((record: any) => (
    <tr key={record.id} className={`bg-white border-b dark:bg-gray-800 dark:border-gray-700 ${ record.status == 0 ? 'bg-teal-200' : ''}`} >
      <td className="py-2 px-2 truncate uppercase">{ documentType(record?.document_type) }</td>
      <td className="py-2 px-2">{ record?.document_number }</td>
      <td className="py-2 px-2">{ record?.provider?.name }</td>
      <td className="py-2 px-2 truncate">{ record?.lot }</td>
      <td className="py-2 px-2 truncate">{ record.comment }</td>
    </tr>
  ));


  return (<div>
  <div className="w-full overflow-auto">
    <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
      <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
        <tr>
          <th scope="col" className="py-2 px-2 border">Tipo Documento</th>
          <th scope="col" className="py-2 px-2 border">Documento</th>
          <th scope="col" className="py-2 px-2 border">Proveedor</th>
          <th scope="col" className="py-2 px-2 border">Lote</th>
          <th scope="col" className="py-2 px-2 border">Descripción</th>
        </tr>
      </thead>
      <tbody>{listItems}</tbody>
    </table>
 </div>
 </div>);
}
