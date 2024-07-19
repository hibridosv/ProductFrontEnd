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
import { Loading } from "@/components/loading/loading";

export interface AddOptionsModalProps {
  onClose: () => void;
  isShow?: boolean;
}

interface Variant {
  name: string;
  img: string;
  quantity: number;
}

export function AddOptionsModal(props: AddOptionsModalProps) {
  const { onClose, isShow } = props;
  const { register, handleSubmit, resetField, reset, setValue, setFocus } = useForm();
  const [isSending, setIsSending] = useState(false);

  const [ selectedImage, setSelectedImage ] = useState("default.png")
  const [isShowImagesModal, setIsShowImagesModal] = useState(false);
  const [modifier, setModifier] = useState("");
  const [variants, setVariants] = useState<Variant[]>([]); 


      
      const onSubmit = (data: any) => {
        if (!data.name){
            toast.error("Ingrese el nombre de la categoria");
            return
        }
        data.img = selectedImage;
        if (modifier == "") {
            setModifier(data.name);
        }else {
          setVariants((prevVariants) => [
            ...prevVariants,
            { name: data.name, img: data.img, quantity: data.quantity || 0 },
          ]);
        }
        reset();
        setValue('quantity', 0);
        setFocus('name');
    };

    const removeVariant = (name: string) => {
      setVariants((prevVariants) =>
        prevVariants.filter(variant => variant.name !== name)
      );
    };

    
    const removeOption = () => {
      setModifier("");
      setVariants([]);
    };


    const sendOptions = async () => {
      let data = {
        option: modifier,
        variants
      }
      try {
        setIsSending(true)
          const response = await postData("restaurant/products/options", "POST", data);
          if (response.type == "successful") {
            toast.success( "Modificadores Agregados correctamente");
            resetField("name")
            removeOption();
        } else {
          toast.error("Faltan algunos datos importantes!");
        }
        console.log(response)
      } catch (error) {
        console.error(error);
        toast.error("Ha Ocurrido un Error!");
      } finally {
        setIsSending(false)
      }
  };


    console.log("variants: ", variants)
  
    const imageLoader = ({ src, width, quality }: any) => {
        return `${URL}/images/ico/${src}?w=${width}&q=${quality || 75}`
    }

  if (!isShow) return null;
  return (
    <Modal size="lg" show={isShow} position="center" onClose={onClose}>
      <Modal.Header>Agregar modificadores</Modal.Header>
      <Modal.Body>


            { modifier != "" && <div> 
                <div className="flex justify-between px-2 mb-2 uppercase text-lg font-semibold shadow-md rounded-md">
                    <span>{ modifier }</span> 
                    <span className="text-right"><Button noText preset={Preset.smallClose} onClick={removeOption} /></span>
                </div> 
                  {variants?.map((value: any) => {
                    return ( 
                      <div className="flex justify-between ml-4 px-2 mb-2 text-lg shadow-md rounded-md">
                            <span>{ value?.name }</span> 
                            <span className="text-right"><Button noText preset={Preset.smallClose} onClick={()=> removeVariant(value.name)} /></span>
                        </div> 
                     );
                    })}

              </div>}

        { !isSending ?
          <form className="max-w-lg mt-4" onSubmit={handleSubmit(onSubmit)} >

            <div className="w-full px-3 mb-4">
              <label htmlFor="name" className={style.inputLabel} >Nombre del modificador</label>
              <input {...register("name", {})} className={`${style.input} w-full`} />
            </div>
            { modifier != "" && <>
            <div className="w-full px-3 mb-4">
              <label htmlFor="quantity" className={style.inputLabel} >Precio del modificador</label>
              <input {...register("quantity", {})} className={`${style.input} w-full`} type="number" step="any" />
            </div>
            
            <div className="my-4 flex justify-center">
             <div className={style.inputLabel}>Seleccionar Imagen</div>
            </div>
            <div className="w-full mb-4 px-3 flex justify-center">
                <div className="clickeable" onClick={()=>setIsShowImagesModal(true)}>
                    <Image loader={imageLoader} src={selectedImage} alt="Icono de imagen" width={96} height={96} className="drop-shadow-lg rounded-md" />
                </div>
            </div>
            </> }
            <div className="flex justify-center">
            <Button type="submit" disabled={isSending} preset={Preset.add} text="Agregar" />
            </div>
            { modifier != "" && variants.length > 1 && <div>
              <div className="border shadow-md mt-3"></div>
              <div className="flex justify-center my-4">
                  <Button disabled={isSending} preset={isSending ? Preset.saving : Preset.save} text="Guardar todo" onClick={sendOptions}/>
              </div>
            </div>
            }
        </form> :
        <Loading text="Enviando..." />
        }

      <Toaster position="top-right" reverseOrder={false} />
      <AddImageModal isShow={isShowImagesModal} onClose={()=> setIsShowImagesModal(false)} selectedImage={setSelectedImage} />

      </Modal.Body>
      <Modal.Footer className="flex justify-end gap-4">
        <Button onClick={onClose} preset={Preset.close} />
      </Modal.Footer>
    </Modal>
  );

}
