"use client";
import { useEffect, useRef, useState } from "react";
import { Label, Modal, TextInput } from "flowbite-react";
import { getData } from "@/services/resources";
import { Button, Preset } from "@/components/button/button";
import Image from "next/image";
import { usePagination } from "@/hooks/usePagination";
import { URL } from "@/constants";
import { Pagination } from "@/components/pagination";
import { HiSearch } from "react-icons/hi";
import { useForm } from "react-hook-form";
import { NothingHere } from "@/components/nothing-here/nothing-here";
import { useSearchTerm } from "@/hooks/useSearchTermNoDelay";
import { MdClear } from "react-icons/md";

export interface AddImageModalProps {
  onClose: () => void;
  isShow?: boolean;
  selectedImage: (image: string)=> void
}

export function AddImageModal(props: AddImageModalProps) {
  const { onClose, isShow, selectedImage } = props;
  const [ images, setImages ] = useState([] as any)
  const [isLoading, setIsLoading] = useState(false);
  const {currentPage, handlePageNumber} = usePagination("&page=1");
  const { searchTerm, handleSearchTerm } = useSearchTerm(["tags"]);
  const { register, handleSubmit, reset } = useForm();
  const imageQuantity = 35;

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
        if (isShow) {
            (async () => { await loadImages() })();
        }
        // eslint-disable-next-line
      }, [isShow, currentPage, searchTerm]);
      

      const imageLoader = ({ src, width, quality }: any) => {
          return `${URL}/images/ico/${src}?w=${width}&q=${quality || 75}`
        }
        
        
        const listItems = images?.data && images.data.map((image: any) => (
                <div key={image?.id} className="m-2 clickeable">
                    <div onClick={()=> {selectedImage(image?.image); onClose() }} className="rounded-md drop-shadow-lg">
                        <Image loader={imageLoader} src={image?.image} alt="Icono de imagen" width={96} height={96} className="rounded-md" />
                    </div>
                </div>
        ));

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
          
      
      return (
          <Modal size="4xl" show={isShow} position="center" onClose={onClose}>
      <Modal.Header> Seleccione una imagen</Modal.Header>
      <Modal.Body>
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
      </Modal.Body>
      <Modal.Footer className="flex justify-end gap-4">
        <Button onClick={onClose} preset={Preset.close} />
      </Modal.Footer>
    </Modal>
  );

}
