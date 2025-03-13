'use client'
import {  useEffect, useState } from "react";
import { Modal } from "flowbite-react";
import { Button, Preset } from "../button/button";
import { getData } from "@/services/resources";
import toast, { Toaster } from "react-hot-toast";
import { formatDate, formatHourAsHM } from "@/utils/date-formats";
import { FaRegSave } from "react-icons/fa";
import { Loading } from "../loading/loading";
import { RiCloseCircleFill } from "react-icons/ri";

export interface ProductChangeLotModalProps {
    onClose: () => void;
    isShow?: boolean;
    product: any;
    lotSelected: any;
    setLotSelected: (product: any) => void;
}

export function ProductChangeLotModal(props: ProductChangeLotModalProps){
    const { onClose, isShow, product, lotSelected, setLotSelected } = props;
    const [isSending, setIsSending] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [lot, setLot] = useState([]);
    
    
    const loadInvoiceLots = async () => {
        try {
            setIsLoading(true);
          const response = await getData(`registers/product?filterWhere[product_id]==${product?.id}&filterWhere[status]==1`);
          setLot(response.data);
        } catch (error) {
          console.error(error);
        } finally {
            setIsLoading(false);
        }
      };
    
      useEffect(() => {
        if (isShow) {
            (async () => { await loadInvoiceLots(); })();
        }
        // eslint-disable-next-line
      }, [isShow]);

      const handleSelectedLot = (record: any) => {
        setLotSelected(record)
        onClose()
      }
    
    
      const listItems = lot?.map((record: any):any => (
            <tr key={record.id} className={`border-b ${lotSelected?.lot_id === record.id ? 'bg-blue-200 font-bold text-blue-900' : 'bg-white'}`} >
                <td className='py-3 px-6'>{ record.actual_stock }</td>
                <td className="py-3 px-6">{ formatDate(record.created_at) } { formatHourAsHM(record.created_at) }</td>
                <td className="py-3 px-6">{ formatDate(record.expiration)}</td>
                <td className="py-3 px-6">{ record.lot }</td>
                <td className="py-2 truncate">
                <span className="flex justify-between">
                    {
                    lotSelected?.id === record.id ? <RiCloseCircleFill size={20} className="text-red-600 clickeable" onClick={()=>handleSelectedLot([])} /> :
                    record.actual_stock < lotSelected?.quantity ? <FaRegSave size={20} className="text-gray-700 clickeable" onClick={()=> toast.error("No existen cantidades suficientes en este lote")} /> : 
                    <FaRegSave size={20} className="text-lime-700 clickeable" onClick={()=>handleSelectedLot(record)} />
                    }
                </span>
                </td>
            </tr>
    ))
    
    return (
    <Modal show={isShow} position="center" onClose={onClose} size="2xl">
      <Modal.Header>Seleccionar el lote a descontar</Modal.Header>
      <Modal.Body>

        <div className="text-center text-gray-500 dark:text-gray-400 font-semibold text-xl mb-2 uppercase">
            {product?.product }
        </div>
        <div>
            { lot.length == 0 && <p className="text-center text-gray-500 dark:text-gray-400">No hay lotes disponibles</p> }
        </div>
        {
            isLoading ? <Loading text="Obteniendo Lotes" /> :
            <div className="rounded-sm shadow-md w-full ">
            <div className="overflow-auto">
                <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                    <tr>
                    <th scope="col" className="py-3 px-4 border">Cant.</th>
                    <th scope="col" className="py-3 px-4 border">Fecha</th>
                    <th scope="col" className="py-3 px-4 border">Vence</th>
                    <th scope="col" className="py-3 px-4 border">Lote</th>
                    <th scope="col" className="py-3 border"></th>
                    </tr>
                </thead>
                <tbody>
                    {listItems}
                </tbody>
                </table>
            </div>
        </div>
        }
      <Toaster position="top-right" reverseOrder={false} />
      </Modal.Body>
      <Modal.Footer className="flex justify-end">
        <Button onClick={onClose} preset={Preset.close} isFull disabled={isSending} /> 
      </Modal.Footer>
    </Modal>)
}