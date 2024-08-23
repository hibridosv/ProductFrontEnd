"use client";
import { useEffect, useState } from "react";
import { Modal } from "flowbite-react";
import { useForm } from "react-hook-form";
import { style } from "@/theme";
import { Button, Preset } from "@/components/button/button";
import Image from "next/image";
import { URL } from "@/constants";


export interface ChangeTagsImagesModalProps {
  onClose: () => void;
  onSubmit: (image: any, tags: string) => void
  image: any;
  isShow: boolean;
}

export function ChangeTagsImagesModal(props: ChangeTagsImagesModalProps) {
  const { onClose, image, isShow, onSubmit } = props;
  const { register, handleSubmit, reset } = useForm();

  useEffect(()=> { if(isShow) reset() }, [isShow, reset])

  if (!image && !isShow) {
    return <div></div>
  }

  const sendData = (data: any) => {
    if (!data.tags) {
        return false;
    }
    onSubmit(image, data.tags)
    onClose()
  };

  const imageLoader = ({ src, width, quality }: any) => {
    return `${URL}/images/ico/${src}?w=${width}&q=${quality || 75}`
  }

  return (
    <Modal size="lg" show={isShow} position="center" onClose={onClose}>
      <Modal.Header>Cambiar texto de busqueda</Modal.Header>
      <Modal.Body>
        <div className="mx-4">
            <div className=" text-center">
                { image?.tags && <span className="uppercase text-red-600 font-semibold">{image.tags}</span>}
            </div>
            <div className="flex justify-center my-4 rounded-md drop-shadow-lg">
                <Image loader={imageLoader} src={image?.image} alt="Icono de imagen" width={300} height={300} className="rounded-md" />
            </div>

          <div className="flex justify-center my-4">
            <form onSubmit={handleSubmit(sendData)} className="w-full mx-6">
              <div className="flex flex-wrap -mx-3 mb-6">
                <div className="w-full px-3 mb-2">
                  <label htmlFor='tags' className={style.inputLabel} >Texto a establecer</label>
                  <input
                    type={"text"}
                    id={"tags"}
                    {...register("tags")}
                    className={style.input}
                  />
                </div>
              </div>
              <div className="flex justify-center">
              <Button type="submit" preset={Preset.save} text="Cambiar texto de busqueda" />
              </div>
            </form>
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer className="flex justify-end gap-4">
        <Button onClick={onClose} preset={Preset.close}  />
      </Modal.Footer>
    </Modal>
  );
}
