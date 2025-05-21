'use client'
import { useState, useEffect, useContext } from "react";
import { Alert, DeleteModal, Loading, ViewTitle } from "@/components";
import { getData, postData, postForPrint } from "@/services/resources";
import toast, { Toaster } from 'react-hot-toast';
import { Button, Preset } from "@/components/button/button";
import { formatDateAsDMY, formatHourAsHM } from "@/utils/date-formats";
import {  extractActiveFeature, getConfigStatus, getPaymentTypeName, getTotalOfItem, numberToMoney } from "@/utils/functions";
import { FaPrint } from "react-icons/fa";
import { RiDeleteBin2Line } from "react-icons/ri";
import { ConfigContext } from "@/contexts/config-context";
import { MdCreditScore } from "react-icons/md";
import { API_URL } from "@/constants";
import Link from "next/link";
import { InvoiceNCModal } from "@/components/invoice-components/invoice-nc-modal";


export default function Page({ params }: { params: { id: string } }) {
  const { id } = params;
  const [records, setRecords] = useState([]) as any;
  const [isSending, setIsSending] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showNoteModal, setShowNoteModal] = useState(false);

  const [showCodeStatus, setShowCodeStatus] = useState<boolean>(false);
  const { config, systemInformation } = useContext(ConfigContext);
  const [configuration, setConfiguration] = useState([] as any); // configuraciones que vienen de config

    useEffect(() => {
      if (config?.configurations) {
        setConfiguration(extractActiveFeature(config.configurations))
      }
      setShowCodeStatus(getConfigStatus("sales-show-code", config));
      // eslint-disable-next-line
    }, [config]);

  const handleGetInvoice = async () => {
      try {
        setIsSending(true)
        const response = await getData(`order?&filterWhere[id]==${id}&included=creditnotes,products,invoiceAssigned,employee,client,referred,delivery`);
        if (response.data) {
          setRecords(response?.data[0] ?? [])
          // toast.success("Petición realizada correctamente");
        } else {
          toast.error("Faltan algunos datos importantes!");
        }
      } catch (error) {
        console.error(error);
        toast.error("Ha ocurrido un error!");
      } finally {
        setIsSending(false)
      }
    };
  
    useEffect(() => {
      if (!showNoteModal && id) {
        (async () => { await handleGetInvoice() })();
      }
      // eslint-disable-next-line
    }, [showNoteModal]);

 
  const printOrder = async () => {
    try {
      setIsSending(true)
      const response = await postData(`invoices/print`, "POST", {invoice: id});
      if (response.type === 'successful') {
        if (configuration.includes("print-local")) {
          await postForPrint(systemInformation?.system?.local_url_print ?? 'http://127.0.0.1/impresiones/', 'POST', response.data);
        }
        toast.success("Imprimiendo documento");
      }
    } catch (error) {
      console.error(error);
      toast.error("Ha ocurrido un error!");
    } finally {
      setIsSending(false)
    }
  };



  const deleteOrder = async () => {
    setShowDeleteModal(false)
    try {
      setIsSending(true)
      const response = await postData(`invoices/delete`, "POST", {invoice: id});
      if (response.message) {
        await handleGetInvoice()
        toast.success(response.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("Ha ocurrido un error!");
    } finally {
      setIsSending(false)
    }
  };


    const listProducts = records.products && records?.products.map((record: any, key: any) => (
      <tr key={record.id} className="border-b">
        <td className="py-2 px-6 truncate">{ record?.quantity} </td>
        { showCodeStatus &&
        <td className="py-2 px-6 truncate">{ record?.cod} </td>
        }
        <th className="py-2 px-6 text-gray-900 whitespace-nowrap dark:text-white" scope="row">{ record?.product } </th>
        <td className="py-2 px-6">{ numberToMoney(record?.unit_price ? record?.unit_price : 0, systemInformation) }</td>
        <td className="py-2 px-6">{ numberToMoney(record?.subtotal ? record?.subtotal : 0, systemInformation) }</td>
        <td className="py-2 px-6">{ numberToMoney(record?.taxes ? record?.taxes : 0, systemInformation) }</td>
        <td className="py-2 px-6">{ numberToMoney(record?.discount ? record?.discount : 0, systemInformation) }</td>
        <td className="py-2 px-6">{ numberToMoney(record?.total ? record?.total : 0, systemInformation) }</td>
      </tr>
    ));


  return (

    <div className="grid grid-cols-1 md:grid-cols-4 pb-10">
        <div className="col-span-3">
          <ViewTitle text={`${records?.invoice_assigned?.name}: ${records?.invoice_assigned?.prefix}${String(records?.invoice).padStart(15, '0')}`} />
          {isSending ? <Loading /> :
            <div className="mx-3 my-8 ">

              <div className="grid grid-cols-4 md:grid-cols-8 gap-3 bg-white dark:bg-gray-900">
                        <div className={`col-span-2 border-2 border-slate-600 shadow-md shadow-cyan-500 rounded-md w-full`}>
                          <div className="w-full text-center">Cajero</div>
                          <div className="w-full text-center text-xl my-2 font-bold">{records?.employee?.name}</div>
                        </div>
                        <div className={`col-span-2 border-2 border-slate-600 shadow-md shadow-cyan-500 rounded-md w-full`}>
                          <div className="w-full text-center">Fecha</div>
                          <div className="w-full text-center text-xl my-2 font-bold">{ formatDateAsDMY(records?.charged_at) }</div>
                        </div>
                        <div className={`col-span-2 border-2 border-slate-600 shadow-md shadow-cyan-500 rounded-md w-full`}>
                          <div className="w-full text-center">Tipo</div>
                          <div className="w-full text-center text-xl my-2 font-bold">{ records?.invoice_assigned?.name }</div>
                        </div>
                        <div className={`col-span-2 border-2 border-slate-600 shadow-md shadow-cyan-500 rounded-md w-full`}>
                          <div className="w-full text-center">Pago</div>
                          <div className="w-full text-center text-xl my-2 font-bold">{ getPaymentTypeName(records?.payment_type) }</div>
                        </div>
              </div>

              <div className="w-full overflow-auto mt-4">
                  <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                      <tr>
                        <th scope="col" className="py-3 px-4 border">Cant</th>
                        { showCodeStatus &&
                        <th scope="col" className="py-3 px-4 border">Codigo</th>
                        }
                        <th scope="col" className="py-3 px-4 border">Producto</th>
                        <th scope="col" className="py-3 px-4 border">Precio</th>
                        <th scope="col" className="py-3 px-4 border">Subtotal</th>
                        <th scope="col" className="py-3 px-4 border">Imp</th>
                        <th scope="col" className="py-3 px-4 border">Descuento</th>
                        <th scope="col" className="py-3 px-4 border">Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {listProducts}
                      <tr>
                        <th scope="col" className="py-3 px-4 border" colSpan={showCodeStatus ? 4 : 3} ></th>
                        <th scope="col" className="py-3 px-4 border">{ numberToMoney(records?.subtotal, systemInformation) }</th>
                        <th scope="col" className="py-3 px-4 border">{ numberToMoney(records?.taxes, systemInformation) }</th>
                        <th scope="col" className="py-3 px-4 border">{ numberToMoney(records?.discount, systemInformation) }</th>
                        <th scope="col" className="py-3 px-4 border">{ numberToMoney(records?.total, systemInformation) }</th>
                      </tr>
                    </tbody>
                  </table>
              </div>

              <div className="uppercase shadow-lg border-x-2 ml-4 my-4 p-2">
                {records?.employee && <div>Atendido por: <span className="font-semibold">{records?.employee?.name}</span></div>}
                {records?.referred && <div>Nombre de referido: <span className="font-semibold">{records?.referred?.name}</span></div>}
                {records?.client && <div>Nombre del cliente: <span className="font-semibold">{records?.client?.name}</span></div>}
                {records?.delivery && <div>Nombre del repartidor: <span className="font-semibold">{records?.data?.delivery?.name}</span></div>}
            </div>

          {
            records?.invoice_assigned?.type == 9 && 
            <Alert className="m-2" text="Este Documento tiene una numeración temporal" />
          }
          {
            records?.invoice_assigned?.is_electronic == 1 && 
            <Alert className="m-2" info="Atención: " text="Este Documento se envió electronicamente" isDismisible={false}  />
          }
          {
            records?.creditnotes?.length > 0 && 
            <div>
              <Alert className="m-2" info="Atención: " text={`Este documento contiene ${records?.creditnotes?.length} nota${records?.creditnotes?.length > 1 ? 's' : ''} de credito`} isDismisible={false}  />
                  <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                      <tr>
                        <th scope="col" className="py-3 px-4 border">ID</th>
                        <th scope="col" className="py-3 px-4 border">Numero</th>
                        <th scope="col" className="py-3 px-4 border">Fecha</th>
                        <th scope="col" className="py-3 px-4 border">Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {records?.creditnotes?.map((record: any, key: any) => (
                        <tr key={key} className="border-b">
                          <th className="py-2 px-6 text-gray-900 whitespace-nowrap uppercase" scope="row">
                            <a target="_blank" href={`${API_URL}documents/download/pdf/${record?.id}/${systemInformation?.system?.client?.id}`} title="Descargar PDF">{record?.id}</a> 
                            </th>
                          <td className="py-2 px-6">{record?.invoice}</td>
                          <td className="py-2 px-6">{ formatDateAsDMY(record?.emited_at) } { formatHourAsHM(record?.emited_at) }</td>
                          <td className="py-2 px-6">{ numberToMoney(record?.total, systemInformation) }</td>
                        </tr>
                      ))}
                      <tr>
                        <th scope="col" className="py-3 px-4 border" colSpan={3} ></th>
                        <th scope="col" className="py-3 px-4 border">{ numberToMoney(getTotalOfItem(records?.creditnotes, "total"), systemInformation) }</th>
                      </tr>
                    </tbody>
                  </table>
              
            </div>
          }
            </div>
          }
          {
            records?.invoice_assigned?.is_electronic == 1 && 
            <a target="_blank" href={`${API_URL}documents/download/pdf/${id}/${systemInformation?.system?.client?.id}`} title="Descargar PDF"><span className="m-4 font-semibold uppercase text-slate-700 text-sm">{ id }</span></a> 
          }
          
        </div>
        <div>
          <ViewTitle text="OPCIONES" />
          <div className="mt-4">

            <div className="m-3 flex justify-between mb-8">
              <div title="Imprimir"><FaPrint className="clickeable" size={45} color="blue" onClick={()=>printOrder()} /></div>
              {
                (records?.invoice_assigned?.type == 3 || records?.invoice_assigned?.type == 2) &&
                <div title="Crear nota de credito"><MdCreditScore className="clickeable" size={45} color="#2F81B9" 
                  onClick={records?.status == 3 ? ()=>setShowNoteModal(true) : ()=>toast.error("Este documento ya se encuentra eliminado")} /></div>
              }

              <div title="Eliminar orden"><RiDeleteBin2Line className="clickeable" size={45} color="red" 
              onClick={records?.status == 3 ? ()=>setShowDeleteModal(true) : ()=>toast.error("Este documento ya se encuentra eliminado")} /></div>
            </div>
            
            <Link href={`/invoices/search`}>
              <Button text='REGRESAR' isFull type="submit" preset={Preset.cancel} />
            </Link>
            {
              records?.status == 4 && <div className="mt-4"><Alert info="Atención: " text="Este documento se encuentra eliminado" isDismisible={false}  /></div>
            }
          </div>
        </div> 
        
        <InvoiceNCModal isShow={showNoteModal} onClose={()=>setShowNoteModal(false)} record={records} />
        <DeleteModal isShow={showDeleteModal}
          text="¿Estas seguro de anular este documento?"
          onDelete={()=>deleteOrder()} 
          onClose={()=>setShowDeleteModal(false)} />

      <Toaster position="top-right" reverseOrder={false} />
    </div>
  );
}