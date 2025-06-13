"use client";
import { useEffect, useState } from "react";
import { getData, postData } from "@/services/resources";
import { MdDelete } from "react-icons/md";
import { Loading } from "@/components/loading/loading";
import { AiOutlineLoading } from "react-icons/ai";
import { ViewTitle } from "@/components/view-title/view-title";
import { BiPlusCircle } from "react-icons/bi";
import { NothingHere } from "@/components/nothing-here/nothing-here";
import { DeleteModal } from "@/components/modals/delete-modal";
import { AddCategoriesModal } from "./add-categories-modal";

export interface CategoriesListProps {
  reload: () => void;
}

export function CategoriesList(props: CategoriesListProps) {
  const { reload } = props;
  const [showModalCategories, setShowModalCategories] = useState(false);
  const [selectOption, setSelectOption] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [ categories, setCategories ] = useState([])
  const [isSending, setIsSending] = useState(false);


      const sendDataDelete = async(id: any) => {
          setIsSending(true)
          try {
              const response = await postData(`categories/${id}`, 'DELETE');
              if (response.type === 'successful') {
                setCategories(categories.filter((item: any) => item.id !== id))
                reload();
              }
            } catch (error) {
              console.error(error);
            } finally {
              setIsSending(false)
              setSelectOption("");
              setShowDeleteModal(false);
            }
      };

      const loadOptions = async () => {
          setIsLoading(true);
          try {
              const option = await getData(`categories?sort=created_at&filterWhere[category_type]==2&filterWhere[is_restaurant]==1`);
              setCategories(option.data);
          } catch (error) {
              console.error(error);
          } finally {
              setIsLoading(false);
        }
    };

    useEffect(() => {
        (async () => { await loadOptions() })();
    // eslint-disable-next-line
    }, []);


      const listCategories = categories?.map((option: any):any => (
            <div key={option.id} >
                <li className="flex justify-between p-3 hover:bg-blue-50 hover:red-blue-800">
                    <span>{option?.name}</span>  
                    { isSending ? <AiOutlineLoading size={24} className="animate-spin" /> : option?.principal == 1 ? 
                    <MdDelete size={24} color="gray" /> :
                    <MdDelete size={24} color="red" className="clickeable" onClick={() => { setSelectOption(option.id); setShowDeleteModal(true); }} /> }
                </li>
            </div>
        ))

  return (
    <div>
        <div className="flex justify-between">
          <ViewTitle text="CATEGORÍAS" />
          <BiPlusCircle size={32} className="col-span-11 m-4 text-2xl text-sky-900 clickeable" onClick={()=>setShowModalCategories(true)} />
          </div>
        { isLoading ? <Loading /> : <>
        <div className="mx-4">
          { categories.length === 0 ? <NothingHere text="No hay categorías" width="165" height="99" /> :
            <div>
              <li className="flex font-semibold text-cyan-800">Categorías Agregadas</li>
              { listCategories }
            </div>
          }
        </div>
        </>}

        <AddCategoriesModal isShow={showModalCategories} onClose={() => setShowModalCategories(false)} reload={loadOptions} />

            <DeleteModal isShow={showDeleteModal}
            text="¿Estas seguro de eliminar esta Categoría? Al eliminarla los productos asociados pasarán a la categoría por principal."
            onDelete={()=>sendDataDelete(selectOption)} 
            onClose={()=>setShowDeleteModal(false)} />
    </div>
  );
}
