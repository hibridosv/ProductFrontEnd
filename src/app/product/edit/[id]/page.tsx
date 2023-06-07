'use client'
import { useState, useEffect, useContext } from "react";
import { ViewTitle, Alert, Loading } from "../../../components";
import { useForm } from "react-hook-form";
import { FieldsFormProduct as Fields } from "../../../../constants/form-product-json";
import { postData, getData } from "@/services/resources";
import { Button, Preset } from "../../../components/button/button";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ConfigContext } from "../../../../contexts/config-context";
import { style } from "../../../../theme/styles";
import { MultiPrice } from "@/app/components/products-components/multi-price";



  export default function GetProduct({ params }: { params: { id: number } }) {
    const [message, setMessage] = useState<any>({});
    const [fieldsModified, setFieldsModified] = useState<any>(Fields);
    const [selectedProduct, setSelectedProdcut] = useState<any>({});
    const [isLoading, setIsLoading] = useState(false);
    const {config } = useContext(ConfigContext);
    const [brandStatus, setBrandStatus] = useState<boolean>(false)
    const [measuresStatus, setMeasuresStatus] = useState<boolean>(false)
    const [discountStatus, setDiscountStatus] = useState<boolean>(false)
    const [prescriptionStatus, setPrescriptionStatus] = useState<boolean>(false)
    const [isSending, setIsSending] = useState(false);
  
  
    const menu = [
      { name: "VER PRODUCTOS", link: "/product" },
      { name: "AGREGAR PRODUCTO", link: "/product/register" },
      { name: "IMPRIMIR", link: "/" },
    ];
  
  
    const { register, handleSubmit, reset, watch, setValue } = useForm();
  
    useEffect(() => {
      setBrandStatus(getConfigStatus("product-brand"))
      setMeasuresStatus(getConfigStatus("product-measures"))
      setPrescriptionStatus(getConfigStatus("product-prescription"))
      setDiscountStatus(getConfigStatus("product-default_discount"))
      // eslint-disable-next-line
    }, [config])
  
    const getConfigStatus = (feature: string)=>{
      if (config?.configurations) {
       return config.configurations.find((configuration: any) => configuration.feature === feature)?.active === 1
      }
      return false
    }
    
    useEffect(() => {
      (async () => {
        setIsLoading(true);
        try {
          const specialData = await getData("special/initial-add");
          const product = await getData(`products/${params.id}`);       
  
  
          const FieldsFormProduct = [...Fields];
          const categorys = specialData.categories
          const quantityUnits = specialData.quantityUnits
          const providers = specialData.providers
          const brands = specialData.brands
  
          
          const categoriesData = Array.isArray(categorys) ? categorys : [];
          const categoryValues = categoriesData.map((category) => ({
            id: category.id,
            name: category.name,
            isSelected: category.name === "Principal",
          }));
          
          const categoryField = Array.isArray(FieldsFormProduct) ? FieldsFormProduct.find(
            (field) => field.id === "category_id"
          ) : null;
          
          if (categoryField) {
            categoryField.values = categoryValues;
          }
          
          
          const quantityUnitField = Array.isArray(FieldsFormProduct) ? FieldsFormProduct.find(
            (field) => field.id === "quantity_unit_id"
          ) : null;
          
          if (quantityUnitField) {
            quantityUnitField.values = Array.isArray(quantityUnits) ? quantityUnits.map((unit) => ({
              id: unit.id,
              name: unit.name,
              isSelected: false,
            })) : [];
          }
          
          
          const providerField = Array.isArray(FieldsFormProduct) ? FieldsFormProduct.find(
            (field) => field.id === "provider_id"
          ) : null;
          
          if (providerField) {
            providerField.values = Array.isArray(providers) ? providers.map((provider) => ({
              id: provider.id,
              name: provider.name,
              isSelected: false,
            })) : [];
          }
  
          const BrandField = Array.isArray(FieldsFormProduct) ? FieldsFormProduct.find(
            (field) => field.id === "brand_id"
          ) : null;
          
          if (BrandField) {
            BrandField.values = Array.isArray(brands) ? brands.map((brand) => ({
              id: brand.id,
              name: brand.name,
              isSelected: false,
            })) : [];
          }
  
          setFieldsModified(FieldsFormProduct);
          setSelectedProdcut(product)
          setIsLoading(false);

        } catch (error) {
          console.error(error);
        } 
      })();
      // eslint-disable-next-line
    }, []);

    useEffect(() => {
      setValue("cod", selectedProduct?.data?.cod)
      setValue("description", selectedProduct?.data?.description)
      setValue("quantity", selectedProduct?.data?.quantity)
      setValue("minimum_stock", selectedProduct?.data?.minimum_stock)
      setValue("category_id", selectedProduct?.data?.category_id)
      setValue("quantity_unit_id", selectedProduct?.data?.quantity_unit_id)
      setValue("provider_id", selectedProduct?.data?.provider_id)
      setValue("brand_id", selectedProduct?.data?.brand_id)

      setValue("measure", selectedProduct?.data?.measure)
      setValue("default_discount", selectedProduct?.data?.default_discount)
      setValue("prescription", selectedProduct?.data?.prescription)

      // eslint-disable-next-line
    }, [selectedProduct])
  
    const onSubmit = async (data: any) => {
      data.product_type = selectedProduct?.data?.product_type
      if (data.product_type != 1) {
        data.quantity = 1;
        data.minimum_stock = 1;
      }
      if (data.expiration) data.expires = 1;

      const id = toast.loading("Guardando...")
      try {
        setIsSending(true)
        const response = await postData(`products/${params.id}`, "PUT", data);
        setMessage(response);
        if (!response.message) {
          setSelectedProdcut(response)
          toast.update(id, { render: "Producto actualizado correctamente", type: "success", isLoading: false, autoClose: 2000 });
        } else {
        toast.update(id, { render: "Faltan algunos datos importantes!", type: "error", isLoading: false, autoClose: 2000 });
        }
        
      } catch (error) {
        console.error(error);
        toast.update(id, { render: "Ha ocurrido un error!", type: "error", isLoading: false, autoClose: 2000 });
      } finally{
        setIsSending(false)
      }
    };

    return (
      <div className="grid grid-cols-1 md:grid-cols-4 pb-10">
        <div className="col-span-2 border-r-2">
          <ViewTitle text="ACTUALIZAR PRODUCTO" links={menu} />
          { !isLoading ? (
            <div className="w-full p-4">
              <form onSubmit={handleSubmit(onSubmit)} className="w-full">
  
              <div className="flex flex-wrap -mx-3 mb-6">

              <div className="w-full px-3 mb-2">
                <label htmlFor="cod" className={style.inputLabel}>Codigo</label>
                <input type="text" id="cod" readOnly {...register("cod")} className={style.input} />
              </div>

              <div className="w-full px-3 mb-2">
                <label htmlFor="description" className={style.inputLabel}>Descripción</label>
                <input type="text" id="description" {...register("description")} className={style.input} />
              </div>

              <div className="w-full md:w-1/2 px-3 mb-4">
                <label htmlFor="quantity" className={style.inputLabel}>Cantidad</label>
                <input type="number" id="quantity" readOnly {...register("quantity")} className={style.input} />
              </div>

              <div className="w-full md:w-1/2 px-3 mb-4">
                <label htmlFor="minimum_stock" className={style.inputLabel}>Minimo de Stock</label>
                <input type="number" id="minimum_stock" disabled={selectedProduct?.data?.product_type != 1 ? true : false} {...register("minimum_stock")} className={style.input} />
              </div>


              <div className="w-full md:w-1/3 px-3 mb-2">
                <label htmlFor="category_id" className={style.inputLabel}>Categoria</label>
                <select
                  id="category_id"
                  {...register("category_id")}
                  className={style.input}
                >
                  {fieldsModified[7]?.values?.map((value: any) => {
                    return (
                      <option key={value.id} value={value.id}>
                        {value.name}
                      </option>
                    );
                  })}
                </select>
              </div>

              <div className="w-full md:w-1/3 px-3 mb-2">
                <label htmlFor="quantity_unit_id" className={style.inputLabel}>Unidad de Medida</label>
                <select 
                  id="quantity_unit_id"
                  {...register("quantity_unit_id")}
                  className={style.input}
                >
                  {fieldsModified[8]?.values?.map((value: any) => {
                    return (
                      <option key={value.id} value={value.id}>
                        {value.name}
                      </option>
                    );
                  })}
                </select>
              </div>

              <div className="w-full md:w-1/3 px-3 mb-2">
                <label htmlFor="provider_id" className={style.inputLabel}>Proveedor</label>
                <select
                  id="provider_id"
                  {...register("provider_id")}
                  className={style.input}
                >
                  {fieldsModified[9]?.values?.map((value: any) => {
                    return (
                      <option key={value.id} value={value.id}>
                        {value.name}
                      </option>
                    );
                  })}
                </select>
              </div>

              { (selectedProduct?.data?.product_type == 1 && brandStatus) && (<div className="w-full md:w-1/3 px-3 mb-2">
                <label htmlFor="brand_id" className={style.inputLabel}>Marca</label>
                <select 
                  id="brand_id"
                  {...register("brand_id")}
                  className={style.input}
                >
                  {fieldsModified[10]?.values?.map((value: any) => {
                    return (
                      <option key={value.id} value={value.id}>
                        {value.name}
                      </option>
                    );
                  })}
                </select>
              </div>)}

              { (selectedProduct?.data?.product_type == 1 && measuresStatus) && (<div className="w-full md:w-1/3 px-3 mb-4">
                <label htmlFor="measure" className={style.inputLabel}>Medida</label>
                <input type="text" id="measure" {...register("measure")} className={style.input} />
              </div>)}

              { (selectedProduct?.data?.product_type == 1 && discountStatus) && (<div className="w-full md:w-1/3 px-3 mb-4">
                <label htmlFor="default_discount" className={style.inputLabel}>Descuento por Defecto %</label>
                <input type="number" step="any" id="default_discount" {...register("default_discount")} className={style.input} />
              </div>)}

              { (selectedProduct?.data?.product_type == 1 && prescriptionStatus) && (<div className="w-full md:w-1/3 px-3 mb-4">
              <label htmlFor="prescription" className={style.inputLabel} >Solicitar Receta </label>
              <input type="checkbox" placeholder="prescription" {...register("prescription", {})} />
              </div>)}


              </div>
  
              {message.errors && (
                <div className="mb-4">
                  <Alert
                    type="red"
                    info="Error"
                    text={JSON.stringify(message.message)}
                    isDismisible={false}
                  />
                </div>
              )}
  
              <div className="flex justify-center">
                { isSending ? <Button disabled={true} preset={Preset.saving} /> : <Button type="submit" preset={Preset.save} /> }
              </div>
            </form>
            </div>
          ) : <Loading /> }
  
        </div>
        <div className="col-span-2">

        
          <div className="w-full p-4 border-l-2">
          { !isLoading ? (<div>
            {selectedProduct?.data?.product_type != 1 && (
              <div className="w-full px-3 mb-2">
                
                <Alert
                  type={selectedProduct?.data?.product_type === 2 ? "green" : "red"}
                  info="Información:"
                  text={`Este elemento se ha registrado como un ${selectedProduct?.data?.product_type === 2 ? "servicio": "producto compuesto"}`  }
                  isDismisible={false}
                />
              </div>
            )}
            { selectedProduct?.data ? <MultiPrice product={selectedProduct?.data} /> : <Loading /> }
          </div>) : <Loading /> }

          </div>
        </div>
        <ToastContainer />
      </div>
    );
  }