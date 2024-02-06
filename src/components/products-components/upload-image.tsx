"use client";
import { useState, useEffect } from "react";
import { Button, Preset } from "../button/button";
import { useForm } from "react-hook-form";
import { postData, getData, postDataWithImage } from "@/services/resources";
import { Product, Image as Imagen } from "@/services/products";
import toast, { Toaster } from 'react-hot-toast';
import { style } from "../../theme";
import Image from "next/image";
import { DeleteModal } from "../modals/delete-modal";
import { Loading } from "../loading/loading";
import { Alert } from "../alert/alert";
import { getTenant, getUrlFromCookie } from "@/services/oauth";


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
  const remoteUrl = getUrlFromCookie();
  const tenant = getTenant();

  const loadImages = async () => {
    setIsLoading(true);
    try {
      const response = await getData(`images/${product.id}`);
      setImages(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
};

  useEffect(() => {
    if (product) {
      (async () => { await loadImages() })();
    }
    // eslint-disable-next-line
  }, [product]);

const imageLoader = ({ src, width, quality }: any) => {
  return `${remoteUrl}/storage/public/${tenant}/products/${src}?w=${width}&q=${quality || 75}`
}
 
  const listItems = images?.map((image: Imagen) => (
    <div key={image.id} className="m-2">
    <Image loader={imageLoader} src={image.image} alt={image.description} width={100} height={100} style={{ maxWidth: "100px", display: "block", maxHeight:"100px", objectFit: "cover"}} />
      <div className='bg-red-600 text-white flex justify-center cursor-pointer' onClick={()=>isDeleteImage(image)} ><span className="mx-2">Eliminar</span></div>
    </div>
  ));


  const onSubmit = async (data: any) => {
    data.product_id = product.id
    try {
      setIsSending(true)
      const response = await postDataWithImage("images", "POST", data);
      if (!response.message) {
        toast.success( "Imagen Agregada correctamente");
        setImages(response.data)
        reset();
      } else {
        toast.error("Ingrese ambos datos!");
      }
    } catch (error) {
      console.error(error);
      toast.error("Ha ocurrido un error!");
    } finally {
      setIsSending(false)
    }
  };


  const isDeleteImage = (image:any) => {
    setImageSelect(image.id);
    setShowDeleteModal(true);
  }


  const deleteImage = async (iden: any) => {
    try {
      const response = await postData(`images/${imageSelect}`, 'DELETE');
      await loadImages()
      setShowDeleteModal(false);
      setImageSelect("");
      toast.success( response.message);
    } catch (error) {
      console.error(error);
      toast.error("Ha ocurrido un error!");
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
              <Button type="submit" disabled={isSending} preset={isSending ? Preset.saving : Preset.save} />
              </div>
      </form>)}
    </div>
        <div className="flex justify-center mt-8 border-blue-600">
          { isLoading ? <Loading /> : listItems }
        </div>

          <DeleteModal isShow={showDeleteModal}
          text="¿Estas seguro de eliminar esta imagen?"
          onDelete={deleteImage} 
          onClose={()=>setShowDeleteModal(false)} /> 
      <Toaster position="top-right" reverseOrder={false} />
  </div>);
}
