"use client";
import { useState, useContext, useEffect } from "react";
import { Button, Preset } from "../button/button";
import { useForm } from "react-hook-form";
import { postData, getData } from "@/services/resources";
import { Price, Product } from "@/services/products";
import { getConfigStatus, numberToMoney } from "@/utils/functions";
import toast, { Toaster } from 'react-hot-toast';

import { RadioButton, Option} from "../radio-button/radio-button";
import { style } from "../../../theme";
import { ConfigContext } from "../../../contexts/config-context";
import { Alert } from "../alert/alert";


export interface ProductPrecioMultipleProps {
  product?: Product | any;
}

export function MultiPrice(props: ProductPrecioMultipleProps) {
  const { product } = props;
  const { register, handleSubmit, reset } = useForm();
  const [isSending, setIsSending] = useState(false);
  const [newProductPrices, setNewProductPrices] = useState(product?.prices);
  
  let optionsRadioButton: Option[] = [
    { id: 0, name: "Todos" },
    { id: 1, name: "Precios" },
  ];

  const priceTypeToText = (price: Price) =>{
      switch (price.price_type) {
        case 1: return "Precio"
        case 2: return "Mayorista"
        case 3: return "Promoción"
      }
  }

  const { config } = useContext(ConfigContext);
  const [wolesalerStatus, setWolesalerStatus] = useState<boolean>(false)
  const [promotionStatus, setPromotionStatus] = useState<boolean>(false)
  const [selectedOption, setSelectedOption] = useState<Option | null>(optionsRadioButton[0] ? optionsRadioButton[0] : null);

  useEffect(() => {
    setWolesalerStatus(getConfigStatus("product-price-wolesaler", config))
    setPromotionStatus(getConfigStatus("product-price-promotion", config))
    // eslint-disable-next-line
  }, [config])

  if(wolesalerStatus) optionsRadioButton.push({id: 2, name: "Mayoristas"})
  if(promotionStatus) optionsRadioButton.push({id: 3, name: "Promoción"})

  const onSubmit = async (data: any) => {
    data.product_id = product.id
    data.price_type = selectedOption?.id

    try {
      setIsSending(true)
      const response = await postData("prices", "POST", data);
      if (!response.message) {
        const newProduct = await getData(`products/${product.id}`);    
        setNewProductPrices(newProduct.data.prices)   
        product.prices = newProduct.data.prices
        toast.success( "Precio Agregado correctamente");
        reset();
      } else {
      toast.error("Ingrese ambos datos!");
      }
    } catch (error) {
      console.error(error);
      toast.error("Ha ocurrido un error!");
    } finally {
      setIsSending(false)
    }
  };


  const deletePrice = async (iden: any) => {
    try {
      const response = await postData(`prices/${iden}`, 'DELETE');
      const newProduct = await getData(`products/${product.id}`);    
      setNewProductPrices(newProduct.data.prices)   
      product.prices = newProduct.data.prices
        toast.success( response.message);
    } catch (error) {
      console.error(error);
      toast.error("Ha ocurrido un error!");
    } 
  }

    const filteredPrices = selectedOption?.id == 0 ? newProductPrices : newProductPrices.filter((price: any) => (price.price_type === selectedOption?.id));
    const listItems = filteredPrices.map((price: any) => (
        <tr key={price.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700" >
            <td className="py-3 px-6">{price.qty}</td>
            <td className="py-3 px-6">{numberToMoney(price.price)}</td>
            <td className="py-3 px-6">{ priceTypeToText(price) }</td>
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
                <th scope="col" className="py-3 px-4">Tipo</th>
                <th scope="col" className="py-3 px-4">Borrar</th>   
                </tr>
            </thead>
            <tbody>
            {listItems}
            </tbody>
            </table>

                
            { selectedOption?.id != 0 ? (<div className="flex justify-center my-4">
            <form onSubmit={handleSubmit(onSubmit)} className="w-full mx-6">
              <div className="flex flex-wrap -mx-3 mb-6">
                <div className="w-full md:w-1/3 px-3 mb-4">
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
                <div className="w-full md:w-1/3 px-3 mb-4">
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
                <div className="w-full md:w-1/3 px-3 mb-4 mt-5">
                { isSending ? <Button disabled={true} preset={Preset.saving} /> : <Button type="submit" preset={Preset.save} /> }
                </div>

              </div >

            </form>
          </div>) : 
          newProductPrices.length === 0 ? 
              (<div className="mt-4">
                <Alert
                  type="red"
                  info="Error:"
                  text="No existe ningun precio! Seleccione el tipo de precio a agregar"
                  isDismisible={false}
                />
              </div>) :
              (<div className="mt-4">
              <Alert
                type="green"
                info="Información:"
                text="Seleccione el tipo de precio a agregar"
                isDismisible={false}
              />
            </div>)
          }

          </div>

          </div>
      <Toaster position="top-right" reverseOrder={false} />
          </div>
  );
}
