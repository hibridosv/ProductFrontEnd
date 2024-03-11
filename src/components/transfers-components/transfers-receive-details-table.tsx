'use client'
import { NothingHere } from "../nothing-here/nothing-here";
import { AiOutlineFundView } from "react-icons/ai";
import { Button, Preset } from "../button/button";
import { useEffect, useState } from "react";
import { getData, postData } from "@/services/resources";
import { toast, Toaster } from "react-hot-toast";
import { MdCheck, MdOutlineDownloading } from "react-icons/md";
import { DeleteModal } from "../modals/delete-modal";

const checkCodReceive = (data: any) => {
  for (let i = 0; i < data.length; i++) {
    if (data[i].status == 1 && data[i].cod_receive == "") {
      return true;
    }
  }
  return false;
};


interface TransfersReceiveDetailsTableProps {
  records?:  any;
  onClose: () => void;
}

export function TransfersReceiveDetailsTable(props: TransfersReceiveDetailsTableProps) {
  const { records, onClose } = props;
  const [transfer, setTransfer] = useState(records);
  const [isloading, setIsloading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showDeleteModalTransfer, setShowDeleteModalTransfer] = useState(false);
  const [selectProduct, setSelectProduct] = useState({} as any);

  const initialData = async () =>{
    try {
      setIsloading(true)
      const response = await getData(`transfers/check/${transfer.id}`);
      if (!response.message) {
        setTransfer(response.data)
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("Ha Ocurrido un Error!");
    } finally {
      setIsloading(false)
    }
  }
  
  useEffect(() => {
      if (checkCodReceive(transfer.products)) {
        (async () => await initialData())();
      }
  }, []);


  const createNewRegister = async (data: any) => {
    console.log("Data: ", data)
    try {
      setIsSending(true);
      const response = await postData(`transfers/products/create/${data.id}`, "PUT", { create: 1 });
      if (!response.message) {
        await initialData();
        toast.success("Producto agregado correctamente");
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

  const isDeleteProduct = (product:any) => {
    setSelectProduct(product);
    setShowDeleteModal(true);
  }

  const handleDeleteProduct = async()=>{
    setShowDeleteModal(false);
    try {
      setIsSending(true);
      const response = await postData(`transfers/products/${selectProduct.id}`, "PUT", { status: 3 });
      if (response.type == "successful") {
        await initialData();
        toast.success("Producto eliminado correctamente");
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

  const handleCancelAll = async ()=>{
    console.log(transfer)
    setShowDeleteModalTransfer(false)
    try {
      setIsSending(true);
      const response = await postData(`transfers/cancel/${transfer.id}`, "PUT", { status: 5 });
      if (!response.message) {
        await initialData();
        toast.success("Transferencia finalizada correctamente");
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

  const handleAceptAll = async ()=>{
    try {
      setIsSending(true);
      const response = await postData(`transfers/accept/${transfer.id}`, "PUT", { is_online: 0, status: 4 });
      if (!response.message) {
        await initialData();
        toast.success("Producto eliminado correctamente");
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



  if (!transfer.products) return <NothingHere width="164" height="98" />;
  if (transfer.products.length == 0) return <NothingHere text="No se encontraron productos" width="164" height="98" />;

  const status = (status: number)=>{
      switch (status) {
        case 1: return <span className="status-info uppercase">Activo</span>
        case 2: return <span className="status-success uppercase">Aceptado</span>
        case 3: return <span className="status-danger uppercase">Rechazado</span>
        default: return <span>Activo</span>
      }
  }

  const listItems = transfer.products.map((record: any) => (
    <tr key={record.id} className={`border-b bg-white`} >
      <td className="py-3 px-6 whitespace-nowrap">{ record?.cod }</td> 
      <td className="py-3 px-6 whitespace-nowrap">{ record?.description }</td> 
      <td className="py-3 px-6 truncate">{ record?.quantity }</td>
      <td className="py-3 px-6 truncate">{ status(record?.status) }</td>
      <td className={`py-3 px-6 truncate font-semibold ${ isloading ? 'text-orange-500' : record?.cod_receive ? 'text-green-500' : 'text-red-500' }`} title={record?.cod_receive ? "Registro correcto" : "Debe agregar un registro que coincida con el codigo del producto entrante"}>
        { isloading ? "ESPERE ..." : record?.cod_receive ? "CON REGISTRO" : "SIN REGISTRO" }</td>
        { transfer.status == 2 && 
          <td className="py-3 px-6 truncate">
            <span className="flex justify-between">
            {
              record?.cod_receive ? <MdCheck size={20} className="text-lime-600" /> :
              isSending ? <MdOutlineDownloading size={20} className="text-teal-500 animate-spin" /> : 
              <AiOutlineFundView size={20} title="Agregar registro nuevo de este producto" className="text-red-600 clickeable" onClick={record.status == 1 ? ()=>createNewRegister(record) : ()=>console.log()} />
            }
            <Button preset={record.status != 1 ? Preset.smallCloseDisable : Preset.smallClose} disabled={record.status != 1} noText onClick={()=>isDeleteProduct(record)} />
            </span>
          </td> }
    </tr>
  ));


  return (<div>
  <div className="w-full overflow-auto">
    <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
      <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
        <tr>
          <th scope="col" className="py-3 px-4 border">Codigo</th>
          <th scope="col" className="py-3 px-4 border">Descripcion</th>
          <th scope="col" className="py-3 px-4 border">Cantidad</th>
          <th scope="col" className="py-3 px-4 border">Estado</th>
          <th scope="col" className="py-3 px-4 border">Registro</th>
          { transfer.status == 2 && <th scope="col" className="py-3 px-4 border">OP</th>}
        </tr>
      </thead>
      <tbody>{listItems}</tbody>
    </table>
    <div className="flex justify-end m-8">
        <Button onClick={onClose} disabled={isSending} text="REGRESAR" preset={Preset.add} style="m-3" />
        { transfer.status == 2 ? <>
        <Button text="RECHAZAR" onClick={()=>setShowDeleteModalTransfer(true)} disabled={isSending} preset={Preset.cancel} style="m-3" />
        <Button text="ACEPTAR TODO" onClick={handleAceptAll} preset={isSending ? Preset.saving : Preset.save} disabled={checkCodReceive(transfer.products)} style="m-3" />
        </> :
        <Button disabled={isSending} text="DESCARGAR REPORTE" preset={Preset.save} style="m-3" />
        }
    </div>
 </div>
 <DeleteModal isShow={showDeleteModal} text="¿Estas seguro de eliminar este producto?" onDelete={handleDeleteProduct} onClose={()=>setShowDeleteModal(false)} /> 
 <DeleteModal isShow={showDeleteModalTransfer} text="¿Estas seguro de rechazar toda la transferencia?" onDelete={handleCancelAll} onClose={()=>setShowDeleteModalTransfer(false)} /> 
 <Toaster position="top-right" reverseOrder={false} />
 </div>);
}
