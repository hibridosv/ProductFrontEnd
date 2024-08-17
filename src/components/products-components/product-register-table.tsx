'use client'
import { numberToMoney } from "@/utils/functions";
import { NothingHere } from "../nothing-here/nothing-here";
import { formatDateAsDMY } from "@/utils/date-formats";
import { Loading } from "../loading/loading";
import { Button, Preset } from "../button/button";
import { ConfigContext } from "@/contexts/config-context";
import { useContext } from "react";

interface ProductRegisterProps {
  records: any[];
  isLoading?: boolean;
  onDelete: (iden: string)=>void;
  productPrincipal?: string;
}

export function ProductRegisterTable(props: ProductRegisterProps) {
  const { records, isLoading, onDelete, productPrincipal } = props;
  const { systemInformation } = useContext(ConfigContext);


  if (isLoading) return (<Loading />)

  if (!records) return <NothingHere width="164" height="98" text="No se encuentran productos" />;
  if (!Array.isArray(records) || records.length === 0) return <NothingHere text="No se encuentran productos" width="164" height="98" />;

  
    let total = 0;
    const listItems = records?.map((record: any) => {
      const subtotal = (record.unit_cost ? record.unit_cost : 0) * record?.quantity;
      total += subtotal;
   return (
      <tr key={record.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700" >
        <td className="py-2 px-2 truncate uppercase">{ record?.product?.description }</td>
        <td className="py-2 px-2">{ record?.quantity }</td>
        <td className="py-2 px-2">{ numberToMoney(record.unit_cost ? record.unit_cost : 0, systemInformation) }</td>
        <td className="py-2 px-2">{ numberToMoney((record.unit_cost ? record.unit_cost : 0) * record?.quantity, systemInformation) }</td>
        <td className="py-2 px-2 truncate">{ record?.document_number }</td>
        <td className="py-2 px-2 truncate">{ formatDateAsDMY(record.created_at) }</td>
        <td className="py-2 px-2"><Button preset={productPrincipal ? Preset.smallClose : Preset.smallCloseDisable} noText onClick={productPrincipal ? ()=>onDelete(record.id) : ()=>{}} /></td>
      </tr>
    )
  });


  return (<div>
  <div className="w-full overflow-auto">
    <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
      <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
        <tr>
          <th scope="col" className="py-2 px-2 border">Producto</th>
          <th scope="col" className="py-2 px-2 border">Cant</th>
          <th scope="col" className="py-2 px-2 border">Precio Costo</th>
          <th scope="col" className="py-2 px-2 border">Total Costo</th>
          <th scope="col" className="py-2 px-2 border">Documento</th>
          <th scope="col" className="py-2 px-2 border">Fecha</th>
          <th scope="col" className="py-2 px-2 border"></th>
        </tr>
      </thead>
      <tbody>{listItems}</tbody>
    </table>
    <div className=" font-semibold uppercase text-right ml-4 text-red-950">Total ingresado: {numberToMoney(total, systemInformation)}</div>
 </div>
 </div>);
}
