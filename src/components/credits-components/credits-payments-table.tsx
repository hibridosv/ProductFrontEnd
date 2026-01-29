'use client'
import { useContext, useEffect, useState } from "react";
import { extractActiveFeature, getFirstElement, numberToMoney } from "@/utils/functions";
import { NothingHere } from "../nothing-here/nothing-here";
import {  formatDate, formatDateAsDMY, formatTime } from "@/utils/date-formats";
import { Button, Preset } from "../button/button";
import { Tooltip } from "flowbite-react";
import { ConfigContext } from "@/contexts/config-context";
import { ButtonDownload } from "../button/button-download";
import { FaPrint } from "react-icons/fa";



interface CredistPaymentsTableProps {
  records?:  any;
  onDelete: (record: any)=> void;
  isPrint: ()=> void;
  isDisabled?: boolean;
}

export function CredistPaymentsTable(props: CredistPaymentsTableProps) {
  const { records, onDelete, isDisabled, isPrint } = props;
  const [isLasElement, setIsLasElement] = useState([] as any);
  const { systemInformation, config } = useContext(ConfigContext);
  const [configuration, setConfiguration] = useState([] as any); // configuraciones que vienen de config

  useEffect(() => {
    setIsLasElement(getFirstElement(records?.data))
    setConfiguration(extractActiveFeature(config.configurations))
  }, 
  [records, config]);


  if (!records.data) return <NothingHere width="100" height="65" />;
  if (records.data.length == 0) return <NothingHere text="No se encontraron abonos" width="100" height="65" />;

  
  const status = (expiration: number) => {
    return (expiration == 1) ? 
    <span className=" status-success ">Activo</span> : 
    <span className=" status-danger cursor-pointer">Eliminado</span>;
  }

  const deleted = (record: any) => {
    return (<div>
                <div className=" text-sky-500 font-bold ">Eliminado por: {record?.deleted_by?.name}</div> 
                <div className=" text-sky-500 font-bold ">Fecha: {formatDate(record?.deleted_at)} | {formatTime(record?.deleted_at)}</div>
            </div>)}
  
  const listItems = records.data.map((record: any) => (
    <tr key={record.id} className={`border-b ${record.payment_type == 0 ? 'bg-blue-50' : 'bg-white'}`} >
      <td className="py-1 px-6 whitespace-nowrap">{formatDateAsDMY(record?.created_at)}</td> 
      <td className="py-1 px-6 truncate">{ numberToMoney(record?.quantity ? record?.quantity : 0, systemInformation) }</td>
      <td className="py-1 px-6 truncate">{ record?.employee?.name }</td>
      <td className="py-1 px-6">
      { record?.status == 0 ? <Tooltip animation="duration-300" 
      content={deleted(record)} >{ status(record?.status) }</Tooltip> : status(record?.status) }
      </td>
      <td className="py-1 px-6 flex m-1"><Button preset={record?.status == 0 ? Preset.smallInfo : 
                                        isLasElement?.id == record?.id && !isDisabled ? Preset.smallClose : Preset.smallCloseDisable} 
                                        disabled={
                                        record.payment_type == 0 ||
                                        record?.status == 0 || 
                                        isDisabled || 
                                        isLasElement?.id != record?.id} 
                                        noText onClick={()=>onDelete(record)} />

                                    {isLasElement?.id == record?.id && !isDisabled && (
                                    configuration.includes("print-link") ? <ButtonDownload autoclass={false} href={`/download/pdf/creditPayment/${record.id}`}>
                                                      <FaPrint className="clickeable ml-2" size={25} color="blue" />
                                                      </ButtonDownload> :          
                                      <Button preset={Preset.smallPrint} noText onClick={()=>isPrint()} style="ml-2" />)
                                    }
      </td>
    </tr>
  ));


  return (<div>
  <div className="w-full overflow-auto">
    <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
      <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
        <tr>
          <th scope="col" className="py-3 px-4 border">Fecha</th>
          <th scope="col" className="py-3 px-4 border">Cantidad</th>
          <th scope="col" className="py-3 px-4 border">Usuario</th>
          <th scope="col" className="py-3 px-4 border">Estado</th>
          <th scope="col" className="py-3 px-4 border">Del</th>
        </tr>
      </thead>
      <tbody>{listItems}</tbody>
    </table>
 </div>
 </div>);
}
