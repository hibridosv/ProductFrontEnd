'use client'
import { useContext, useState } from "react";
import { getPaymentTypeName, numberToMoney } from "@/utils/functions";
import { NothingHere } from "../nothing-here/nothing-here";
import { Button, Preset } from "../button/button";
import { DeleteModal } from "../modals/delete-modal";
import { Bill } from "@/services/Bills";
import { ConfigContext } from "@/contexts/config-context";

interface CashBillsTableProps {
  records?:  any;
  onDelete: (id: string) => void;
  isDisabled?: boolean;
}

export function CashBillsTable(props: CashBillsTableProps) {
  const { records, onDelete, isDisabled } = props;
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectBill, setSelectBill] = useState<Bill>({} as Bill);
  const { systemInformation } = useContext(ConfigContext);


  if (!records.data) return <NothingHere width="164" height="98" />;
  if (records.data.length == 0) return <NothingHere text="No se encontraron datos" width="164" height="98" />;

  const isDelete = (bill: Bill) => {
    setSelectBill(bill);
    setShowDeleteModal(true);
  }

  const handleDelete = () => {
    onDelete(selectBill.id);
    setShowDeleteModal(false);
    setSelectBill({} as Bill);
  }


  const listItems = records.data.map((record: Bill) => (
    <tr key={record.id} className={`border-b  ${record.status == 1 ? 'bg-white' : 'bg-red-200'}`} >
      {/* <td className="py-3 px-6 whitespace-nowrap">{ record.name }</td> */}
      <th className="py-2 px-6 text-gray-900 whitespace-nowrap dark:text-white" scope="row"><div className={`${record?.description && "text-xs font-light"}`}>{ record.name }</div><div>{ record.description }</div></th>
      <td className="py-2 px-6">{ numberToMoney(record.quantity ? record.quantity : 0, systemInformation) }</td>
      {/* <td className="py-3 px-6 whitespace-nowrap">{ formatDateAsDMY(record.created_at) }</td> */}
      <td className="py-2 px-6 truncate">{ getPaymentTypeName(record.payment_type) }</td>
      {/* <td className="py-3 px-6 truncate">{ record.cash_accounts_id }</td> */}
      <td className="py-2 px-6 truncate"><Button preset={record.status == 1 && !isDisabled ? Preset.smallClose : Preset.smallCloseDisable} disabled={record.status == 0 || isDisabled && true} noText onClick={()=>isDelete(record)} /> </td>
    </tr>
  ));


  return (<div>
  <div className="w-full overflow-auto">
    <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
      <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
        <tr>
          {/* <th scope="col" className="py-3 px-4 border">Nombre</th> */}
          <th scope="col" className="py-3 px-4 border">Descripción</th>
          <th scope="col" className="py-3 px-4 border">Cantidad</th>
          {/* <th scope="col" className="py-3 px-4 border">Fecha</th> */}
          <th scope="col" className="py-3 px-4 border">Tipo Pago</th>
          {/* <th scope="col" className="py-3 px-4 border">Cuenta</th> */}
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
