"use client";
import { useState, useEffect } from "react";
import { getData, postData } from "@/services/resources";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Loading } from "../loading/loading";
import { Category } from "@/services/products";
import { Button, Preset } from "../button/button";
import { ListCategories } from "./list-categories";
import { AddCategoriesModal } from "../modals/add-categories-modal";
import { DeleteModal } from "../modals/delete-modal";


export interface CategoryAddListProps {
  option: number;
}

export function CategoryAddList(props: CategoryAddListProps) {
  const { option } = props;
  const [ categories, setCategories ] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(false);
  const [showModalCategories, setShowModalCategories] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [categorySelect, setCategorySelect] = useState("");

  const loadCategories = async () => {
    setIsLoading(true);
    try {
      const response = await getData(`categoriesfull`);
      setCategories(response.data);
    } catch (error) {
        console.error(error);
    } finally {
        setIsLoading(false);
    }
};

useEffect(() => {
    if (option === 1 && showModalCategories === false) {
        (async () => { await loadCategories() })();
    }
    // eslint-disable-next-line
}, [option, showModalCategories]);

const handleDelete = (iden: string) => {
  setCategorySelect(iden);
  setShowDeleteModal(true);
}

const deleteCategory = async (iden: any) => {
  try {
    const response = await postData(`categories/${categorySelect}`, 'DELETE');
    if (response.type === "successfull") {
      toast.success( "Categoria eliminada correctamente", { autoClose: 2000 });
      await loadCategories()
    } else {
      toast.error("Ha Ocurrido un Error!", { autoClose: 2000 });
    }
    setCategorySelect("");
    setShowDeleteModal(false);
  } catch (error) {
    console.error(error);
    toast.error("Ha Ocurrido un Error!", { autoClose: 2000 });
  } 
}

if (option != 1) return null

  return (
        <div className="grid grid-cols-1 md:grid-cols-4 pb-10">
            <div className="col-span-3">
              <Button isFull text="Agregar nueva categoría" preset={Preset.accept} onClick={() => setShowModalCategories(true)} />
              { isLoading ? <Loading /> : <ListCategories categories={categories} onDelete={handleDelete} /> }
            </div>
              { !isLoading && <AddCategoriesModal isShow={showModalCategories} onClose={() => setShowModalCategories(false)} /> }
              { showDeleteModal && 
              <DeleteModal
              text="¿Está seguro de eliminar esta categoría?"
              onDelete={deleteCategory} 
              onClose={()=>setShowDeleteModal(false)} /> }
              <ToastContainer />
        </div>
  );
}
