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

  return (<div className="mx-4">
    <div  className="w-full shadow-neutral-600 shadow-lg rounded-md">
        <div className="flex justify-between">
            <div className="m-2">FECHA</div>
            <div className="m-2">DIFERENCIA</div>
            <div className="m-2">DEL</div>
        </div>

      {records?.data && records?.data.map((record: any) => ( <div key={record.id}>
        {record?.status != 1 &&
        <div className={`flex justify-between border-2 ${record.status == 0 && "bg-red-300"}`}>
            <div className="m-2 clickeable" onClick={()=>isShowDetails(record)}>{ formatDateAsDMY(record.close) } | { formatTime(record.close)}</div>
            <div className={`m-2 font-semibold
            ${record?.cash_diference > 0 ? 'text-blue-600' : record?.cash_diference < 0 ? 'text-red-600' : 'text-black'}`}>
                {numberToMoney(record?.cash_diference)}</div>
            <div className="m-2"><Button preset={firstRecord.id == record?.id ? Preset.smallClose : Preset.smallCloseDisable} 
                onClick={firstRecord.id == record?.id ? ()=>isDeleteCut(record) : ()=>{} } noText /></div>
        </div> }
        </div> ))}

    </div>
   
    <DeleteModal isShow={showDeleteModal} text="¿Estas seguro de eliminar este elemento?" onDelete={handleDeleteCut}  onClose={()=>setShowDeleteModal(false)} />
    <CutDetailsModal record={selectRecord} isShow={showCutDetailsModal} onClose={()=>setShowCutDetailsModal(false)} />
   </div>);
}
