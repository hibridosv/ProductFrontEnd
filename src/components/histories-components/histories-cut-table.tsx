'use client'
import { getPaymentTypeName, getTotalOfItem, numberToMoney } from "@/utils/functions";
import { NothingHere } from "../nothing-here/nothing-here";
import { Loading } from "../loading/loading";
import { formatDate, formatHourAsHM } from "@/utils/date-formats";
import { CutDetailsModal } from "../cashdrawer-components/cut-details-modal";
import { useContext, useState } from "react";
import { ConfigContext } from "@/contexts/config-context";


interface HistoriesCutTableProps {
  records?:  any;
  isLoading?: boolean;
}

export function HistoriesCutTable(props: HistoriesCutTableProps) {
  const { records, isLoading } = props;
  const [showCutDetailsModal, setShowCutDetailsModal] = useState(false);
  const [selectRecord, setSelectRecord] = useState("");
  const { systemInformation } = useContext(ConfigContext);


  if (isLoading) return <Loading />;
  if (!records.data) return <NothingHere width="164" height="98" />;
  if (records.data.length == 0) return <NothingHere text="No se encontraron datos" width="164" height="98" />;

  const isShowDetails = (record: string) => {
    setSelectRecord(record);
    setShowCutDetailsModal(true);
  }

  const listItems = records.data.map((record: any, key: any) => (
    <tr key={record.id} className={`border-b ${record?.status == 0 && 'bg-red-200'}`}>
      <td className="py-2 px-6 truncate">{ formatDate(record?.opening) } | { formatHourAsHM(record?.opening)} </td>
      <td className="py-2 px-6 truncate">{ formatDate(record?.close) } | { formatHourAsHM(record?.close)} </td>
      <td className="py-2 px-6">{ numberToMoney(record?.inicial_cash ? record?.inicial_cash : 0, systemInformation) }</td>
      <td className="py-2 px-6">{ numberToMoney(record?.final_cash ? record?.final_cash : 0, systemInformation) }</td>

      <th className="py-2 px-6 text-gray-900 whitespace-nowrap dark:text-white" scope="row">{ record?.employee?.name } </th>

      <td className="py-2 px-6">{ numberToMoney(record?.cash_incomes ? record?.cash_incomes : 0, systemInformation) }</td>
      <td className="py-2 px-6">{ numberToMoney(record?.cash_expenses ? record?.cash_expenses : 0, systemInformation) }</td>
      <td className="py-2 px-6 text-red-500 font-semibold clickeable" onClick={()=>isShowDetails(record)}>{ numberToMoney(record?.cash_diference ? record?.cash_diference : 0, systemInformation) }</td>
    </tr>
  ));


  return (<div>
  <div className="w-full overflow-auto">
    <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
      <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
        <tr>
          <th scope="col" className="py-3 px-4 border">Apertura</th>
          <th scope="col" className="py-3 px-4 border">Cierre</th>
          <th scope="col" className="py-3 px-4 border">Efectivo Inicial</th>
          <th scope="col" className="py-3 px-4 border">Efectivo Cierre</th>
          <th scope="col" className="py-3 px-4 border">Cajero</th>
          <th scope="col" className="py-3 px-4 border">Entradas</th>
          <th scope="col" className="py-3 px-4 border">Salidas</th>
          <th scope="col" className="py-3 px-4 border">Diferencia</th>
        </tr>
      </thead>
      <tbody>{listItems}</tbody>
    </table>

        <div className="uppercase shadow-lg border-x-2 mx-4 mt-4 mb-4 p-4 bg-white rounded-lg">
            <div>Numero total cortes: <span className=" font-semibold">{ records?.data.length }</span></div>
        </div>
        <CutDetailsModal record={selectRecord} isShow={showCutDetailsModal} onClose={()=>setShowCutDetailsModal(false)} />

 </div>
 </div>);
}
