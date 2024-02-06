"use client";
import { Modal } from "flowbite-react";
import { Button, Preset } from "../button/button";
import { DateRange } from "../form/date-range";
import { style } from "@/theme";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import toast, { Toaster } from 'react-hot-toast';
import { postData } from "@/services/resources";
import { getTotalOfItem, getTotalPercentage, loadData, numberToMoney } from "@/utils/functions";
import { Loading } from "../loading/loading";
import { Alert } from "../alert/alert";


export interface CommissionAddModalProps {
    onClose: () => void;
    isShow: boolean;
    record?: any;
}

export function CommissionAddModal(props: CommissionAddModalProps) {
    const { onClose, isShow } = props;
    const { register, watch } = useForm();
    const [sales, setSales] = useState(null as any);
    const [users, setUsers] = useState([] as any);
    const [sendData, setSendData] = useState({} as any);
    const [isSending, setIsSending] = useState(false);

    useEffect(() => {
        if (isShow) {
            (async () => setUsers(await loadData(`contacts/referrals`)))();
            setSales(null);
        }
    }, [isShow]);


    const handleGetCommission = async (data: any)=>{
        data.userId = watch("userId")
        try {
          setIsSending(true);
          setSales(null);
          const response = await postData(`tools/set-commissions`, "POST", data);
          if (!response.message) {
            toast.success("Datos obtenidos correctamente");
            setSales(response.data);
            setSendData(data)
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


    const sendCommission = async ()=>{
        try {
          setIsSending(true);
          setSales(null);
          const response = await postData(`tools/new-commissions`, "POST", sendData);
          if (!response.message) {
            onClose()
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
    <Modal size={`${sales ? '5xl' : 'md'}`} show={isShow} position="center" onClose={onClose}>
      <Modal.Header>NUEVO REPORTE DE COMISIONES</Modal.Header>
      <Modal.Body>
        { isSending ? <Loading /> : <>
        { sales ?
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
                    { sales?.length > 0 ?
                    <div className="uppercase shadow-lg border-x-2 ml-4 mt-4 ">
                        <div>Cantidad de productos: <span className="font-semibold">{ getTotalOfItem(sales, "quantity") }</span></div>
                        <div>Total descuentos: <span className="font-semibold">{ numberToMoney(getTotalOfItem(sales, "discount")) }</span></div>
                        <div>Total de ventas: <span className="font-semibold">{ numberToMoney(getTotalOfItem(sales, "total")) }</span></div>
                        <div>Total de Comisión: <span className="font-semibold">{ numberToMoney(getTotalCommission(sales)) }</span></div>
                        <div>Total de Retenciones: <span className="font-semibold">{ numberToMoney(getTotalCommission(sales)  * 0.10)}</span></div>
                        <div>Total a Pagar: <span className="font-semibold">{ numberToMoney(getTotalCommission(sales)  * 0.90)}</span></div>
                    </div> : 
                    <div className="flex justify-center">
                      <Alert text="No se encuentran registros" isDismisible={false} />
                    </div> }
                </div>
          </div>: 
          <div> 
             {/* <Alert info="Nota!:" text="La ultima fecha reportada es: 21/03/2023" isDismisible={false} /> */}
            <div className="flex flex-wrap m-4 shadow-lg border-2 rounded-md mb-8">
              <div className="w-full md:w-full px-3 mb-2">
                    <label htmlFor="userId" className={style.inputLabel}> Seleccione el usuario </label>
                    <select id="userId" {...register("userId")} className={style.input} >
                        {!users && <option value=""> Cargando... </option>}
                        {users?.data?.map((value: any) => {
                            return (
                                <option key={value.id} value={value.id}> {value.name} </option>
                                );
                        })}
                    </select>
                </div>
            </div>
            <DateRange onSubmit={handleGetCommission} />
          </div>
           }
        </>}
      </Modal.Body>
      <Modal.Footer className="flex justify-end gap-4">
        <Button onClick={onClose} preset={Preset.close} />
        {
           sales && sales.length > 0 && <Button onClick={()=>sendCommission()} preset={Preset.save} text="CREAR NUEVO REPORTE" />
        }
      </Modal.Footer>
    </Modal>
  );
}
