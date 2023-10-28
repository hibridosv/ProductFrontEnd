"use client";
import { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Button, Preset } from "../button/button";
import { AddBrandsModal } from "../modals/add-brands-modal";
import { getData, postData } from "@/services/resources";
import { Brand } from "@/services/products";
import { Loading } from "../loading/loading";
import { ListBrands } from "./list-brands";
import { DeleteModal } from "../modals/delete-modal";


export interface BrandAddListProps {
  option: number;
}

export function BrandAddList(props: BrandAddListProps) {
  const { option } = props;
  const [showModalBrands, setShowModalBrands] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [ brands, setBrands ] = useState<Brand[]>([])
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [brandSelect, setBrandSelect] = useState("");


  const loadBrands = async () => {
    setIsLoading(true);
    try {
      const response = await getData(`brands`);
      setBrands(response.data);
    } catch (error) {
        console.error(error);
    } finally {
        setIsLoading(false);
    }
};

useEffect(() => {
    if (option === 3 && showModalBrands === false) {
        (async () => { await loadBrands() })();
    }
    // eslint-disable-next-line
}, [option, showModalBrands]);

const handleDelete = (iden: string) => {
  setBrandSelect(iden);
  setShowDeleteModal(true);
}

const deleteBrand = async (iden: any) => {
  try {
    const response = await postData(`brands/${brandSelect}`, 'DELETE');
    if (response.type === "successfull") {
      toast.success( "Marca eliminada correctamente", { autoClose: 2000 });
      await loadBrands()
    } else {
      toast.error("Ha Ocurrido un Error!", { autoClose: 2000 });
    }
    setBrandSelect("");
    setShowDeleteModal(false);
  } catch (error) {
    console.error(error);
    toast.error("Ha Ocurrido un Error!", { autoClose: 2000 });
  } 
}

if (option != 3) return null

  return (
        <div className="grid grid-cols-1 md:grid-cols-4 pb-10">
            <div className="col-span-3">
              <Button isFull text="Agregar nueva marca" preset={Preset.accept} onClick={() => setShowModalBrands(true)} />
              { isLoading ? <Loading /> : <ListBrands brands={brands} onDelete={handleDelete} /> }
            </div>

              { !isLoading && <AddBrandsModal isShow={showModalBrands} onClose={() => setShowModalBrands(false)} /> }
              { showDeleteModal && 
              <DeleteModal
              text="¿Está seguro de eliminar esta marca?"
              onDelete={deleteBrand} 
              onClose={()=>setShowDeleteModal(false)} /> }
              <ToastContainer />
        </div>
  );
}
