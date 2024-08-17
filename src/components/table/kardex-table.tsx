'use client'
import { numberToMoney } from "@/utils/functions";
import { NothingHere } from "../nothing-here/nothing-here";
import { formatDateAsDMY, formatHourAsHM } from "@/utils/date-formats";
import { useContext, useState } from "react";
import { ProductKardexViewModal } from "../products-components/product-kardex-view-modal";
import { ConfigContext } from "@/contexts/config-context";



interface KardexTableProps {
  records?:  any;
}

export function KardexTable(props: KardexTableProps) {
  const { records } = props;
  const [isShowKardexModal, setIsShowKardexModal] = useState(false);
  const [isSelectKardexId, setIsSelectKardexId] = useState("");
  const { systemInformation } = useContext(ConfigContext);



  if (!records.data) return <NothingHere width="164" height="98" />;
  if (records.data.length == 0) return <NothingHere text="No se encontraron datos" width="164" height="98" />;


  const setKardexDetails = (record: any)=>{
      setIsShowKardexModal(true)
      setIsSelectKardexId(record)
  }

  const listItems = records.data.map((record: any) => (
    <tr key={record.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700" >
      <td className="py-3 px-6 whitespace-nowrap ">{ formatDateAsDMY(record.created_at) } { formatHourAsHM(record.created_at) }</td>
      <th className="py-3 px-6 font-medium text-gray-900 whitespace-nowrap clickeable" scope="row" onClick={()=>setKardexDetails(record)}>{ record.description }</th>
      <td className="py-3 px-6">{ record.unit_cost }</td>
      <td className={`py-3 px-6 ${record.qty_in && 'text-blue-600 font-semibold'}`}>{ record.qty_in ? record.qty_in : 0 }</td>
      <td className={`py-3 px-6 ${record.total_in && 'text-blue-600 font-semibold'}`}>{ numberToMoney(record.total_in ? record.total_in : 0, systemInformation) }</td>
      <td className={`py-3 px-6 ${record.qty_out && 'text-red-500 font-semibold'}`}>{ record.qty_out ? record.qty_out : 0 }</td>
      <td className={`py-3 px-6 ${record.total_out && 'text-red-500 font-semibold'}`}>{ numberToMoney(record.total_out ? record.total_out : 0, systemInformation) }</td>
      <td className="py-3 px-6">{ record.qty_balance ? record.qty_balance : 0 }</td>
      <td className="py-3 px-6 font-semibold">{ numberToMoney(record.total_balance ? record.total_balance : 0, systemInformation) }</td>
    </tr>
  ));


  return (<div>
  <div className="text-2xl md:text-1xl text-gray-800">PRODUCTO: <span className="uppercase font-semibold">{records?.product?.description}</span></div>
  <div className="text-2xl md:text-1xl">METODO: COSTO PROMEDIO PONDERADO</div>
  <div className="w-full overflow-auto">
    <table className="text-sm text-left text-gray-500 dark:text-gray-400">
      <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
        <tr>
          <th scope="col" colSpan={3} className="py-3 px-4 border">Código: {records?.product?.cod}</th>
          <th scope="col" colSpan={2} className="py-3 px-4 border">Entradas</th>
          <th scope="col" colSpan={2} className="py-3 px-4 border">Salidas</th>
          <th scope="col" colSpan={2} className="py-3 px-4 border">Saldo</th>
        </tr>
      </thead>
      <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
        <tr>
          <th scope="col" className="py-3 px-4 border">Fecha</th>
          <th scope="col" className="py-3 px-4 border">Detalle</th>
          <th scope="col" className="py-3 px-4 border whitespace-nowrap ">Costo U</th>
          <th scope="col" className="py-3 px-4 border">Cantidad</th>
          <th scope="col" className="py-3 px-4 border">Total</th>
          <th scope="col" className="py-3 px-4 border">Cantidad</th>
          <th scope="col" className="py-3 px-4 border">Total</th>
          <th scope="col" className="py-3 px-4 border">Cantidad</th>
          <th scope="col" className="py-3 px-4 border">Total</th>
        </tr>
      </thead>
      <tbody>{listItems}</tbody>
    </table>
    <ProductKardexViewModal isShow={isShowKardexModal} onClose={()=>setIsShowKardexModal(false)} record={isSelectKardexId} />
 </div>
 </div>);
}
