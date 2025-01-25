'use client'
import { numberToMoney } from "@/utils/functions";
import { NothingHere } from "../nothing-here/nothing-here";
import { Loading } from "../loading/loading";
import { formatDate, formatHourAsHM } from "@/utils/date-formats";
import { useContext, useState } from "react";
import { ConfigContext } from "@/contexts/config-context";
import { CommissionGoldViewModal } from "./commission-gold-view-modal";


interface CommissionsListGoldTableProps {
  records?:  any;
  isLoading?: boolean;
  random: (value: number) => void;
}

export function CommissionsListGoldTable(props: CommissionsListGoldTableProps) {
  const { records, isLoading, random } = props;
  const [isViewCommissionModal, setIsViewCommissionModal] = useState(false);
  const [isCommissionSelected, setIsCommissionSelected] = useState({} as any);
  const { systemInformation } = useContext(ConfigContext);


  if (isLoading) return <Loading />;
  if (!records.data) return <NothingHere width="164" height="98" />;
  if (records.data.length == 0) return <NothingHere text="No se encontraron datos, Seleccione un rango de fechas para crear el reporte" width="164" height="98" />;

  const setStatus = (status: number): any =>{
      switch (status) {
        case 0: return <span className="status-danger clickeable">Eliminado</span>
        case 1: return <span className="status-warning clickeable">Activo</span>
        case 2: return <span className="status-info clickeable">Creado</span>
        case 3: return <span className="status-success clickeable">Pagado</span>
      }
  }

  const setType = (status: number): any =>{
    switch (status) {
      case 1: return <span className="status-info">Normal</span>
      case 2: return <span className="status-warning">Puntos Oro</span>
    }
}


  const setModal = (record: any)=> {
    setIsCommissionSelected(record)
    setIsViewCommissionModal(true)
  }


  const listItems = records.data.map((record: any, key: any) => (
    <tr key={record.id} className="border-b">
      <td className="py-2 px-6 truncate">{ formatDate(record?.initial_date) } { formatHourAsHM(record?.initial_date) }</td>
      <td className="py-2 px-6 truncate">{ formatDate(record?.final_date) } { formatHourAsHM(record?.updated_at) }</td>
      <td className="py-2 px-6">{ setType(record?.type) }</td>
      <td className="py-2 px-6">{ record?.referred?.name }</td>
      <td className="py-2 px-6">{ numberToMoney(record?.commissions ? record?.commissions : 0, systemInformation) }</td>
      <th className="py-2 px-6">{ numberToMoney(record?.commissions ? record.type == 1 ? record?.commissions : (record?.commissions * 0.90) * 0.10 : 0, systemInformation) }</th>
      <th className="py-2 px-6" onClick={()=>setModal(record)}>{ setStatus(record?.status) }</th>
    </tr>
  ));


  return (<div>
  <div className="w-full overflow-auto">
    <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
      <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
        <tr>
          <th scope="col" className="py-3 px-4 border">Fecha Inicio</th>
          <th scope="col" className="py-3 px-4 border">Fecha Fin</th>
          <th scope="col" className="py-3 px-4 border">Tipo</th>
          <th scope="col" className="py-3 px-4 border">Cliente</th>
          <th scope="col" className="py-3 px-4 border">Total Comisiones</th>
          <th scope="col" className="py-3 px-4 border">Puntos de Oro</th>
          <th scope="col" className="py-3 px-4 border">Estado</th>
        </tr>
      </thead>
      <tbody>{listItems}</tbody>
    </table>
 </div>
 <CommissionGoldViewModal random={random} isShow={isViewCommissionModal} record={isCommissionSelected} onClose={()=>setIsViewCommissionModal(false)} />
 </div>);
}
