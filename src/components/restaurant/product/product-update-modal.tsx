"use client";
import { useEffect, useState } from "react";
import { Modal } from "flowbite-react";
import { useForm } from "react-hook-form";
import { style } from "@/theme";
import { Button, Preset } from "@/components/button/button";


export interface ProductUpdateModalProps {
  onClose: () => void;
  onSubmit: (data: any) => void
  dataInit: any;
  isShow: boolean;
}

export function ProductUpdateModal(props: ProductUpdateModalProps) {
  const { onClose, dataInit, isShow, onSubmit } = props;
  const { register, handleSubmit, reset } = useForm();
  const [isSending, setIsSending] = useState(false);

  useEffect(()=> { if(isShow) reset() }, [isShow, reset])

  if (!dataInit.text && !dataInit.field && !dataInit.type && !isShow) {
    return <div></div>
  }

  const sendData = (data: any) => {
    if (dataInit.field == 'sale_price' && data[dataInit.field] < 0) {
      return;
    }

    if (data[dataInit.field] == null || data[dataInit.field] == "") {
      return;
    }
    setIsSending(true)
    onSubmit({ field: dataInit.field, data: data[dataInit.field] })
    onClose()
    setIsSending(false)
  };

  return (
    <Modal size="lg" show={isShow} position="center" onClose={onClose}>
      <Modal.Header>{dataInit.text}</Modal.Header>
      <Modal.Body>
        <div className="mx-4">

          <div className="flex justify-center my-4">
            <form onSubmit={handleSubmit(sendData)} className="w-full mx-6">
              <div className="flex flex-wrap -mx-3 mb-6">
                <div className="w-full px-3 mb-2">
                  <label htmlFor={dataInit.field} className={style.inputLabel} >
                    {dataInit.text}
                  </label>
                  <input
                    type={dataInit.type}
                    id={dataInit.field}
                    {...register(dataInit.field)}
                    className={style.input}
                    step="any"
                  />
                </div>
              </div>
              <div className="flex justify-center">
              <Button type="submit" disabled={isSending} preset={isSending ? Preset.saving : Preset.save} />
              </div>
            </form>
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer className="flex justify-end gap-4">
        <Button onClick={onClose} preset={Preset.close} />
      </Modal.Footer>
    </Modal>
  );
}
