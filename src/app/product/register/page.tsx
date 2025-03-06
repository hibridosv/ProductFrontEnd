"use client";
import React, { useState, useEffect, useContext } from "react";
import { ViewTitle, Alert, Loading, ProductsTable } from "@/components";
import { RowTable } from "@/components/products-components/products-table";
import { useForm } from "react-hook-form";
import { FieldsFormProduct as Fields } from "@/constants/form-product-json";
import { postData, getData } from "@/services/resources";
import { Button, Preset } from "@/components/button/button";
import toast, { Toaster } from 'react-hot-toast';

import { ConfigContext } from "@/contexts/config-context";
import { style } from "@/theme";
import { getConfigStatus, fieldWidth, transformFields, getCountryProperty } from "@/utils/functions";
import { ProductLinkedModal } from "@/components/products-components/product-add-linked-modal";
import { PresetTheme } from "@/services/enums";
import { AddCategoriesModal } from "@/components/modals/add-categories-modal";
import { ContactAddModal } from "@/components/contacts-components/contact-add-modal";
import { AddLocationsModal } from "@/components/modals/add-locations-modal";
import { ToggleSwitch } from "flowbite-react";

export default function AddProduct() {
  const [message, setMessage] = useState<any>({});
  const [fieldsModified, setFieldsModified] = useState<any>(Fields);
  const [lastProducts, setLastProducts] = useState<any>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { config, systemInformation } = useContext(ConfigContext);
  const [expiresStatus, setExpiresStatus] = useState<boolean>(false);
  const [brandStatus, setBrandStatus] = useState<boolean>(false);
  const [measuresStatus, setMeasuresStatus] = useState<boolean>(false);
  const [discountStatus, setDiscountStatus] = useState<boolean>(false);
  const [commissionStatus, setCommissionStatus] = useState<boolean>(false);
  const [prescriptionStatus, setPrescriptionStatus] = useState<boolean>(false);
  const [isSending, setIsSending] = useState(false);
  const [isShowLinkedModal, setIsShowLinkedModal] = useState<boolean>(false);
  const [showModalCategories, setShowModalCategories] = useState(false);
  const [showModalProvider, setShowModalProvider] = useState(false);
  const [locationsStatus, setLocationsStatus] = useState<boolean>(false);
  const [showModalLocations, setShowModalLocations] = useState(false);


  const { register, handleSubmit, reset, watch, setValue } = useForm();

  useEffect(() => {
    setExpiresStatus(getConfigStatus("product-expires", config));
    setBrandStatus(getConfigStatus("product-brand", config));
    setMeasuresStatus(getConfigStatus("product-measures", config));
    setPrescriptionStatus(getConfigStatus("product-prescription", config));
    setDiscountStatus(getConfigStatus("product-default-discount", config));
    setCommissionStatus(getConfigStatus("product-default-commission", config));
    setLocationsStatus(getConfigStatus("product-locations", config));
    // eslint-disable-next-line
  }, [config]);

  
  useEffect(() => {
    if (!showModalCategories && !showModalProvider && !showModalLocations) {
    (async () => {
      setIsLoading(true);
      try {
        const specialData = await getData("special/initial-add");
        const FieldsFormProduct = transformFields(Fields, specialData);    
        setFieldsModified(FieldsFormProduct);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    })();
  }
    // eslint-disable-next-line
  }, [showModalCategories, showModalProvider, showModalLocations]);

  useEffect(() => {
    (async () => {
        const products = await getData("products?sort=-created_at&filterWhere[status]==1&filterWhere[is_restaurant]==0&perPage=10");
        setLastProducts(products);
      })();
    // eslint-disable-next-line
  }, [systemInformation]);


  const onSubmit = async (data: any) => {
    if (data.product_type != 1) {
      data.quantity = 1;
      data.minimum_stock = 1;
    }
    if (data.expiration) data.expires = 1;
    if (!data.unit_cost) data.unit_cost = 0;
    if (!data.sale_price) data.sale_price = 0;
    data.taxes = getCountryProperty(parseInt(systemInformation?.system?.country)).taxes;
    console.log(data);
    return
    try {
      setIsSending(true);
      const response = await postData(`products`, "POST", data);
      if (!response.message) {
        let newProducts = await getData("products?sort=-created_at&filterWhere[status]==1&filterWhere[is_restaurant]==0&perPage=10");
        toast.success("Producto agregado correctamente");
        setLastProducts(newProducts);
        reset();
        setValue("product_type", 1);
      } else {
        toast.error("Faltan algunos datos importantes!");
      }
      setMessage(response);
      setIsShowLinkedModal(response?.data?.product_type == 3 ? true : false);
    } catch (error) {
      console.error(error);
      toast.error("Ha ocurrido un error!");
    } finally {
      setIsSending(false);
    }
  };

  const getModal = (field: any)=>{
    switch (field) {
      case "category_id": setShowModalCategories(true)
        break;
      case "provider_id": setShowModalProvider(true)
        break;
      case "location_id": setShowModalLocations(true)
        break;
      default: ()=>{}
        break;
    }
  }

  const getField = (field: any): any => {
    // const styled = field.style === "full" ? "w-full px-3 mb-2" : "w-full md:w-1/2 px-3 mb-2";
    let hiddenFields =
    watch("product_type") == 1
    ? []
    : [
            "category_id",
            "brand_id",
            "provider_id",
            "location_id",
            "quantity",
            "minimum_stock",
            "quantity_unit_id",
            "measure",
            "default_discount",
            // "default_commission",
          ];
    if (!brandStatus) hiddenFields.push("brand_id");
    if (!locationsStatus) hiddenFields.push("location_id");
    if (!measuresStatus) hiddenFields.push("measure");
    if (!discountStatus) hiddenFields.push("default_discount");
    if (!commissionStatus) hiddenFields.push("default_commission");
    
    if (!hiddenFields.includes(field.id)) {
      return (
        <div key={field.id} className={fieldWidth(field.style)}>
          <label htmlFor={field.id} className={`${style.inputLabel} ${field.isClickeable && " clickeable"}`} 
          onClick={()=>getModal(field.id)}>
            {field.name} {field.isClickeable && " (Click para agregar)"}
          </label>
          {field.type === "select" && (
            <select
              defaultValue={field.values[0] ? field.values[0].id : null}
              id={field.id}
              {...register(field.id)}
              className={style.input}
            >
              {field.values?.map((value: any) => {
                return (
                  <option key={value.id} value={value.id}>
                    {value.name}
                  </option>
                );
              })}
            </select>
          )}
          {field.type === "number" && (
            <input
              type={field.type}
              id={field.id}
              {...register(field.id)}
              className={style.input}
              step="any"
              min={0}
            />
          )}
          {field.type === "text" && (
            <input
              type={field.type}
              id={field.id}
              {...register(field.id)}
              className={style.input}
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
        <ViewTitle text="NUEVO PRODUCTO" />

          <div className="w-full px-4">
          { isLoading ? <Loading text="Transforming" /> :
            <form onSubmit={handleSubmit(onSubmit)} className="w-full">
              <div className="flex flex-wrap -mx-3 mb-6">
                {fieldsModified.map((field: any) => getField(field))}

                {watch("product_type") == 1 && expiresStatus && (
                  <div className="w-full md:w-1/3 px-3 mb-4">
                    <label htmlFor="expiration" className={style.inputLabel}>
                      {" "}
                      Fecha de vencimiento{" "}
                    </label>
                    <input
                      type="date"
                      id="expiration"
                      {...register("expiration")}
                      className={style.input}
                    />
                  </div>
                )}

                {watch("product_type") == 1 && prescriptionStatus && (
                  <div className="w-full md:w-1/3 px-3 mb-4">
                    <label htmlFor="prescription" className={style.inputLabel}>
                      Solicitar Receta{" "}
                    </label>
                    <input
                      type="checkbox"
                      placeholder="prescription"
                      {...register("prescription", {})}
                    />
                  </div>
                )}

                <div className="w-full md:w-full px-3 mb-4">
                  <label htmlFor="information" className={style.inputLabel}>
                    Información{" "}
                  </label>
                  <textarea
                    {...register("information", {})}
                    rows={2}
                    className={`${style.input} w-full`}
                  />
                </div>
              </div>

              {message.errors && (
                <div className="mb-4">
                  <Alert
                    theme={PresetTheme.danger}
                    info="Error"
                    text={JSON.stringify(message.message)}
                    isDismisible={false}
                  />
                </div>
              )}

              <div className="flex justify-center">
                <Button type="submit" disabled={isSending} preset={isSending ? Preset.saving : Preset.save} />
              </div>
            </form> }
          </div>


      </div>
      <div className="col-span-2">
        <ViewTitle text="ULTIMOS PRODUCTOS" />
        <div className="w-full p-4">
          <ProductsTable
            products={lastProducts}
            withOutRows={[
              RowTable.brand,
              RowTable.category,
              RowTable.minimum_stock,
              RowTable.options,
              RowTable.prices,
            ]}
            onDelete={() => {}}
            updatePrice={()=>{}}
          />
        </div>
      </div>

        <ProductLinkedModal isShow={isShowLinkedModal} product={message.data} onClose={() => setIsShowLinkedModal(false)} />
        <AddCategoriesModal isShow={showModalCategories} onClose={() => setShowModalCategories(false)} />
        <ContactAddModal isShow={showModalProvider} onClose={()=>setShowModalProvider(false)} />
        <AddLocationsModal isShow={showModalLocations} onClose={() => setShowModalLocations(false)} />
      <Toaster position="top-right" reverseOrder={false} />
    </div>
  );
}
