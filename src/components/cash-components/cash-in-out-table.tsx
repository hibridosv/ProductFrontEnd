'use client'
import { useContext, useState } from "react";
import { numberToMoney } from "@/utils/functions";
import { NothingHere } from "../nothing-here/nothing-here";
import { Button, Preset } from "../button/button";
import { DeleteModal } from "../modals/delete-modal";
import { InOut } from "@/services/Account";
import { ConfigContext } from "@/contexts/config-context";


interface CashInOutTableProps {
  records?:  any;
  onDelete: (id: string) => void;
}

export function CashInOutTable(props: CashInOutTableProps) {
  const { records, onDelete } = props;
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectBill, setSelectBill] = useState<InOut>({} as InOut);
  const { systemInformation } = useContext(ConfigContext);



  if (!records.data) return <NothingHere width="164" height="98" />;
  if (records.data.length == 0) return <NothingHere text="No se encontraron datos" width="164" height="98" />;

  const isDelete = (bill: InOut) => {
    setSelectBill(bill);
    setShowDeleteModal(true);
  }

  const handleDelete = () => {
    onDelete(selectBill.id);
    setShowDeleteModal(false);
    setSelectBill({} as InOut);
  }

  const transactionType = (type: number)=>{
        if (type == 1) return "Ingreso de Efectivo"
        return "Salida de efectivo"
  }


  const listItems = records.data.map((record: any) => (
    <tr key={record.id} className={`border-b  ${record.status == 1 ? 'bg-white' : 'bg-red-200'}`} >
      <td className={`py-3 px-6 whitespace-nowrap font-bold  ${record.transaction_type == 1 ? 'text-green-500' : 'text-red-500'}`}>
        { transactionType(record?.transaction_type) }</td>
      <td className="py-3 px-6 whitespace-nowrap">{ record?.description }</td>
      <td className="py-3 px-6 truncate">{ record?.employee?.name }</td>
      <td className="py-2 px-6">{ numberToMoney(record.quantity ? record.quantity : 0, systemInformation) }</td>
      <td className="py-2 px-6 truncate"><Button 
      preset={record.status == 1 ? Preset.smallClose : Preset.smallCloseDisable} 
      disabled={record.status == 0 ? true : false} noText onClick={()=>isDelete(record)} /> </td>
    </tr>
  ));


  return (<div>
  <div className="w-full overflow-auto">
    <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
      <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
        <tr>
          <th scope="col" className="py-3 px-4 border">Transacción</th>
          <th scope="col" className="py-3 px-4 border">Descripción</th>
          <th scope="col" className="py-3 px-4 border">Usuario</th>
          <th scope="col" className="py-3 px-4 border">Cantidad</th>
          <th scope="col" className="py-3 px-4 border">Del</th>
        </tr>
      </thead>
      <tbody>{listItems}</tbody>
    </table>

          <DeleteModal isShow={showDeleteModal}
          text="¿Estas seguro de eliminar este elemento?"
          onDelete={handleDelete} 
          onClose={()=>setShowDeleteModal(false)} /> 


 </div>
 </div>);
}
