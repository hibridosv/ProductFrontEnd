"use client";
import { useEffect, useState } from "react";
import { Modal } from "flowbite-react";
import { Button, Preset } from "@/components/button/button";
import { postData } from "@/services/resources";
import { MdDelete } from "react-icons/md";
import { Loading } from "@/components/loading/loading";
import { AiOutlineLoading } from "react-icons/ai";
import Image from "next/image";
import { URL } from "@/constants";


export interface OptionsUpdateModalProps {
  onClose: () => void;
  random: (value: number) => void;
  option: any;
  isShow: boolean;
}

export function OptionsUpdateModal(props: OptionsUpdateModalProps) {
  const { onClose, option, isShow, random } = props;
  const [isSending, setIsSending] = useState(false);
  const [ optionsAll, setOptionsAll ] = useState([])

  const closeModal = ()=>{
    random && random(Math.random());
    onClose();
  }

  useEffect(() => {
    setOptionsAll(option?.variants)
  }, [option]);


    const sendDataDelete = async(id: any) => {
        setIsSending(true)
        try {
            const response = await postData(`restaurant/options/variants/${id}`, 'DELETE');
            if (response.type === 'successful') {
              setOptionsAll(optionsAll.filter((item: any) => item.id !== id))
            }
          } catch (error) {
            console.error(error);
          } finally {
            setIsSending(false)
          }
    };
    

      if (!option && !isShow) {
        return <div></div>
      }

  const imageLoader = ({ src, width, quality }: any) => {
    return `${URL}/images/ico/${src}?w=${width}&q=${quality || 75}`
  }

    const listModifier = option && optionsAll?.map((variant: any):any => (
        <div key={variant.id} >
            <li className="flex justify-between p-3 hover:bg-red-50 hover:red-blue-800">
            <Image loader={imageLoader} src={variant?.image} alt="Icono de imagen" width={45} height={45} />{variant.name}  { isSending ? <AiOutlineLoading size={24} className="animate-spin" /> : <MdDelete size={24} color={optionsAll.length > 2 ? "red" : "gray"} className="clickeable" 
            onClick={optionsAll.length > 2 ? ()=>sendDataDelete(variant.id) : ()=>{}} /> }
            </li>
        </div>
    ))

  return (
    <Modal size="sm" show={isShow} position="center" onClose={closeModal}>
      <Modal.Header>{option?.name}</Modal.Header>
      <Modal.Body>
        <div className="mx-4">
            <li className="flex font-semibold text-red-800"> Modificadores Agregados</li>
            { listModifier }
        </div>
      </Modal.Body>
      <Modal.Footer className="flex justify-end gap-4">
        <Button onClick={closeModal} preset={Preset.close} />
      </Modal.Footer>
    </Modal>
  );
}
