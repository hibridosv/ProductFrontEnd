"use client";
import { Modal } from "flowbite-react";
import { Button, Preset } from "../button/button";
import { useEffect, useState } from "react";
import toast, { Toaster } from 'react-hot-toast';
import { postData } from "@/services/resources";
import { getTotalOfItem, getTotalPercentage, numberToMoney } from "@/utils/functions";
import { Loading } from "../loading/loading";
import { Alert } from "../alert/alert";
import { formatDateAsDMY } from "@/utils/date-formats";
import { getUrlFromCookie } from "@/services/oauth";


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
    const remoteUrl = getUrlFromCookie();




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
    <Modal size="5xl" show={isShow} position="center" onClose={onClose}>
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
                    <div className="uppercase shadow-lg border-x-2 ml-4 mt-4 ">
                        <div>Cantidad de productos: <span className=" font-semibold">{ getTotalOfItem(sales, "quantity") }</span></div>
                        <div>Total descuentos: <span className=" font-semibold">{ numberToMoney(getTotalOfItem(sales, "discount")) }</span></div>
                        <div>Total de ventas: <span className=" font-semibold">{ numberToMoney(getTotalOfItem(sales, "total")) }</span></div>
                        <div>Total de Comisión: <span className=" font-semibold">{ numberToMoney(getTotalCommission(sales)) }</span></div>
                        <div>Total de Retenciones: <span className=" font-semibold">{ numberToMoney(getTotalCommission(sales)  * 0.10)}</span></div>
                        <div>Total a Pagar: <span className=" font-semibold">{ numberToMoney(getTotalCommission(sales)  * 0.90)}</span></div>
                    </div> : 
                    <div className="flex justify-center">
                      <Alert text="No se encuentran registros" isDismisible={false} />
                    </div> }
                </div>
          </div>
          }
      </Modal.Body>
      <Modal.Footer className="flex justify-end gap-4">
        {
           record && record.status == 2 && <a target="_blank" href={`${remoteUrl}/download/pdf/commission/${record.id}`} className="py-2 px-4 flex justify-center items-center text-white transition ease-in duration-200 text-center text-base font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2  rounded-lg  bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500 focus:ring-offset-indigo-200 clickeable">DESCARGAR PDF</a>
        }
        <Button onClick={onClose} preset={Preset.close} />
        {
          record && record.status == 1 && <Button onClick={()=>PayReport()} preset={isPaying ? Preset.saving : Preset.save} text="PAGAR REPORTE" />
        }
      </Modal.Footer>
    </Modal>
  );
}
