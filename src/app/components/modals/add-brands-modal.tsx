"use client";
import { useEffect, useState } from "react";
import { Modal } from "flowbite-react";
import { Button, Preset } from "../button/button";
import toast, { Toaster } from 'react-hot-toast';
import { useForm } from "react-hook-form";
import { getData, postData } from "@/services/resources";
import { style } from "@/theme";
import { Provider } from "@/services/products";
import { Alert } from "../alert/alert";
import { Loading } from "../loading/loading";
import { getRandomInt } from "@/utils/functions";

export interface AddBrandsModalProps {
  onClose: () => void;
  isShow?: boolean;
}

export function AddBrandsModal(props: AddBrandsModalProps) {
  const { onClose, isShow } = props;
  const { register, handleSubmit, resetField, setFocus } = useForm();
  const [isSending, setIsSending] = useState(false);
  const [message, setMessage] = useState<any>({});
  const [providers, setProviders ] = useState<Provider[]>([])
  const [isLoading, setIsLoading] = useState(false);
  const [submited, setSubmited] = useState(getRandomInt(100));

  const loadProviders = async () => {
        setIsLoading(true);
        try {
        const response = await getData(`contacts/providers`);
        setProviders(response.data);
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        (async () => { 
            await loadProviders()
         })();
        // eslint-disable-next-line
    }, []);

  const onSubmit = async (data: any) => {
    try {
      setIsSending(true)
      const response = await postData("brands", "POST", data);
      if (!response.message) {
        toast.success( "Marca Agregada correctamente");
        resetField("name")
      } else {
        toast.error("Faltan algunos datos importantes!");
      }
      setMessage(response);
    } catch (error) {
      console.error(error);
      toast.error("Ha Ocurrido un Error!");
    } finally {
      setIsSending(false)
      setSubmited(getRandomInt(100))
    }
  };

  useEffect(() => {
    setFocus('name', {shouldSelect: true})
  }, [setFocus, isShow, submited])

  return (
    <Modal size="lg" show={isShow} position="center" onClose={onClose}>
      <Modal.Header>Agregar nueva categoria</Modal.Header>
      <Modal.Body>

    { isLoading ? <Loading /> : <>

      <form className="max-w-lg mt-4" onSubmit={handleSubmit(onSubmit)} >
        
        <div className="w-full md:w-full px-3 mb-4">
        <label htmlFor="provider_id" className={style.inputLabel}>
            Proveedores
        </label>
            <select
            id="provider_id"
            {...register("provider_id")}
            className={style.input}
            >
            {providers.map((value: any) => {
                return (
                <option key={value.id} value={value.id}>
                    {value.name}
                </option>
                );
            })}
            </select>
        </div>

        <div className="w-full md:w-full px-3 mb-4">
            <label htmlFor="name" className={style.inputLabel} >Nombre de la Marca </label>
            <input {...register("name", {})} className={`${style.input} w-full`} />
        </div>

            <div className="flex justify-center">
            { isSending ? <Button disabled={true} preset={Preset.saving} /> : <Button type="submit" preset={Preset.save} /> }
            </div>
      </form>
        {message.errors && (
            <div className="mt-4">
                <Alert
                type="red"
                info="Error"
                text={JSON.stringify(message.message)}
                isDismisible={false}
                />
            </div>
            )}
    </>
    }
      <Toaster />
      </Modal.Body>
      <Modal.Footer className="flex justify-end gap-4">
        <Button onClick={onClose} preset={Preset.close} />
      </Modal.Footer>
    </Modal>
  );

}
