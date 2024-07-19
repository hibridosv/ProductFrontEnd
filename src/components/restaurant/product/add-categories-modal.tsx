"use client";
import { useState } from "react";
import { Modal } from "flowbite-react";
import toast, { Toaster } from 'react-hot-toast';

import { useForm } from "react-hook-form";
import { postData } from "@/services/resources";
import { style } from "@/theme";
import { PresetTheme } from "@/services/enums";
import { Button, Preset } from "@/components/button/button";
import { Alert } from "@/components/alert/alert";
import { AddImageModal } from "./add-image-modal";
import Image from "next/image";
import { URL } from "@/constants";

export interface AddCategoriesModalProps {
  onClose: () => void;
  isShow?: boolean;
}

export function AddCategoriesModal(props: AddCategoriesModalProps) {
  const { onClose, isShow } = props;
  const { register, handleSubmit, resetField, setFocus } = useForm();
  const [isSending, setIsSending] = useState(false);

  const [message, setMessage] = useState<any>({});
  const [ selectedImage, setSelectedImage ] = useState("default.png")
  const [isShowImagesModal, setIsShowImagesModal] = useState(false);


      
      const onSubmit = async (data: any) => {
        if (!data.name){
            toast.error("Ingrese el nombre de la categoria");
            return
        }
        data.img = selectedImage;
        try {
          setIsSending(true)
          const response = await postData("restaurant/products/category", "POST", data);
          if (response.type == "successful") {
            toast.success( "Categoría Agregada correctamente");
            resetField("name")
            onClose();
        } else {
          toast.error("Faltan algunos datos importantes!");
        }
      } catch (error) {
        console.error(error);
        toast.error("Ha Ocurrido un Error!");
      } finally {
        setIsSending(false)
      }
    };
  
    const imageLoader = ({ src, width, quality }: any) => {
        return `${URL}/images/ico/${src}?w=${width}&q=${quality || 75}`
    }

  if (!isShow) return null;
  return (
    <Modal size="lg" show={isShow} position="center" onClose={onClose}>
      <Modal.Header>Agregar nueva categoria</Modal.Header>
      <Modal.Body>

      <form className="max-w-lg mt-4" onSubmit={handleSubmit(onSubmit)} >

            <div className="w-full px-3 mb-4">
              <label htmlFor="name" className={style.inputLabel} >Nombre de la categoría</label>
              <input {...register("name", {})} className={`${style.input} w-full`} />
            </div>
            
            <div className="my-4 flex justify-center">
             <div className={style.inputLabel}>Seleccionar Imagen</div>
            </div>
            <div className="w-full mb-4 px-3 flex justify-center">
                <div className="clickeable" onClick={()=>setIsShowImagesModal(true)}>
                    <Image loader={imageLoader} src={selectedImage} alt="Icono de imagen" width={96} height={96} className="drop-shadow-lg rounded-md" />
                </div>
            </div>
            <div className="flex justify-center">
            <Button type="submit" disabled={isSending} preset={isSending ? Preset.saving : Preset.save} />
            </div>
      </form>

      <Toaster position="top-right" reverseOrder={false} />
      <AddImageModal isShow={isShowImagesModal} onClose={()=> setIsShowImagesModal(false)} selectedImage={setSelectedImage} />

      </Modal.Body>
      <Modal.Footer className="flex justify-end gap-4">
        <Button onClick={onClose} preset={Preset.close} />
      </Modal.Footer>
    </Modal>
  );

}
