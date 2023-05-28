"use client";
import { useState } from "react";
import { Button, Preset } from "../button/button";
import { useForm } from "react-hook-form";
import { postData, getData } from "@/services/resources";
import { Product } from "@/services/products";
import { numberToMoney } from "@/utils/functions";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { RadioButton, Option} from "../radio-button/radio-button";
import { style } from "@/app/theme";
import { Loading } from "../loading/loading";

export interface ProductPrecioMultipleProps {
  product?: Product | any;
}

export function PrecioMultiple(props: ProductPrecioMultipleProps) {
  const { product } = props;
  const { register, handleSubmit, reset } = useForm();
  const [isSending, setIsSending] = useState(false);
  const [newProductPrices, setNewProductPrices] = useState(product?.prices);
  const optionsRadioButton: Option[] = [
    { id: 1, name: "Precios" },
    { id: 2, name: "Mayoristas" },
    { id: 3, name: "Ecommerce" }
  ];

  const [selectedOption, setSelectedOption] = useState<Option | null>(optionsRadioButton[0] ? optionsRadioButton[0] : null);


  const onSubmit = async (data: any) => {
    data.product_id = product.id
    data.price_type = selectedOption?.id

    const id = toast.loading("Agregando...");
    try {
      setIsSending(true)
      const response = await postData("prices", "POST", data);
      if (!response.message) {
        const newProduct = await getData(`products/${product.id}`);    
        setNewProductPrices(newProduct.data.prices)   
        product.prices = newProduct.data.prices
        toast.update(id, { render: "Precio Agregado correctamente", type: "success", isLoading: false, autoClose: 2000,});
        reset();
      } else {
        toast.update(id, { render: "Ingrese ambos datos!", type: "error", isLoading: false, autoClose: 2000,});
      }
    } catch (error) {
      console.error(error);
      toast.update(id, { render: "Ha ocurrido un error!", type: "error", isLoading: false, autoClose: 2000,});
    } finally {
      setIsSending(false)
    }
  };


  const deletePrice = async (iden: any) => {
    const id = toast.loading("Eliminando...")
    try {
      const response = await postData(`prices/${iden}`, 'DELETE');
      const newProduct = await getData(`products/${product.id}`);    
      setNewProductPrices(newProduct.data.prices)   
      product.prices = newProduct.data.prices
      toast.update(id, { render: response.message, type: "success", isLoading: false, autoClose: 2000 });
    } catch (error) {
      console.error(error);
      toast.update(id, { render: "Ha ocurrido un error!", type: "error", isLoading: false, autoClose: 2000 });
    } 
  }


    const filteredPrices = newProductPrices.filter((price: any) => (price.price_type === selectedOption?.id));

    const listItems = filteredPrices.map((price: any) => (
        <tr key={price.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700" >
            <td className="py-3 px-6">{price.qty}</td>
            <td className="py-3 px-6">{numberToMoney(price.price)}</td>
            <td className="py-3 px-6"><Button onClick={()=> deletePrice(price.id)} noText={true} preset={Preset.smallClose} /></td>
        </tr>
      ));

  return (

        <div className="mx-4">
        <div className="w-full mx-4">
        <RadioButton options={optionsRadioButton} onSelectionChange={setSelectedOption} />
        </div>
          <div className="flex justify-center my-4">
            
          <div className="w-full">
            <table className="text-sm text-left text-gray-500 dark:text-gray-400 w-full">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                <th scope="col" className="py-3 px-4">Cantidad</th>
                <th scope="col" className="py-3 px-4">Precio</th>
                <th scope="col" className="py-3 px-4">Borrar</th>   
                </tr>
            </thead>
            <tbody>
            {listItems}
            </tbody>
            </table>

                
            <div className="flex justify-center my-4">
            <form onSubmit={handleSubmit(onSubmit)} className="w-full mx-6">
              <div className="flex flex-wrap -mx-3 mb-6">
                <div className="w-full md:w-1/2 px-3 mb-4">
                  <label
                    htmlFor="qty"
                    className={style.inputLabel}
                  >
                    Cantidad
                  </label>
                  <input
                    type="number"
                    id="qty"
                    {...register("qty")}
                    className={style.input}
                    step="any"
                  />
                </div>
                <div className="w-full md:w-1/2 px-3 mb-4">
                  <label
                    htmlFor="price"
                    className={style.inputLabel}
                  >
                    Precio
                  </label>
                  <input
                    type="number"
                    id="price"
                    {...register("price")}
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

          </div>
          <ToastContainer />

          </div>
          </div>
  );
}
