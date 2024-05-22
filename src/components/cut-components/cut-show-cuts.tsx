import { formatDate, formatDateAsDMY, formatTime } from "@/utils/date-formats";
import { numberToMoney } from "@/utils/functions";
import { Button, Preset } from "../button/button";
import { useState } from "react";
import { DeleteModal } from "../modals/delete-modal";
import { CutDetailsModal } from "../cashdrawer-components/cut-details-modal";

export interface CutShowCutsProps {
 records?: any;
 onDelete: (id: string) => void;
}

export function CutShowCuts(props: CutShowCutsProps) {
  const { records, onDelete } = props;
  const [selectRecord, setSelectRecord] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showCutDetailsModal, setShowCutDetailsModal] = useState(false);

const firstRecord = records?.data && records?.data[0];

const isDeleteCut = (record: string) => {
    setSelectRecord(record);
    setShowDeleteModal(true);
  }

  const handleDeleteCut = () => {
    onDelete(selectRecord);
    setShowDeleteModal(false);
    setSelectRecord("");
  }

  const isShowDetails = (record: string) => {
    setSelectRecord(record);
    setShowCutDetailsModal(true);
  }


  const listItems = records?.data &&  records.data.map((record: any, key: any) => (
    <tr key={record.id} className={`border-2 ${record.status == 0 && "bg-red-300"}`} >
      <td className="py-2 px-6 truncate clickeable" onClick={()=>isShowDetails(record)}>{ formatDateAsDMY(record.close) } | { formatTime(record.close)}</td>
      <td className="py-2 px-6 clickeable" onClick={()=>isShowDetails(record)}>{ numberToMoney(record?.final_cash ? record?.final_cash : 0) }</td>
      <td className={`py-2 px-6 font-bold clickeable ${record?.cash_diference > 0 ? 'text-blue-600' : record?.cash_diference < 0 ? 'text-red-600' : 'text-black'}`} onClick={()=>isShowDetails(record)}>{ numberToMoney(record?.cash_diference ? record?.cash_diference : 0) }</td>
      <td className="py-2 px-6"><Button preset={firstRecord.id == record?.id ? Preset.smallClose : Preset.smallCloseDisable} 
                onClick={firstRecord.id == record?.id ? ()=>isDeleteCut(record) : ()=>{} } noText /></td>
    </tr>
  ));

  return (<div className="mx-4">
    <div className="w-full overflow-auto">
    <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
      <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
        <tr>
          <th scope="col" className="py-3 px-4 border">Fecha</th>
          <th scope="col" className="py-3 px-4 border">Efectivo</th>
          <th scope="col" className="py-3 px-4 border">Diferencia</th>
          <th scope="col" className="py-3 px-4 border">Del</th>
        </tr>
      </thead>
      <tbody>{listItems}</tbody>
    </table>
 </div>

    <DeleteModal isShow={showDeleteModal} text="¿Estas seguro de eliminar este elemento?" onDelete={handleDeleteCut}  onClose={()=>setShowDeleteModal(false)} />
    <CutDetailsModal record={selectRecord} isShow={showCutDetailsModal} onClose={()=>setShowCutDetailsModal(false)} />
   </div>);
}
