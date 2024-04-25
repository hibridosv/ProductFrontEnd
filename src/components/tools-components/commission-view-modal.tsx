"use client";
import { Modal } from "flowbite-react";
import { Button, Preset } from "../button/button";
import { useEffect, useState } from "react";
import toast, { Toaster } from 'react-hot-toast';
import { postData } from "@/services/resources";
import { getTotalOfItem, getTotalPercentage, numberToMoney } from "@/utils/functions";
import { Loading } from "../loading/loading";
import { Alert } from "../alert/alert";
import { formatDateAsDMY, formatHourAsHM } from "@/utils/date-formats";
import { ButtonDownload } from "../button/button-download";
import { FaDownload } from "react-icons/fa";


export interface CommissionViewModalProps {
    onClose: () => void;
    isShow: boolean;
    record?: any;
    random?: (value: number) => void;
}

export function CommissionViewModal(props: CommissionViewModalProps) {
    const { onClose, isShow, record, random } = props;
    const [sales, setSales] = useState(null as any);
    const [isSending, setIsSending] = useState(false);
    const [isPaying, setIsPaying] = useState(false);



    const handleGetCommission = async (data: any)=>{
        let datos = {} as any
        datos.option = (formatDateAsDMY(data.initial_date) == formatDateAsDMY(data.final_date)) ? 1 : 2;
        datos.initialDate = data.initial_date
        datos.finalDate = data.final_date
        datos.userId = data.referred_id
        try {
          setIsSending(true);
          setSales(null);
          const response = await postData(`tools/set-commissions`, "POST", datos);
          if (!response.message) {
            toast.success("Datos obtenidos correctamente");
            setSales(response.data);
          } else {
            toast.error("Faltan algunos datos importantes!");
          }
        } catch (error) {
          console.error(error);
          toast.error("Ha ocurrido un error!");
        } finally {
          setIsSending(false);
        }
    }

    useEffect(() => {
        if (isShow) {
            (async () => await handleGetCommission(record))();
        }
    }, [isShow, record]);

    const PayReport = async ()=>{
        try {
          setIsPaying(true);
          const response = await postData(`tools/pay-commissions`, "POST", {iden: record.id});
          if (!response.message) {
            random && random(Math.random());
            onClose()
          } else {
            toast.error("Faltan algunos datos importantes!");
          }
        } catch (error) {
          console.error(error);
          toast.error("Ha ocurrido un error!");
        } finally {
          setIsPaying(false);
        }
    }


    const deleteReport = async ()=>{
      try {
        setIsPaying(true);
        const response = await postData(`tools/commissions/${record.id}`, "DELETE");
        if (response.type == "successful") {
          random && random(Math.random());
          onClose()
        } else {
          toast.error("Faltan algunos datos importantes!");
        }
      } catch (error) {
        console.error(error);
        toast.error("Ha ocurrido un error!");
      } finally {
        setIsPaying(false);
      }
  }



    const listItems = sales?.map((record: any, key: any) => (
        <tr key={key} className={`border-b`}>
          <td className="py-2 px-6 truncate">{ record?.cod } </td>
          <th className="py-2 px-6 text-gray-900 whitespace-nowrap dark:text-white" scope="row">{ record?.product }</th>
          <td className="py-2 px-6">{ record?.quantity }</td>
          <td className="py-2 px-6">{ numberToMoney(record?.unit_price ? record?.unit_price : 0) }</td>
          <td className="py-2 px-6">{ numberToMoney(record?.discount ? record?.discount : 0) }</td>
          <td className="py-2 px-6">{ record?.commission ? record?.commission : 0 } %</td>
          <td className="py-2 px-6">{ numberToMoney(getTotalPercentage(record?.total, record?.commission)) }</td>
          <td className="py-2 px-6">{ numberToMoney(record?.total ? record?.total : 0) }</td>
        </tr>
      ));


      const getTotalCommission = (datos: any): any => {
        let totalSuma = 0;
        datos?.forEach((elemento: any) => {
            totalSuma =  getTotalPercentage(elemento?.total, elemento?.commission) + totalSuma;
        });
        return totalSuma;
      }

  return (
    <Modal size="6xl" show={isShow} position="center" onClose={onClose}>
      <Modal.Header>NUEVO REPORTE DE COMISIONES</Modal.Header>
      <Modal.Body>
        { isSending ? <Loading /> :
          <div>
                  <div className="w-full overflow-auto">
                    <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                        <tr>
                        <th scope="col" className="py-3 px-4 border">Codigo</th>
                        <th scope="col" className="py-3 px-4 border">Producto</th>
                        <th scope="col" className="py-3 px-4 border">Cant</th>
                        <th scope="col" className="py-3 px-4 border">Precio</th>
                        <th scope="col" className="py-3 px-4 border">Descuento</th>
                        <th scope="col" className="py-3 px-4 border">Comisión %</th>
                        <th scope="col" className="py-3 px-4 border">Comisión $</th>
                        <th scope="col" className="py-3 px-4 border">Total</th>
                        </tr>
                    </thead>
                    <tbody>{listItems}</tbody>
                    </table>
                    { sales ?
                    <div className="uppercase border-x-2 m-4 ">
                      { record?.type == 1 ? <div>
                          <div className="py-1 pl-5 border border-b-2 ">Cantidad de productos: <span className=" font-semibold">{ getTotalOfItem(sales, "quantity") }</span></div>
                          <div className="py-1 pl-5 border border-b-2 ">Total descuentos: <span className=" font-semibold">{ numberToMoney(getTotalOfItem(sales, "discount")) }</span></div>
                          <div className="py-1 pl-5 border border-b-2 ">Total de ventas: <span className=" font-semibold">{ numberToMoney(getTotalOfItem(sales, "total")) }</span></div>
                          <div className="py-1 pl-5 border border-b-2 ">Total de Comisión: <span className=" font-semibold">{ numberToMoney(getTotalCommission(sales)) }</span></div>
                          <div className="py-1 pl-5 border border-b-2 ">Total de Retenciones: <span className=" font-semibold">{ numberToMoney(getTotalCommission(sales)  * 0.10)}</span></div>
                          <div className="py-1 pl-5 border border-b-2 bg-lime-200">Total a Pagar: <span className=" font-semibold">{ numberToMoney(getTotalCommission(sales)  * 0.90)}</span></div>
                        </div> :
                        <div>
                          <div className="py-1 pl-5 border border-b-2 ">Cantidad de productos: <span className=" font-semibold">{ getTotalOfItem(sales, "quantity") }</span></div>
                          <div className="py-1 pl-5 border border-b-2 ">Total descuentos: <span className=" font-semibold">{ numberToMoney(getTotalOfItem(sales, "discount")) }</span></div>
                          <div className="py-1 pl-5 border border-b-2 ">Total de ventas: <span className=" font-semibold">{ numberToMoney(getTotalOfItem(sales, "total")) }</span></div>
                          <div className="py-1 pl-5 border border-b-2 ">Total de Comisiones otorgadas: <span className=" font-semibold">{ numberToMoney(getTotalCommission(sales)) }</span></div>
                          <div className="py-1 pl-5 border border-b-2 bg-red-200">Total Puntos de Oro: <span className="font-semibold">{ numberToMoney(getTotalCommission(sales) * 0.10) }</span></div>
                          <div className="py-1 pl-5 border border-b-2 ">Total de Retenciones: <span className=" font-semibold">{ numberToMoney((getTotalCommission(sales)  * 0.10) * 0.10)}</span></div>
                          <div className="py-1 pl-5 border border-b-2 bg-lime-200">Total a Pagar: <span className=" font-semibold">{ numberToMoney((getTotalCommission(sales) * 0.10)-((getTotalCommission(sales)  * 0.10) * 0.10) )}</span></div>
                        </div>
                      }
                    </div> : 
                    <div className="flex justify-center">
                      <Alert text="No se encuentran registros" isDismisible={false} />
                    </div> }
                </div>

                {
                  record && record.status == 0 && 
                  <div className="mt-4 font-semibold text-red-600">
                    Eliminado por: { record?.employee_deleted?.name } | 
                     { formatDateAsDMY(record?.deleted_at) } { formatHourAsHM(record?.deleted_at) }</div>
                }
          </div>
          }
      </Modal.Body>
      <Modal.Footer className="flex justify-end gap-4">
        {
           record && record.status == 2 && <ButtonDownload href={`/download/pdf/commission/${record.id}`}><FaDownload  size={24}/></ButtonDownload>
        }
        {
          record && record.status == 1 && <Button onClick={deleteReport} preset={Preset.cancel} text="ELIMINAR REPORTE" />
        }
        <Button onClick={onClose} preset={Preset.close} />
        {
          record && record.status == 1 && <Button onClick={()=>PayReport()} preset={isPaying ? Preset.saving : Preset.save} text="PAGAR REPORTE" />
        }
      </Modal.Footer>
    </Modal>
  );
}
