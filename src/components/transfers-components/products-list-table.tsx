'use client'
import { NothingHere } from "../nothing-here/nothing-here";
import { useContext, useState } from "react";
import { DeleteModal } from "../modals/delete-modal";
import { IoIosAlert, IoIosCloseCircle } from "react-icons/io";
import { toast, Toaster } from "react-hot-toast";
import { postData } from "@/services/resources";
import { ChangeQuantityModal } from "./change-quantity-modal";
import { numberToMoney } from "@/utils/functions";
import { ConfigContext } from "@/contexts/config-context";



interface TransferProductListTableProps {
  records?:  any;
  products: (value: any) => void;
  deleteActive?: boolean; 
  handleUpdateQuantity: (recordSelect: any, quantity: number) => void
}

export function TransferProductListTable(props: TransferProductListTableProps) {
  const { records, products, handleUpdateQuantity, deleteActive = false } = props;
  const [recordSelect, setRecordSelect] = useState<any>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showQuantityModal, setShowQuantityModal] = useState(false);
  const { systemInformation } = useContext(ConfigContext);



  if (!records.data) return <NothingHere width="164" height="98" />;
  if (records.data.length == 0) return <NothingHere text="No se encontraron datos" width="164" height="98" />;

  const handleRecordSelectDelete = (record: any) => {
    setRecordSelect(record);
    setShowDeleteModal(true);
  }

    // Función para eliminar el elemento con el ID específico
    const deleteItem = (id: string)=> {
      const newData = records.data.filter((item: any) => item.id !== id);
      return { data: newData };
    }

  const handleRecordDelete = async (recordSelect: any)=> {

    try {
      const response = await postData(`transfers/products/${recordSelect.id}`, "DELETE");
      if (!response.message) {
        setShowDeleteModal(false);
        setRecordSelect(null);
        products(deleteItem(response.data.id))
        toast.success("Producto Eliminado");
      } else {
        toast.error("Faltan algunos datos importantes!");
      }
    } catch (error) {
      console.error(error);
      toast.error("Ha ocurrido un error!");
    }
  }

  const handleRecordUpdate = (record: any) => {
    setRecordSelect(record);
    setShowQuantityModal(true);
  }

  const updateQuantity = (quantity: number) => {
    handleUpdateQuantity(recordSelect, quantity);
    setShowQuantityModal(true);
  }

  let total = 0;

  const listItems = records.data.map((record: any, index: any) => {
    // Calcular el subtotal para esta iteración
    const subtotal = JSON.parse(records?.data?.[index]?.product_json)?.unit_cost * record?.quantity;
    // Sumar el subtotal al total general
    total += subtotal;

    return (
      <tr key={record.id} className={`border-b ${record.requested_exists == 0 ? "bg-orange-100" : "bg-white"}`} title={`${record.requested_exists == 0 ? "El producto no existe en el inventario" : ""}`} >
        <td className="py-3 px-6">{ record?.cod }</td>
        <td className="py-3 px-6 whitespace-nowrap">{ record?.description }</td> 
        <td className="py-3 px-6 whitespace-nowrap">{ numberToMoney(JSON.parse(records?.data?.[index]?.product_json)?.unit_cost, systemInformation) }</td> 
        <td className={`py-3 px-6 truncate ${record.requested_exists == 1 && "clickeable"}`} onClick={record.requested_exists == 1 ? ()=>handleRecordUpdate( record ) : ()=>{}}>{ record?.quantity }</td>
        <td className="py-3 px-6 whitespace-nowrap">{ numberToMoney(subtotal, systemInformation)}</td> 
        <td className="py-2 px-6 truncate">
          <span className="flex justify-between">
            {
              record.requested_exists == 1 || deleteActive ? 
              <IoIosCloseCircle size={24} title="Eliminar Producto" className="text-red-600 clickeable" onClick={()=>handleRecordSelectDelete(record)} /> :
              <IoIosAlert size={24} className="clickeable text-amber-400" onClick={()=> { toast.error("Producto no exite en inventario")}} />
            }
          </span>
          </td>
      </tr>
    );
  });
  

  return (<div>
  <div className="w-full overflow-auto">
    <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
      <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
        <tr>
          <th scope="col" className="py-3 px-4 border">Codigo</th>
          <th scope="col" className="py-3 px-4 border">Descripción</th>
          <th scope="col" className="py-3 px-4 border">Precio Costo</th>
          <th scope="col" className="py-3 px-4 border">Cantidad</th>
          <th scope="col" className="py-3 px-4 border">Total</th>
          <th scope="col" className="py-3 px-4 border">OP</th>
        </tr>
      </thead>
      <tbody>{listItems}</tbody>
    </table>
    <div className=" font-medium uppercase text-lg text-teal-700 text-right mt-3">Total: {numberToMoney(total, systemInformation)}</div>
    <ChangeQuantityModal isShow={showQuantityModal} onClose={()=>setShowQuantityModal(false)} handleUpdateQuantity={updateQuantity} />
    <Toaster position="top-right" reverseOrder={false} />
    <DeleteModal isShow={showDeleteModal}
              text="¿Está seguro de eliminar este producto?"
              onDelete={()=>handleRecordDelete(recordSelect)}
              onClose={()=>setShowDeleteModal(false)} /> 
 </div>
 </div>);
}
