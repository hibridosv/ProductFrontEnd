"use client";
import { useState, useEffect, useContext } from "react";
import { ViewTitle, Alert, Loading, ProductsTable } from "../../components";
import { RowTable } from "../../components/table/products-table";
import { useForm } from "react-hook-form";
import { FieldsFormProduct as Fields } from "../../../constants/form-product-json";
import { postData, getData } from "@/services/resources";
import { Button, Preset } from "../../components/button/button";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ConfigContext } from "../../../contexts/config-context";

export default function AddProduct() {
  const [message, setMessage] = useState<any>({});
  const [fieldsModified, setFieldsModified] = useState<any>(Fields);
  const [lastProducts, setLastProducts] = useState<any>({});
  const [isLoading, setIsLoading] = useState(false);
  const {config } = useContext(ConfigContext);
  const [expiresStatus, setExpiresStatus] = useState<boolean>(false)
  const [brandStatus, setBrandStatus] = useState<boolean>(false)
  const [measuresStatus, setMeasuresStatus] = useState<boolean>(false)
  const [isSending, setIsSending] = useState(false);


  const menu = [
    { name: "VER PRODUCTOS", link: "/product" },
    { name: "IMPRIMIR", link: "/" },
  ];


  const { register, handleSubmit, reset, watch } = useForm();

  useEffect(() => {
    setExpiresStatus(getExpiresStatus("product-expires"))
    setBrandStatus(getExpiresStatus("product-brand"))
    setMeasuresStatus(getExpiresStatus("product-mesaures"))
  }, [config])

  const getExpiresStatus = (feature: string)=>{
    if (config?.configurations) {
     return config.configurations.find((configuration: any) => configuration.feature === feature)?.active === 1
    }
    return false
  }
  
  useEffect(() => {
    (async () => {
      setIsLoading(true);
      try {
        const cate = await getData("categorys");
        const quantity = await getData("quantityunits");
        const provid = await getData("contacts/providers");
        const bra = await getData("brands");
        const products = await getData("products?sort=-created_at&perPage=10");       


        const FieldsFormProduct = [...Fields];
        const categorys = cate.data
        const quantityUnits = quantity.data
        const providers = provid.data
        const brands = bra.data

        
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
        setLastProducts(products)
        setIsLoading(false);
      } catch (error) {
        console.error(error);
      } 
    })();
    // eslint-disable-next-line
  }, []);

  const onSubmit = async (data: any) => {
    if (data.product_type != 1) {
      data.quantity = 1;
      data.minimum_stock = 1;
    }
    if (data.expiration) data.expires = 1;

    const id = toast.loading("Guardando...")
    try {
      setIsSending(true)
      const response = await postData(`products`, "POST", data);
      setMessage(response);
      console.log(response)
      if (!response.message) {
        let newProducts = await getData("products?sort=-created_at&perPage=10");
        setLastProducts(newProducts)
        toast.update(id, { render: "Producto agregado correctamente", type: "success", isLoading: false, autoClose: 2000 });
        reset();
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

  const getField = (field: any): any => {
    const styled = field.style === "full" ? "w-full px-3 mb-2" : "w-full md:w-1/2 px-3 mb-4";
    let hiddenFields = watch("product_type") == 1 ? [] : ["category_id", "brand_id", "provider_id", "quantity", "minimum_stock", "quantity_unit_id", "measure"]
    if(!brandStatus) hiddenFields.push("brand_id")
    if(!measuresStatus) hiddenFields.push("measure")

    if (!hiddenFields.includes(field.id)) {
      return (
        <div key={field.id} className={styled}>
          <label
            htmlFor={field.id}
            className="block text-gray-700 text-sm font-bold mb-1"
          >
            {field.name}
          </label>
          {field.type === "select" ? (
            <select
              id={field.id}
              {...register(field.id)}
              className="appearance-none block w-full bg-white border border-gray-300 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
            >
              {field.values?.map((value: any) => {
                return (
                  <option key={value.id} value={value.id}>
                    {value.name}
                  </option>
                );
              })}
            </select>
          ) : (
            <input
              type={field.type}
              id={field.id}
              {...register(field.id)}
              className="appearance-none block w-full bg-white border border-gray-300 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
              step="any"
            />
          )}
        </div>
      );   
    }
    return null;

  };

  
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 pb-10">
      <div className="col-span-2">
        <ViewTitle text="NUEVO PRODUCTO" links={menu} />
        { !isLoading ? (
          <div className="w-full p-4">
            <form onSubmit={handleSubmit(onSubmit)} className="w-full mx-6">

            <div className="flex flex-wrap -mx-3 mb-6">
              {fieldsModified.map((field: any) => getField(field))}

             { expiresStatus && (<div className="w-full md:w-1/2 px-3 mb-4">
                <label htmlFor="expiration" className="block text-gray-700 text-sm font-bold mb-1" > Fecha de vencimiento </label>
              <input type="date" id="expiration" {...register("expiration")} className="appearance-none block w-full bg-white border border-gray-300 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500" />
              </div>) }

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

              { isSending ? <Button type="submit" disabled={true} preset={Preset.saving} /> : <Button type="submit" preset={Preset.save} /> }

            </div>
          </form>
          </div>
        ) : <Loading /> }

      </div>
      <div className="col-span-2">
        <ViewTitle text="ULTIMOS PRODUCTOS"  />
        <div className="w-full p-4">
            <ProductsTable products={lastProducts} 
            withOutRows={[RowTable.brand, RowTable.category, RowTable.minimum_stock, RowTable.options, RowTable.prices]}
            onDelete={()=> console.log("Delete")} 
            />
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}
