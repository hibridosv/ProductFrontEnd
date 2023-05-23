"use client";
import { useState, useEffect } from "react";
import { ViewTitle, Alert, Loading } from "../../components";
import { useForm } from "react-hook-form";
import { FieldsFormProduct as Fields } from "../../../constants/form-product-json";
import { postData, getData } from "@/services/resources";
import { Button, Preset } from "../../components/Button/button";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function AddProduct() {
  const [message, setMessage] = useState<any>({});
  const [fieldsModified, setFieldsModified] = useState<any>(Fields);
  const [isLoading, setIsLoading] = useState(false);

  const menu = [
    { name: "VER PRODUCTOS", link: "/product" },
    { name: "IMPRIMIR", link: "/" },
  ];

  const { register, handleSubmit, reset } = useForm();

  useEffect(() => {
    (async () => {
      setIsLoading(true);
      try {
        const cate = await getData("categorys");
        const quantity = await getData("quantityunits");
        const provid = await getData("contacts/providers");

        const FieldsFormProduct = [...Fields];
        const categorys = cate.data
        const quantityUnits = quantity.data
        const providers = provid.data

        
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

        setFieldsModified(FieldsFormProduct);
        setIsLoading(false);
      } catch (error) {
        console.error(error);
      } 
    })();
    // eslint-disable-next-line
  }, []);

  const onSubmit = async (data: any) => {
    const id = toast.loading("Guardando...")
    try {
      const response = await postData(`products`, "POST", data);
      setMessage(response);
      console.log(response)
      if (!response.message) {
        toast.update(id, { render: "Producto agregado correctamente", type: "success", isLoading: false, autoClose: 2000 });
        reset();
      } else {
      toast.update(id, { render: "Faltan algunos datos importantes!", type: "error", isLoading: false, autoClose: 2000 });
      }
    } catch (error) {
      console.error(error);
      toast.update(id, { render: "Ha ocurrido un error!", type: "error", isLoading: false, autoClose: 2000 });
    }
  };


  const getField = (field: any): any => {
    const styled =
      field.style === "full" ? "w-full px-3 mb-2" : "w-full md:w-1/2 px-3 mb-4";
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
          />
        )}
      </div>
    );
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

              <Button type="submit" preset={Preset.save} />

            </div>
          </form>
          </div>
        ) : <Loading /> }

      </div>
      <div className="col-span-2">
        <ViewTitle text="ULTIMOS PRODUCTOS"  />
        <div className="w-full p-4">
             Last Products table here...
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}
