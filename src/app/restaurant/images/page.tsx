'use client'

import { useState, useEffect, useContext } from "react";
import { getData, postData } from "@/services/resources";
import { NothingHere, Pagination } from "@/components";
import { usePagination } from "@/hooks/usePagination";
import { useSearchTerm } from "@/hooks/useSearchTerm";
import { useForm } from "react-hook-form";
import Image from "next/image";
import { MdClear } from "react-icons/md";
import { HiSearch } from "react-icons/hi";
import { TextInput } from "flowbite-react";
import { URL } from "@/constants";
import { ChangeTagsImagesModal } from "@/components/restaurant/images/change-tag-image-modal";
import { useIsOpen } from "@/hooks/useIsOpen";
import toast, { Toaster } from 'react-hot-toast';


export default function Page() {
  const [ images, setImages ] = useState([] as any)
  const [isLoading, setIsLoading] = useState(false);
  const [imageSelected, setImageSelected] = useState(false);
  const {currentPage, handlePageNumber} = usePagination("&page=1");
  const { searchTerm, handleSearchTerm } = useSearchTerm(["tags"]);
  const { register, handleSubmit, reset } = useForm();
  const imageQuantity = 50;
  const modalImg = useIsOpen(false);


  const onSubmit = async (data: any) => {
    handlePageNumber("&page=1")
    handleSearchTerm(data.search);
    reset();
}


const resetSearch = async () => {
    handlePageNumber("&page=1")
    handleSearchTerm("");
    reset();
}


const selectedImage = async (image: any) => {
  setImageSelected(image)
  modalImg.setIsOpen(true)
  reset();
}


const sendTags = async (image: any, tags: string) => {
  setIsLoading(true);
  try {
    const response = await postData(`restaurant/images/${image.id}`, "PUT", { tags: tags });
      if (response.type == "successful") {
          await loadImages();
          toast.success("Actualizado correctamente");
      } else {
        toast.error("Error al actualizar")
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
}



  const loadImages = async () => {
    setIsLoading(true);
    try {
      const response = await getData(`restaurant/images?perPage=${imageQuantity}${currentPage}${searchTerm}`);
      setImages(response);
        } catch (error) {
          console.error(error);
        } finally {
          setIsLoading(false);
        }
  };
      


      useEffect(() => {
            (async () => { await loadImages() })();
        // eslint-disable-next-line
      }, [currentPage, searchTerm]);


      const imageLoader = ({ src, width, quality }: any) => {
        return `${URL}/images/ico/${src}?w=${width}&q=${quality || 75}`
      }
   

      const listMocks = () => {
        const items = [];
        for (let index = 0; index < imageQuantity; index++) {
          items.push(
            <div key={index} className="w-24 h-24 m-2">
              <div className="border border-blue-300 shadow rounded-md p-4 max-w-sm w-full mx-auto">
                <div className="animate-pulse flex space-x-4">
                  <div className="rounded-full bg-slate-700 h-10 w-10"></div>
                  <div className="flex-1 space-y-6 py-1">
                    <div className="h-2 bg-slate-700 rounded"></div>
                    <div className="space-y-3">
                      <div className="h-2 bg-slate-700 rounded"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        }
        return <>{items}</>;
    };
      

      
      const listItems = images?.data && images.data.map((image: any) => (
              <div key={image?.id} className="m-2 clickeable">
                  <div title={image?.tags} onClick={()=>{ selectedImage(image); }} className="rounded-md drop-shadow-lg">
                      <Image loader={imageLoader} src={image?.image} alt="Icono de imagen" width={96} height={96} className="rounded-md" />
                  </div>
              </div>
      ));


  if (!images || images.length == 0) return <NothingHere text="No hay imagenes" />

  return (
        <div className="p-4">
        <form onSubmit={handleSubmit(onSubmit)} className="w-full">
            <div className="x-3">
                <TextInput placeholder="Buscar Imagen" addon={searchTerm != "" ? <MdClear className="clickeable" onClick={resetSearch} /> : <HiSearch />} {...register("search")} />
            </div>
        </form>

        <div className="flex flex-wrap justify-center">
          {isLoading ? listMocks() : listItems }
          {((!images?.data || images.data.length === 0) && !isLoading) && <div className="clickeable" onClick={resetSearch}><NothingHere text="No se encontraron imágenes" /></div> }
        </div>

        <div className="border border-slate-900 shadow-md shadow-teal-900"></div>
        <Pagination records={images} handlePageNumber={handlePageNumber }  />
        <ChangeTagsImagesModal isShow={modalImg.isOpen} onClose={()=>modalImg.setIsOpen(false)} image={imageSelected} onSubmit={sendTags} />
      <Toaster position="top-right" reverseOrder={false} />

        </div>
  )
}
