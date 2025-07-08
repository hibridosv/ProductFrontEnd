import { Button, Preset } from "@/components/button/button";
import { SearchInput } from "@/components/form/search";
import { Loading } from "@/components/loading/loading";
import { postData } from "@/services/resources";
import { Modal } from "flowbite-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast, { Toaster } from "react-hot-toast";


export interface SalesContactSearchGtModalProps {
    onClose: () => void;
    onOpenContact: () => void;
    isShow?: boolean;
    setOrder: (data: any)=>void
    order: any;
}

export function SalesContactSearchGtModal(props: SalesContactSearchGtModalProps){
const { setOrder, onClose, isShow, order, onOpenContact } = props;
const { register, handleSubmit, reset, setFocus } = useForm();
const [isSending, setIsSending] = useState(false);


useEffect(() => {
    if (isShow) {
      setFocus("nit")
    }
  }, [isShow, setFocus]);



const sendNit = async (data: any) => {
    if (!data.nit){
        toast.error("Ingrese el numero de nit del cliente");
        return false;
    }
    setIsSending(true)
    try {
        const response = await postData(`orders/restaurant/nit`, 'PUT', { order: order.id, nit: data.nit });
        if (response.data) {
            setOrder(response.data)
            reset()
            onClose()
        } else {
            toast.error(response.message);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setIsSending(false)
      }
  }

return (
<Modal show={isShow} position="center" onClose={onClose} size="lg">
<Modal.Header>BUSCAR NIT</Modal.Header>
  <Modal.Body>

    <div className="mx-4">
        { isSending ? <Loading text="Buscando NIT" /> :
    <form className="max-w-lg mt-4" onSubmit={handleSubmit(sendNit)} >
        <div>
            <label htmlFor="default-search" className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white" >
            Search
            </label>
            <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <svg aria-hidden="true"  className="w-5 h-5 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" ></path>
                </svg>
            </div>
            <input
                type="text"
                className="block w-full p-4 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="Buscar NIT"
                autoComplete="off"
                {...register("nit", { required: true })}
            />
            </div>
            <div className="flex justify-center mt-3">
            <Button type="submit" text="Buscar"  preset={Preset.accept} isFull />
            </div>
        </div>
        </form>
        }
    </div>
  <Toaster position="top-right" reverseOrder={false} />
  </Modal.Body>
  <Modal.Footer className="flex justify-end">
    <Button onClick={()=>{ onOpenContact(); onClose()}} text="Buscar Cliente" disabled={isSending} preset={Preset.add} />
    <Button onClick={onClose} disabled={isSending} preset={Preset.close} /> 
  </Modal.Footer>
</Modal>

    )

}