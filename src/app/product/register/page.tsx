"use client";
import React, { useState, useEffect, useContext } from "react";
import { ViewTitle, Alert, Loading, ProductsTable } from "@/app/components";
import { RowTable } from "@/app/components/table/products-table";
import { useForm } from "react-hook-form";
import { FieldsFormProduct as Fields } from "@/constants/form-product-json";
import { postData, getData } from "@/services/resources";
import { Button, Preset } from "@/app/components/button/button";
import toast, { Toaster } from 'react-hot-toast';

import { ConfigContext } from "@/contexts/config-context";
import { style } from "@/theme";
import { getConfigStatus, fieldWidth } from "@/utils/functions";
import { ProductCompoundModal } from "@/app/components/modals/product-add-compound-modal";
import { PresetTheme } from "@/services/enums";

export default function AddProduct() {
  const [message, setMessage] = useState<any>({});
  const [fieldsModified, setFieldsModified] = useState<any>(Fields);
  const [lastProducts, setLastProducts] = useState<any>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { config } = useContext(ConfigContext);
  const [expiresStatus, setExpiresStatus] = useState<boolean>(false);
  const [brandStatus, setBrandStatus] = useState<boolean>(false);
  const [measuresStatus, setMeasuresStatus] = useState<boolean>(false);
  const [discountStatus, setDiscountStatus] = useState<boolean>(false);
  const [prescriptionStatus, setPrescriptionStatus] = useState<boolean>(false);
  const [isSending, setIsSending] = useState(false);
  const [isShowCompoundModal, setIsShowCompoundModal] = useState<boolean>(false);

  const menu = [
    { name: "VER PRODUCTOS", link: "/product" },
    { name: "IMPRIMIR", link: "/" },
  ];

  const { register, handleSubmit, reset, watch, setValue } = useForm();

  useEffect(() => {
    setExpiresStatus(getConfigStatus("product-expires", config));
    setBrandStatus(getConfigStatus("product-brand", config));
    setMeasuresStatus(getConfigStatus("product-measures", config));
    setPrescriptionStatus(getConfigStatus("product-prescription", config));
    setDiscountStatus(getConfigStatus("product-default_discount", config));
    // eslint-disable-next-line
  }, [config]);

  useEffect(() => {
    (async () => {
      setIsLoading(true);
      try {
        const specialData = await getData("special/initial-add");
        const products = await getData("products?sort=-created_at&perPage=10");

        const FieldsFormProduct = [...Fields];
        const categorys = specialData.categories;
        const quantityUnits = specialData.quantityUnits;
        const providers = specialData.providers;
        const brands = specialData.brands;

        const categoriesData = Array.isArray(categorys) ? categorys : [];
        const categoryValues = categoriesData.map((category) => ({
          id: category.id,
          name: category.name,
          isSelected: category.name === "Principal",
        }));

        const categoryField = Array.isArray(FieldsFormProduct)
          ? FieldsFormProduct.find((field) => field.id === "category_id")
          : null;

        if (categoryField) {
          categoryField.values = categoryValues;
        }

        const quantityUnitField = Array.isArray(FieldsFormProduct)
          ? FieldsFormProduct.find((field) => field.id === "quantity_unit_id")
          : null;

        if (quantityUnitField) {
          quantityUnitField.values = Array.isArray(quantityUnits)
            ? quantityUnits.map((unit) => ({
                id: unit.id,
                name: unit.name,
                isSelected: false,
              }))
            : [];
        }

        const providerField = Array.isArray(FieldsFormProduct)
          ? FieldsFormProduct.find((field) => field.id === "provider_id")
          : null;

        if (providerField) {
          providerField.values = Array.isArray(providers)
            ? providers.map((provider) => ({
                id: provider.id,
                name: provider.name,
                isSelected: false,
              }))
            : [];
        }

        const BrandField = Array.isArray(FieldsFormProduct)
          ? FieldsFormProduct.find((field) => field.id === "brand_id")
          : null;

        if (BrandField) {
          BrandField.values = Array.isArray(brands)
            ? brands.map((brand) => ({
                id: brand.id,
                name: brand.name,
                isSelected: false,
              }))
            : [];
        }

        setValue("taxes", 13);
        setFieldsModified(FieldsFormProduct);
        setLastProducts(products);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
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
    if (!data.unit_cost) data.unit_cost = 0;
    if (!data.sale_price) data.sale_price = 0;

    try {
      setIsSending(true);
      const response = await postData(`products`, "POST", data);
      if (!response.message) {
        let newProducts = await getData("products?sort=-created_at&perPage=10");
        toast.success("Producto agregado correctamente");
        setLastProducts(newProducts);
        reset();
        setValue("product_type", 1);
      } else {
        toast.error("Faltan algunos datos importantes!");
      }
      setMessage(response);
      setIsShowCompoundModal(response?.data?.product_type == 3 ? true : false);
    } catch (error) {
      console.error(error);
      toast.error("Ha ocurrido un error!");
    } finally {
      setIsSending(false);
    }
  };

  const getField = (field: any): any => {
    // const styled = field.style === "full" ? "w-full px-3 mb-2" : "w-full md:w-1/2 px-3 mb-2";
    let hiddenFields =
      watch("product_type") == 1
        ? []
        : [
            "category_id",
            "brand_id",
            "provider_id",
            "quantity",
            "minimum_stock",
            "quantity_unit_id",
            "measure",
            "default_discount",
          ];
    if (!brandStatus) hiddenFields.push("brand_id");
    if (!measuresStatus) hiddenFields.push("measure");
    if (!discountStatus) hiddenFields.push("default_discount");

    if (!hiddenFields.includes(field.id)) {
      return (
        <div key={field.id} className={fieldWidth(field.style)}>
          <label htmlFor={field.id} className={style.inputLabel}>
            {field.name}
          </label>
          {field.type === "select" ? (
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
          ) : (
            <input
              type={field.type}
              id={field.id}
              {...register(field.id)}
              className={style.input}
              step="any"
              min={0}
            />
          )}
        </div>
      );
    }
    return null;
  };

  if (isLoading) return (<Loading />)

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 pb-10">
      <div className="col-span-2">
        <ViewTitle text="NUEVO PRODUCTO" links={menu} />

          <div className="w-full px-4">
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

                <input type="hidden" id="taxes" {...register("taxes")} />
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
            </form>
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
            onDelete={() => console.log("Delete")}
          />
        </div>
      </div>

        <ProductCompoundModal
          isShow={isShowCompoundModal}
          product={message.data}
          onClose={() => setIsShowCompoundModal(false)}
        />
      <Toaster position="top-right" reverseOrder={false} />
    </div>
  );
}
