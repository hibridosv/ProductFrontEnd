"use client";
import { useState } from "react";
import { Modal } from "flowbite-react";
import { Button, Preset } from "../button/button";
import { useForm } from "react-hook-form";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { postData } from "@/services/resources";
import { Product } from "@/services/products";
import { style } from "@/theme";

export interface ProductUpdateModalProps {
  onClose: () => void;
  field?: any;
  type?: string;
  text?: string;
  product?: Product | any;
}

export function ProductUpdateModal(props: ProductUpdateModalProps) {
  const { onClose, text, field, type, product } = props;
  const { register, handleSubmit, reset } = useForm();
  const [isSending, setIsSending] = useState(false);

  

  const onSubmit = async (data: any) => {
    product[field] = data[field];
    const id = toast.loading("Actualizando...");
    try {
      setIsSending(true)
      const response = await postData(`products/${product?.id}`, "PUT", product);
      if (!response.message) {
        toast.update(id, { render: "Producto Actualizado correctamente", type: "success", isLoading: false, autoClose: 2000,
        });
        onClose()
        reset();
      } else {
        toast.update(id, { render: "Faltan algunos datos importantes!", type: "error", isLoading: false, autoClose: 2000,
        });
      }
    } catch (error) {
      console.error(error);
      toast.update(id, { render: "Ha ocurrido un error!", type: "error", isLoading: false, autoClose: 2000,
      });
    } finally {
      setIsSending(false)
    }
  };

  return (
    <Modal size="lg" show={true} position="center" onClose={onClose}>
      <Modal.Header>{text}</Modal.Header>
      <Modal.Body>
        <div className="mx-4">

          <div className="flex justify-center my-4">
            <form onSubmit={handleSubmit(onSubmit)} className="w-full mx-6">
              <div className="flex flex-wrap -mx-3 mb-6">
                <div className="w-full px-3 mb-2">
                  <label htmlFor={field} className={style.inputLabel} >
                    {text}
                  </label>
                  <input
                    type={type}
                    id={field}
                    {...register(field)}
                    className={style.input}
                    step="any"
                  />
                </div>
              </div>
              <div className="flex justify-center">
              { isSending ? <Button disabled={true} preset={Preset.saving} /> : <Button type="submit" preset={Preset.save} /> }
              </div>
            </form>
          </div>
          <ToastContainer />
        </div>
      </Modal.Body>
      <Modal.Footer className="flex justify-end gap-4">
        <Button onClick={onClose} preset={Preset.close} />
      </Modal.Footer>
    </Modal>
  );
}
