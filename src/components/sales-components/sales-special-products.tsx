import { Button, Preset } from "@/components/button/button";
import { SearchInput } from "@/components/form/search";
import { Loading } from "@/components/loading/loading";
import { postData } from "@/services/resources";
import { Modal } from "flowbite-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast, { Toaster } from "react-hot-toast";
import { Product } from "@/services/products";
import { OptionsClickSales } from "@/components/sales-components/sales-quick-table";
import { style } from "@/theme";
import { groupInvoiceProductsByCodSpecial } from "@/utils/functions";
import { Alert } from "@/components/alert/alert";
import { PresetTheme } from "@/services/enums";
import { SalesSearchByName } from "./sales-search-by-name";
import { SalesSearchByCode } from "./sales-search-by-cod";
import { ProductsTableSpecial } from "../restaurant/sales/products-table-special";
import { SalesProductsTableSpecial } from "./sales-products-table-special";
import { Option, RadioButton } from "../radio-button/radio-button";


export interface SalesEspecialProductsModalProps {
    onClose: () => void;
    isShow?: boolean;
    order: any;
    onFormSubmit: (data: FormData) => void;
    isLoading: boolean;
    searchType: boolean; // tipo de busqueda
    handleClickOptionProduct: (product: Product, option: OptionsClickSales)=>void
    onSubmit: (product : Product) => void;
}

interface FormData {
    cod: string;
}

export function SalesEspecialProductsModal(props: SalesEspecialProductsModalProps){
const { onClose, isShow, order, handleClickOptionProduct, onFormSubmit, onSubmit, searchType } = props;
const [isSending, setIsSending] = useState(false);
const { register, handleSubmit, reset, setValue } = useForm();
const [typeOfSearch, setTypeOfSearch] = useState(false); // false: codigo, true: busqueda por nombre
let optionsRadioButton: Option[] = [
  { id: 1, name: "Gravado" },
  { id: 2, name: "Exento" },
  { id: 3, name: "No Sujeto" },
];
const [selectedOption, setSelectedOption] = useState<Option>({ id: 1, name: "Gravado" });
let special = order?.invoiceproducts && groupInvoiceProductsByCodSpecial(order);

  useEffect(() => {
    if (isShow) {
      setTypeOfSearch(searchType)
    }
  }, [isShow, searchType]);


  console.log("isShow: ", isShow)

const onSubmitSpecial = async (data: any) => {
    
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
<Modal show={isShow} position="top-center" size="6xl">
<Modal.Header>INGRESAR PRODUCTOS DE VENTA ESPECIAL</Modal.Header>
  <Modal.Body>
    <div className="mx-4">
    <div className="grid grid-cols-1 md:grid-cols-10 pb-10">
            <div className="col-span-4 border-r md:border-sky-600">
                  {/* Buscar productos */}
                  { typeOfSearch ? 
                        <SalesSearchByName setTypeOfSearch={setTypeOfSearch} typeOfSearch={typeOfSearch} onSubmit={onSubmit}  /> 
                        : 
                        <SalesSearchByCode setTypeOfSearch={setTypeOfSearch} typeOfSearch={typeOfSearch} onFormSubmit={onFormSubmit} isLoading={false} /> 
                    }
            </div>
            <div className="col-span-6 border-l md:border-sky-600">
                  <SalesProductsTableSpecial order={order} onClickProduct={handleClickOptionProduct} />
                  {special && special.length > 0 &&
                  <div className="mx-4 rounded-sm shadow-md ">
                        <form className="max-w-lg mt-4" onSubmit={handleSubmit(onSubmitSpecial)} >
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