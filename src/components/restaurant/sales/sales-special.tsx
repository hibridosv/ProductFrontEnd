import { Button, Preset } from "@/components/button/button";
import { postData } from "@/services/resources";
import { Modal } from "flowbite-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast, { Toaster } from "react-hot-toast";
import { IconsMenuSpecial } from "./icons-menu-special";
import { Product } from "@/services/products";
import { OptionsClickSales } from "@/components/sales-components/sales-quick-table";
import { ProductsTableSpecial } from "./products-table-special";
import { style } from "@/theme";
import { groupInvoiceProductsByCodSpecial } from "@/utils/functions";
import { Alert } from "@/components/alert/alert";
import { PresetTheme } from "@/services/enums";
import { Option, RadioButton } from "@/components/radio-button/radio-button";


export interface SalesEspecialModalProps {
    onClose: () => void;
    isShow?: boolean;
    setOrder: (data: any)=>void
    order: any;
    config: string[];
    handleClickOptionProduct: (product: Product, option: OptionsClickSales)=>void
    sendProduct: (image: string)=> void

}

export function SalesEspecialModal(props: SalesEspecialModalProps){
const { setOrder, onClose, isShow, order, config, handleClickOptionProduct, sendProduct } = props;
const [isSending, setIsSending] = useState(false);
const { register, handleSubmit, reset, setValue } = useForm();
let optionsRadioButton: Option[] = [
  { id: 1, name: "Gravado" },
  { id: 2, name: "Exento" },
  { id: 3, name: "No Sujeto" },
];
const [selectedOption, setSelectedOption] = useState<Option>({ id: 1, name: "Gravado" });
let special = order?.invoiceproducts && groupInvoiceProductsByCodSpecial(order);

const onSubmit = async (data: any) => {
    
    if (!data.description|| !data.total){
        toast.error("Faltan datos importantes");
        return
    }
    let values = {
        description: data.description,
        quantity: 1,
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

return (
<Modal show={isShow} position="top-center" size="full">
<Modal.Header>INGRESAR PRODUCTOS DE VENTA ESPECIAL</Modal.Header>
  <Modal.Body>
    <div className="mx-4">
    <div className="grid grid-cols-1 md:grid-cols-10 pb-10">
            <div className="col-span-6 border-r md:border-sky-600">
                  <IconsMenuSpecial isShow={true} selectedIcon={sendProduct} config={config} isSending={false} />
            </div>
            <div className="col-span-4 border-l md:border-sky-600">
                  <ProductsTableSpecial order={order} onClickOrder={()=>{}} onClickProduct={handleClickOptionProduct} />
                  {special && special.length > 0 &&
                  <div className="mx-4 rounded-sm shadow-md ">
                        <form className="max-w-lg mt-4" onSubmit={handleSubmit(onSubmit)} >
                            <div className="w-full md:w-full px-3 mb-4">
                                <label htmlFor="description" className={style.inputLabel} >Descripción</label>
                                <input type="text" {...register("description", { required: true })} className={`${style.input} w-full`} />
                            </div>
                            <div className="w-full md:w-full px-3 mb-4">
                                <label htmlFor="total" className={style.inputLabel} >Precio</label>
                                <input type="number" step="any" {...register("total", { required: true })} className={`${style.input} w-full`} />
                            </div>
                            <div className="w-full md:w-full px-3 mb-4 flex justify-center">
                              <RadioButton options={optionsRadioButton} onSelectionChange={setSelectedOption} />
                            </div>
                            <div className="flex justify-center pb-4">
                            <Button type="submit" disabled={isSending} preset={isSending ? Preset.saving : Preset.save} />
                            </div>
                        </form>
                    </div>
                    }
            </div>

      </div>


        <Toaster position="top-right" reverseOrder={false} />
    </div>
  </Modal.Body>
  <Modal.Footer className="flex justify-end">
    {special && special.length > 0 ?
        <Alert theme={PresetTheme.danger} isDismisible={false} text="Por motivos técnicos debe completar la petición o eliminar los productos que ha agregado para cerrar esta ventana" /> :
        <Button onClick={onClose} preset={Preset.close} disabled={special && special.length > 0} /> 
    }
  </Modal.Footer>
</Modal>

    )

}