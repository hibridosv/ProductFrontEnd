"use client";
import { useState, useContext, useEffect } from "react";
import { Button, Preset } from "../button/button";
import { useForm } from "react-hook-form";
import { postData, getData, postDataWithImage } from "@/services/resources";
import { Product, Image as Imagen } from "@/services/products";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { style } from "../../../theme";
import Image from "next/image";
import { URL } from "@/constants";
import { DeleteModal } from "../modals/delete-modal";
import { Loading } from "../loading/loading";
import { Alert } from "../alert/alert";


export interface ProductUploadImageProps {
  product?: Product | any;
}

export function ProductUploadImage(props: ProductUploadImageProps) {
  const { product } = props;
  const { register, handleSubmit, reset } = useForm();
  const [isSending, setIsSending] = useState(false);
  const [images, setImages] = useState([]);
  const [imageSelect, setImageSelect] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const loadImages = async () => {
    setIsLoading(true);
    try {
      const response = await getData(`image/${product.id}`);
      setImages(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
};

useEffect(() => {
        (async () => { await loadImages() })();
  // eslint-disable-next-line
}, []);

const imageLoader = ({ src, width, quality }: any) => {
  return `${URL}storage/public/images/${src}?w=${width}&q=${quality || 75}`
}
 
  const listItems = images?.map((image: Imagen) => (
    <div key={image.id} className="m-2">
    <Image loader={imageLoader} src={image.image} alt={image.description} width={100} height={100} style={{ maxWidth: "100px", display: "block", maxHeight:"100px", objectFit: "cover"}} />
      <div className='bg-red-600 text-white flex justify-center cursor-pointer' onClick={()=>isDeleteImage(image)} ><span className="mx-2">Eliminar</span></div>
    </div>
  ));


  const onSubmit = async (data: any) => {
    data.product_id = product.id
    const id = toast.loading("Agregando...");
    try {
      setIsSending(true)
      const response = await postDataWithImage("image", "POST", data);
      if (!response.message) {
        toast.update(id, { render: "Imagen Agregada correctamente", type: "success", isLoading: false, autoClose: 2000,});
        setImages(response.data)
        reset();
      } else {
        toast.update(id, { render: "Ingrese ambos datos!", type: "error", isLoading: false, autoClose: 2000,});
      }
    } catch (error) {
      console.error(error);
      toast.update(id, { render: "Ha ocurrido un error!", type: "error", isLoading: false, autoClose: 2000,});
    } finally {
      setIsSending(false)
    }
  };


  const isDeleteImage = (image:any) => {
    setImageSelect(image.id);
    setShowDeleteModal(true);
  }


  const deleteImage = async (iden: any) => {
    const id = toast.loading("Eliminando...")
    try {
      const response = await postData(`image/${imageSelect}`, 'DELETE');
      toast.update(id, { render: response.message, type: "success", isLoading: false, autoClose: 2000 });
      await loadImages()
      setShowDeleteModal(false);
      setImageSelect("");
    } catch (error) {
      console.error(error);
      toast.update(id, { render: "Ha ocurrido un error!", type: "error", isLoading: false, autoClose: 2000 });
    } 
  }


  return (<div>
    <div className="flex justify-center mt-8">
      { images?.length >= 3 ? <Alert text="El maximo de imagnes permitodo es tres por producto" isDismisible /> :
      (<form className="max-w-lg" onSubmit={handleSubmit(onSubmit)} >
        <div className="mb-4">
          <label htmlFor="image" className="block text-lg font-medium text-gray-700">
            Imagen
          </label>
          <input
            type="file"
            accept="image/*"
            id="image"
            {...register("image")}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>
        <div className="w-full md:w-full px-3 mb-4">
              <label htmlFor="description" className={style.inputLabel} >Información </label>
              <textarea {...register("description", {})} rows={2} className={`${style.input} w-full`} />
              </div>

              <div className="flex justify-center">
                { isSending ? <Button disabled={true} preset={Preset.saving} /> : <Button type="submit" preset={Preset.save} /> }
              </div>
      </form>)}
      <ToastContainer />
    </div>
        <div className="flex justify-center mt-8 border-blue-600">
          { isLoading? <Loading /> : listItems }
        </div>

        { showDeleteModal && 
          <DeleteModal
          text="¿Estas seguro de eliminar esta imagen?"
          onDelete={deleteImage} 
          onClose={()=>setShowDeleteModal(false)} /> }
  </div>);
}
