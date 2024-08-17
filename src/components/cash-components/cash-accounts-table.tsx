'use client'
import { useContext, useState } from "react";
import { numberToMoney } from "@/utils/functions";
import { NothingHere } from "../nothing-here/nothing-here";
import { Button, Preset } from "../button/button";
import { DeleteModal } from "../modals/delete-modal";
import { Account } from "@/services/Bills";
import { ConfigContext } from "@/contexts/config-context";

interface CashAccountsTableProps {
  records?:  any;
  onDelete: (id: string) => void;
}

export function CashAccountsTable(props: CashAccountsTableProps) {
  const { records, onDelete } = props;
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectBill, setSelectBill] = useState<Account>({} as Account);
  const { systemInformation } = useContext(ConfigContext);



  if (!records.data) return <NothingHere width="164" height="98" />;
  if (records.data.length == 0) return <NothingHere text="No se encontraron datos" width="164" height="98" />;

  const isDelete = (bill: Account) => {
    setSelectBill(bill);
    setShowDeleteModal(true);
  }

  const handleDelete = () => {
    onDelete(selectBill.id);
    setShowDeleteModal(false);
    setSelectBill({} as Account);
  }


  const typeOfAccount = (type: number): string =>{
    switch (type) {
      case 1: return "Caja Chica"
      case 2: return "Cuenta"
      case 3: return "Chequera"
      case 4: return "Tarjeta"
    }
    return "Caja Chica"
  }

  const listItems = records.data.map((record: any) => (
    <tr key={record.id} className={`border-b  ${record.status == 1 ? 'bg-white' : 'bg-red-200'}`} >
      <td className="py-3 px-6 whitespace-nowrap">{ record?.account }</td>
      <td className="py-3 px-6 whitespace-nowrap">{ record?.bank }</td>
      <td className="py-3 px-6 truncate">{ typeOfAccount(record?.type) }</td>
      <td className="py-2 px-6">{ numberToMoney(record.balance ? record.balance : 0, systemInformation) }</td>
      <td className="py-2 px-6 truncate"><Button 
      preset={(record.status == 1 && record.is_principal == 0) ? Preset.smallClose : Preset.smallCloseDisable} 
      disabled={(record.status == 0 || record.is_principal == 1) ? true : false} noText onClick={()=>isDelete(record)} /> </td>
    </tr>
  ));


  return (<div>
  <div className="w-full overflow-auto">
    <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
      <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
        <tr>
          <th scope="col" className="py-3 px-4 border">Cuenta</th>
          <th scope="col" className="py-3 px-4 border">Banco</th>
          <th scope="col" className="py-3 px-4 border">Tipo</th>
          <th scope="col" className="py-3 px-4 border">Saldo</th>
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
