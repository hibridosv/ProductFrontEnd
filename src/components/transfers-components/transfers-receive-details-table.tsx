'use client'
import { formatDate, formatDateAsDMY, formatHourAsHM } from "@/utils/date-formats";
import { NothingHere } from "../nothing-here/nothing-here";
import { AiOutlineFundView } from "react-icons/ai";
import { useEffect } from "react";
import { Button, Preset } from "../button/button";

interface TransfersReceiveDetailsTableProps {
  records?:  any;
  onClose: () => void;
}

export function TransfersReceiveDetailsTable(props: TransfersReceiveDetailsTableProps) {
  const { records, onClose } = props;


//   useEffect(() => {
//     (async () => await console.log())();
// }, []);
console.log(records)
  if (!records.products) return <NothingHere width="164" height="98" />;
  if (records.products.length == 0) return <NothingHere text="No se encontraron productos" width="164" height="98" />;


  const listItems = records.products.map((record: any) => (
    <tr key={record.id} className={`border-b bg-white`} >
      <td className="py-3 px-6 whitespace-nowrap">{ record?.cod }</td> 
      <td className="py-3 px-6 whitespace-nowrap">{ record?.description }</td> 
      <td className="py-3 px-6 truncate">{ record?.quantity }</td>
      <td className="py-3 px-6 truncate">{ record?.status }</td>
      <td className="py-3 px-6 truncate">
        <span className="flex justify-between">
          <AiOutlineFundView size={20} title="Ver detalles" className="text-red-600 clickeable" onClick={()=>console.log(record)} />
        </span>
      </td>
    </tr>
  ));


  return (<div>
  <div className="w-full overflow-auto">
    <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
      <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
        <tr>
          <th scope="col" className="py-3 px-4 border">Codigo</th>
          <th scope="col" className="py-3 px-4 border">Descripcion</th>
          <th scope="col" className="py-3 px-4 border">Cantidad</th>
          <th scope="col" className="py-3 px-4 border">Estado</th>
          <th scope="col" className="py-3 px-4 border">OP</th>
        </tr>
      </thead>
      <tbody>{listItems}</tbody>
    </table>
    <Button onClick={onClose} text="Regresar" preset={Preset.add} />
 </div>
 </div>);
}
