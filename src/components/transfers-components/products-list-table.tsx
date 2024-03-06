'use client'
import { NothingHere } from "../nothing-here/nothing-here";
import { useState } from "react";
import { DeleteModal } from "../modals/delete-modal";
import { IoIosCloseCircle } from "react-icons/io";
import { toast, Toaster } from "react-hot-toast";
import { postData } from "@/services/resources";

interface TransferProductListTableProps {
  records?:  any;
  products: (value: any) => void;
}

export function TransferProductListTable(props: TransferProductListTableProps) {
  const { records, products } = props;
  const [recordSelect, setRecordSelect] = useState<any>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

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

  const listItems = records.data.map((record: any) => (
    <tr key={record.id} className="border-b bg-white" >
      <td className="py-3 px-6">{ record?.cod }</td>
      <td className="py-3 px-6 whitespace-nowrap">{ record?.description }</td> 
      <td className="py-3 px-6 truncate">{ record?.quantity }</td>
      <td className="py-2 px-6 truncate">
        <span className="flex justify-between">
        <IoIosCloseCircle size={20} title="Ver detalles" className="text-red-600 clickeable" onClick={()=>handleRecordSelectDelete(record)} />
        </span>
        </td>
    </tr>
  ));


  return (<div>
  <div className="w-full overflow-auto">
    <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
      <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
        <tr>
          <th scope="col" className="py-3 px-4 border">Codigo</th>
          <th scope="col" className="py-3 px-4 border">Descripción</th>
          <th scope="col" className="py-3 px-4 border">Cantidad</th>
          <th scope="col" className="py-3 px-4 border">OP</th>
        </tr>
      </thead>
      <tbody>{listItems}</tbody>
    </table>
    <Toaster position="top-right" reverseOrder={false} />
    <DeleteModal isShow={showDeleteModal}
              text="¿Está seguro de eliminar este contacto?"
              onDelete={()=>handleRecordDelete(recordSelect)}
              onClose={()=>setShowDeleteModal(false)} /> 
 </div>
 </div>);
}
