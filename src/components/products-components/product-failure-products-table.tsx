'use client'
import { useState } from "react"
import { NothingHere } from "../nothing-here/nothing-here";
import { Button, Preset } from "../button/button";
import { DeleteModal } from "../modals/delete-modal";
import { formatDateAsDMY } from "@/utils/date-formats";

interface ProductFailureProductsTableProps {
  records?:  any;
  onDelete: (id: string) => void;
}

export function ProductFailureProductsTable(props: ProductFailureProductsTableProps) {
  const { records, onDelete } = props;
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectRecord, setSelectRecord] = useState("");


  if (!records) return <NothingHere width="164" height="98" text="No existen registros" />;
  if (records.length == 0) return <NothingHere text="No existen registros" width="164" height="98" />;


  
  const isDeleteProduct = (record: string) => {
    setSelectRecord(record);
    setShowDeleteModal(true);
  }

  const handleDeleteProduct = () => {
    onDelete(selectRecord);
    setShowDeleteModal(false);
    setSelectRecord("");
  }

  const listItems = records.map((record: any) => (
    <tr title={ record?.status === 2 ? `Eliminado por ${record?.deleted_by?.name}` : ``} key={record.id} className={record.status === 2 ? `bg-white border-b dark:bg-gray-800 dark:border-gray-700 text-red-600` : `bg-white border-b dark:bg-gray-800 dark:border-gray-700`} >
      <td className="py-2 px-2 truncate">{ record?.product?.description }</td>
      <td className="py-2 px-2">{ record.quantity }</td>
      <td className="py-2 px-2 truncate uppercase">{ record.reason }</td>
      <td className="py-2 px-2">{ record?.employee?.name }</td>
      <td className="py-2 px-2">
        {(formatDateAsDMY(record?.created_at) == formatDateAsDMY(new Date().toISOString()) && record?.status === 1) ? 
        <Button preset={Preset.smallClose} style="clickeable" noText onClick={()=> isDeleteProduct(record.id)} /> :
        <Button preset={Preset.smallCloseDisable} noText disabled />
        }
        </td>
    </tr>
  ));


  return (<div>
  <div className="w-full overflow-auto">
    <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
      <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
        <tr>
          <th scope="col" className="py-2 px-2 border">Producto</th>
          <th scope="col" className="py-2 px-2 border">Cant</th>
          <th scope="col" className="py-2 px-2 border">Razón</th>
          <th scope="col" className="py-2 px-2 border">Usuario</th>
          <th scope="col" className="py-2 px-2 border">Del</th>
        </tr>
      </thead>
      <tbody>{listItems}</tbody>
    </table>


          <DeleteModal isShow={showDeleteModal}
          text="¿Estas seguro de eliminar este Elemento?"
          onDelete={handleDeleteProduct} 
          onClose={()=>setShowDeleteModal(false)} /> 
 </div>
 </div>);
}
