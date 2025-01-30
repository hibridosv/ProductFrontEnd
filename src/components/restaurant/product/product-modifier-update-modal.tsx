"use client";
import { useEffect, useState } from "react";
import { Modal } from "flowbite-react";
import { Button, Preset } from "@/components/button/button";
import { getData, postData } from "@/services/resources";
import { FaPlus } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { Loading } from "@/components/loading/loading";
import { AiOutlineLoading } from "react-icons/ai";


export interface ProductModifierUpdateModalProps {
  onClose: () => void;
  random: (value: number) => void;
  dataInit: any;
  isShow: boolean;
}

export function ProductModifierUpdateModal(props: ProductModifierUpdateModalProps) {
  const { onClose, dataInit, isShow, random } = props;
  const [isLoading, setIsLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [ options, setOptions ] = useState([])
  const [ optionsAll, setOptionsAll ] = useState([])

  const closeModal = ()=>{
    random && random(Math.random());
    onClose();
  }


  const loadData = async () => {
        setIsLoading(true);
        try {
            const opt = await getData(`restaurant/options`);
            setOptions(opt.data);
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };


    useEffect(() => {
        if (isShow) {
            setOptionsAll(dataInit.assigments);
            (async () => { await loadData() })();
        }
        // eslint-disable-next-line
    }, [dataInit, isShow]);

    const sendData = async(data: any) => {
        setIsSending(true)
        try {
            const response = await postData(`restaurant/options`, 'POST', { product_options_id: data, product_id: dataInit.product});
            if (response.data) {
                setOptionsAll(response.data)
            }
          } catch (error) {
            console.error(error);
          } finally {
            setIsSending(false)
          }
    };

    const sendDataDelete = async(data: any) => {
        setIsSending(true)
        try {
            const response = await postData(`restaurant/options/product/${data}`, 'DELETE', { product_id: dataInit.product });
            if (response.data) {
                setOptionsAll(response.data)
            }
          } catch (error) {
            console.error(error);
          } finally {
            setIsSending(false)
          }
    };
    

      if (!dataInit.text && !isShow) {
        return <div></div>
      }

      const listItems = options?.map((option: any):any => (
        <div key={option.id} >
            <li className="flex justify-between p-3 hover:bg-blue-100 hover:text-blue-800">
                  {option.name}  { isSending ? <AiOutlineLoading size={24} className="animate-spin" /> : <FaPlus size={24} color="green" className="clickeable" onClick={()=>sendData(option.id)} /> }
            </li>
        </div>
    ))

    const listModifier = optionsAll?.map((assigment: any):any => (
        <div key={assigment.id} >
            <li className="flex justify-between p-3 hover:bg-red-50 hover:red-blue-800">
                  {assigment.option.name}  { isSending ? <AiOutlineLoading size={24} className="animate-spin" /> : <MdDelete size={24} color="red" className="clickeable" onClick={()=>sendDataDelete(assigment.id)} /> }
            </li>
        </div>
    ))

  return (
    <Modal size="lg" show={isShow} position="center" onClose={closeModal}>
      <Modal.Header>{dataInit.text}</Modal.Header>
      <Modal.Body>
        { isLoading ? <Loading /> : <>
        <div className="mx-4">
            <li className="flex font-semibold text-lime-700">Modificadores disponibles</li>
            { listItems }
        </div>
        <div className="mx-4">
            <li className="flex font-semibold text-red-800">Modificadores Agregados</li>
            { listModifier }
        </div>
        </>}
      </Modal.Body>
      <Modal.Footer className="flex justify-end gap-4">
        <Button onClick={closeModal} preset={Preset.close} />
      </Modal.Footer>
    </Modal>
  );
}
