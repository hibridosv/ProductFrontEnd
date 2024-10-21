'use client'
import {  useEffect, useState } from "react";
import { Checkbox, Modal } from "flowbite-react";
import { Button, Preset } from "../button/button";
import { postData } from "@/services/resources";
import toast, { Toaster } from "react-hot-toast";
import { useForm } from "react-hook-form";
import { style } from "@/theme";
import { Option, RadioButton } from "../radio-button/radio-button";

export interface SalesOthersProps {
    onClose: () => void;
    isShow?: boolean;
    order: any; // arreglo de la orden
}

export function SalesOthers(props: SalesOthersProps){
const { onClose, isShow, order } = props;
const [isSending, setIsSending] = useState(false);
const { register, handleSubmit, reset, setValue } = useForm();
let optionsRadioButton: Option[] = [
  { id: 1, name: "Gravado" },
  { id: 2, name: "Exento" },
  { id: 3, name: "Excluido" },
];
const [selectedOption, setSelectedOption] = useState<Option>({ id: 1, name: "Gravado" });


const onSubmit = async (data: any) => {
    
    if (!data.quantity || !data.description|| !data.total){
        toast.error("Faltan datos importantes");
        return
    }
    let values = {
        description: data.description,
        quantity: data.quantity,
        total: data.total,
        order_id: order.id,
        exempt: selectedOption.id,
    };
    try {
      setIsSending(true);
      const response = await postData(`sales/other/sales`, "POST", values);
      if (response.type === "error") {
        toast.error(response.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("Ha Ocurrido un Error!");
    } finally {
        setIsSending(false);
        reset()
        onClose()
    }
  };

  useEffect(() => {
    if (isShow) {
      setValue('quantity', 1);
    }
  }, [isShow, setValue]);


return (
<Modal show={isShow} position="center" onClose={onClose} size="md">
  <Modal.Header>Otras ventas</Modal.Header>
  <Modal.Body>
    <div className="mx-4">
        <form className="max-w-lg mt-4" onSubmit={handleSubmit(onSubmit)} >
            <div className="w-full md:w-full px-3 mb-4">
                <label htmlFor="quantity" className={style.inputLabel} >Cantidad</label>
                <input type="number" step="any" {...register("quantity", { required: true })} className={`${style.input} w-full`} />
            </div>
            <div className="w-full md:w-full px-3 mb-4">
                <label htmlFor="description" className={style.inputLabel} >Descripción</label>
                <input type="text" {...register("description", { required: true })} className={`${style.input} w-full`} />
            </div>
            <div className="w-full md:w-full px-3 mb-4">
                <label htmlFor="total" className={style.inputLabel} >Precio</label>
                <input type="number" step="any" {...register("total", { required: true })} className={`${style.input} w-full`} />
            </div>
            <div className="w-full md:w-full px-3 mb-4 flex justify-center">
              {/* <Checkbox {...register("exempt")} className="mr-2" /> */}
              {/* <label htmlFor="exempt" className={style.inputLabel} >Exento de Impuestos</label> */}
              <RadioButton options={optionsRadioButton} onSelectionChange={setSelectedOption} />
            </div>
            <div className="flex justify-center">
            <Button type="submit" disabled={isSending} preset={isSending ? Preset.saving : Preset.save} />
            </div>
        </form>
      <Toaster position="top-right" reverseOrder={false} />
    </div>
  </Modal.Body>
  <Modal.Footer className="flex justify-end">
    <Button onClick={onClose} preset={Preset.close} isFull disabled={isSending} /> 
  </Modal.Footer>
</Modal>)
}