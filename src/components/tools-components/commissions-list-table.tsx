'use client'
import { documentType, getPaymentTypeName, getTotalOfItem, numberToMoney } from "@/utils/functions";
import { NothingHere } from "../nothing-here/nothing-here";
import { Loading } from "../loading/loading";
import { formatDate, formatHourAsHM } from "@/utils/date-formats";


interface CommissionsListTableProps {
  records?:  any;
  isLoading?: boolean;
}

export function CommissionsListTable(props: CommissionsListTableProps) {
  const { records, isLoading } = props;



  if (isLoading) return <Loading />;
  if (!records.data) return <NothingHere width="164" height="98" />;
  if (records.data.length == 0) return <NothingHere text="No se encontraron datos" width="164" height="98" />;

  const setStatus = (status: number): any =>{
      switch (status) {
        case 0: return <span className="status-danger">Eliminado</span>
        case 1: return <span className="status-info clickeable">Activo</span>
        case 2: return <span className="status-success">Pagado</span>
      }
  }


  const listItems = records.data.map((record: any, key: any) => (
    <tr key={record.id} className="border-b">
      <td className="py-2 px-6 truncate">{ formatDate(record?.initial_date) }</td>
      <td className="py-2 px-6">{ formatDate(record?.final_date) }</td>
      <td className="py-2 px-6">{ record?.referred?.name }</td>
      <td className="py-2 px-6">{ record?.invoices }</td>
      <td className="py-2 px-6">{ numberToMoney(record?.total ? record?.total : 0) }</td>
      <th className="py-2 px-6">{ numberToMoney(record?.commissions ? record?.commissions : 0) }</th>
      <th className="py-2 px-6">{ setStatus(record?.status) }</th>
    </tr>
  ));


  return (<div>
  <div className="w-full overflow-auto">
    <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
      <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
        <tr>
          <th scope="col" className="py-3 px-4 border">Inicio</th>
          <th scope="col" className="py-3 px-4 border">Fin</th>
          <th scope="col" className="py-3 px-4 border">Cliente</th>
          <th scope="col" className="py-3 px-4 border">Facturas</th>
          <th scope="col" className="py-3 px-4 border">Total</th>
          <th scope="col" className="py-3 px-4 border">Comisiones</th>
          <th scope="col" className="py-3 px-4 border">Estado</th>
        </tr>
      </thead>
      <tbody>{listItems}</tbody>
    </table>
 </div>
 </div>);
}
