"use client";
import { useContext, useEffect, useState } from "react";
import { Modal } from "flowbite-react";
import { Button, Preset } from "../button/button";
import { useForm } from "react-hook-form";
import toast, { Toaster } from 'react-hot-toast';
import { postData } from "@/services/resources";
import { style } from "../../theme";
import { Alert } from "../alert/alert";
import { PresetTheme } from "@/services/enums";
import { formatDateAsDMY, formatHourAsHM } from "@/utils/date-formats";
import { numberToMoney } from "@/utils/functions";
import { DeleteModal } from "../modals/delete-modal";
import { ConfigContext } from "@/contexts/config-context";



export interface CreditAddNoteModalProps {
  onClose: () => void;
  isShow: boolean;
  creditSelected?: any; 
  close: () => void
}

export function CreditAddNoteModal(props: CreditAddNoteModalProps) {
  const { onClose, isShow, creditSelected, close } = props;
  const { register, handleSubmit, reset, watch, setValue } = useForm();
  const [isSending, setIsSending] = useState(false);
  const [message, setMessage] = useState<any>({});
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const { systemInformation } = useContext(ConfigContext);

    const onSubmit = async(data: any) => {
      data.credits_payable_id = creditSelected.id;
      try {
        setIsSending(true)
        const response = await postData(`credits/notes`, "POST", data);
        if (response.type == "successful") {
          toast.success(`Nota creada correctamente`);
          setMessage({});
          onClose()
          close()
        } else {
            setMessage(response);
            toast.error("Faltan algunos datos importantes!");
        }
      } catch (error) {
        console.error(error);
        toast.error("Ha ocurrido un error!");
      } finally {
        setIsSending(false)
      }
    }


    const deleteNote = async (iden: string) => {
      setShowDeleteModal(false)
      try {
        setIsSending(true)
        const response = await postData(`credits/notes/${iden}`, "DELETE");
        if (response.type == "successful") {
          toast.success(`Nota eliminada correctamente`);
          onClose()
          close()
        }
      } catch (error) {
        console.error(error);
        toast.error("Ha ocurrido un error!");
      } finally {
        setIsSending(false)
      }
    };


  return (
    <Modal size="sm" show={isShow} position="center" onClose={onClose}>
      <Modal.Header>{creditSelected?.note ? "NOTA DE CREDITO AGREGADA" : "AGREGAR NOTA DE CREDITO"}</Modal.Header>
      <Modal.Body>
        <div className="mx-4">
                  {
                    creditSelected?.note ? 
                    <div className="flex flex-wrap mx-3 mb-2 ">
                        <div className="w-full md:w-full px-3 mb-2">
                            <div className={style.inputLabel}> Numero de Nota de credito *</div>
                            <div className={style.input}>{creditSelected?.note?.number}</div>
                        </div>
                        <div className="w-full md:w-full px-3 mb-2">
                            <div className={style.inputLabel}> Factura afectada *</div>
                            <div className={style.input}>{creditSelected?.note?.invoice}</div>
                        </div>
                        <div className="w-full md:w-full px-3 mb-2">
                            <div  className={style.inputLabel}> Fecha emisión *</div>
                            <div className={style.input}>{formatDateAsDMY(creditSelected?.note?.emited_at)}</div>
                        </div>
                        <div className="w-full md:w-full px-3 mb-2">
                            <div  className={style.inputLabel}> Fecha Ingreso *</div>
                            <div className={style.input}>{formatDateAsDMY(creditSelected?.note?.created_at)}</div>
                        </div>
                        <div className="w-full md:w-full px-3 mb-2">
                            <div  className={style.inputLabel}> Cantidad *</div>
                            <div className={style.input}>{numberToMoney(creditSelected?.note?.quantity, systemInformation)}</div>
                        </div>
                    
                    </div>
                    :
                  
                    <form onSubmit={handleSubmit(onSubmit)} className="pb-4 border-2 shadow-lg rounded-md">
                        <div className="flex flex-wrap mx-3 mb-2 ">

                            <div className="w-full md:w-full px-3 mb-2">
                                <label htmlFor="number" className={style.inputLabel}> Numero de Nota de credito *</label>
                                <input type="number" id="number" {...register("number")} className={style.input} step="any" min={0} />
                            </div>

                            <div className="w-full md:w-full px-3 mb-2">
                                <label htmlFor="invoice" className={style.inputLabel}> Factura afectada *</label>
                                <input type="number" id="invoice" {...register("invoice")} className={style.input} step="any" min={0} />
                            </div>

                            <div className="w-full md:w-full px-3 mb-2">
                                <label htmlFor="emited_at" className={style.inputLabel}> Fecha emisión *</label>
                                <input type="date" id="emited_at" {...register("emited_at")} className={style.input} step="any" min={0} />
                            </div>

                            <div className="w-full md:w-full px-3 mb-2">
                                <label htmlFor="quantity" className={style.inputLabel}> Cantidad *</label>
                                <input type="number" id="quantity" {...register("quantity")} className={style.input} step="any" min={0} />
                            </div>
                        
                        </div>
                        {message.errors && (
                            <div className="mb-3">
                            <Alert theme={PresetTheme.danger} info="Error" text={JSON.stringify(message.message)} isDismisible={false} />
                            </div>
                        )}

                        <div className="flex justify-center">
                        <Button type="submit" disabled={isSending} preset={isSending ? Preset.saving : Preset.save} />
                        </div>
                    </form>
                }
        </div>

      <Toaster position="top-right" reverseOrder={false} />
      </Modal.Body>
      <Modal.Footer className="flex justify-end gap-4">
      <DeleteModal isShow={showDeleteModal}
          text="¿Estas seguro de eliminar este elemento?"
          onDelete={()=>deleteNote(creditSelected?.note?.id)} 
          onClose={()=>setShowDeleteModal(false)} />

        { creditSelected?.note &&
        <Button onClick={()=>setShowDeleteModal(true)} preset={Preset.cancel} disabled={isSending} text="Eliminar Nota" />
        }
        <Button onClick={onClose} preset={Preset.close} disabled={isSending} />
      </Modal.Footer>
    </Modal>
  );
}
