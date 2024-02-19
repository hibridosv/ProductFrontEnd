'use client'
import { useState, useEffect, useContext } from "react";
import { ViewTitle, Alert, Loading } from "@/components";
import { useForm } from "react-hook-form";
import { FieldsFormProduct as Fields } from "@/constants/form-product-json";
import { postData, getData } from "@/services/resources";
import { Button, Preset } from "@/components/button/button";
import toast, { Toaster } from 'react-hot-toast';

import { ConfigContext } from "@/contexts/config-context";
import { style } from "@/theme/styles";
import { MultiPrice } from "@/components/products-components/multi-price";
import { ProductLinkedModal } from "@/components/products-components/product-add-linked-modal";
import { ListImagesOfProducts } from "@/components/products-components/list-images";
import { ProductImageModal } from "@/components/products-components/product-image-modal";
import { FaEdit } from "react-icons/fa";
import { SearchInput } from "@/components/form/search";
import { useSearchTerm } from "@/hooks/useSearchTerm";
import { PresetTheme } from "@/services/enums";
import { transformFields } from "@/utils/functions";
import { AddCategoriesModal } from "@/components/modals/add-categories-modal";


  export default function GetProduct() {
    const [message, setMessage] = useState<any>({});
    const [fieldsModified, setFieldsModified] = useState<any>(Fields);
    const [selectedProduct, setSelectedProdcut] = useState<any>({});
    const [isLoading, setIsLoading] = useState(false);
    const {config } = useContext(ConfigContext);
    const [brandStatus, setBrandStatus] = useState<boolean>(false)
    const [measuresStatus, setMeasuresStatus] = useState<boolean>(false)
    const [discountStatus, setDiscountStatus] = useState<boolean>(false)
    const [commissionStatus, setCommissionStatus] = useState<boolean>(false);
    const [prescriptionStatus, setPrescriptionStatus] = useState<boolean>(false)
    const [isSending, setIsSending] = useState(false);
    const [isShowLinkedModal, setIsShowLinkedModal] = useState(false);
    const [isShowImagesModal, setIsShowImagesModal] = useState(false);
    const { searchTerm, handleSearchTerm } = useSearchTerm(["cod", "description"], 500);
    const [products, setProducts] = useState([]);
    const [productSelected, setProductSelected] = useState(null);
    const [showModalCategories, setShowModalCategories] = useState(false);

    
    const loadData = async () => {
      try {
        const response = await getData(`products?sort=-created_at${searchTerm}`);
        setProducts(response.data);
      } catch (error) {
        console.error(error);
      }
  };
    

  useEffect(() => {
      if (searchTerm) {
          (async () => { await loadData() })();
      }
    // eslint-disable-next-line
  }, [searchTerm]);
  
  
    const { register, handleSubmit, reset, watch, setValue } = useForm();
  
    useEffect(() => {
      setBrandStatus(getConfigStatus("product-brand"))
      setMeasuresStatus(getConfigStatus("product-measures"))
      setPrescriptionStatus(getConfigStatus("product-prescription"))
      setDiscountStatus(getConfigStatus("product-default-discount"))
      setCommissionStatus(getConfigStatus("product-default-commission"));
    // eslint-disable-next-line
    }, [config])
  
    const getConfigStatus = (feature: string)=>{
      if (config?.configurations) {
       return config.configurations.find((configuration: any) => configuration.feature === feature)?.active === 1
      }
      return false
    }
    
    useEffect(() => {
      if (productSelected && showModalCategories === false) {
        
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
    }, [productSelected, showModalCategories]);


    useEffect(() => {
      if (productSelected) {
      (async () => {
          const product = await getData(`products/${productSelected}`);       
          setSelectedProdcut(product)
      })();
    }
      // eslint-disable-next-line
    }, [productSelected]);


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
      setValue("default_commission", selectedProduct?.data?.default_commission)
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

      try {
        setIsSending(true)
        const response = await postData(`products/${productSelected}`, "PUT", data);
        setMessage(response);
        if (!response.message) {
          setSelectedProdcut(response)
          toast.success( "Producto actualizado correctamente");
        } else {
          toast.error("Faltan algunos datos importantes!");
        }
        
      } catch (error) {
        console.error(error);
        toast.error("Ha ocurrido un error!");
      } finally{
        setIsSending(false)
      }
    };

  const handleNewProduct = () => {
    setProductSelected(null)
    setProducts([])
  }

  const listItems = products?.map((product: any):any => (
    <div key={product.id} onClick={()=>setProductSelected(product.id)}>
    <li className="flex justify-between p-3 hover:bg-blue-200 hover:text-blue-800 cursor-pointer">
    {product.cod} | {product.description}
        <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24"
            stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
        </svg>
    </li>
</div>
  ))

    return (
      <div className="grid grid-cols-1 md:grid-cols-4 pb-10">
        {productSelected ? <>
        <div className="col-span-2 border-r-2">
          <ViewTitle text="ACTUALIZAR PRODUCTO" />

            <div className="w-full p-4">
            { isLoading ? <Loading text="Transformando" /> :
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
                <label htmlFor="category_id" className={`${style.inputLabel} clickeable`} onClick={() => setShowModalCategories(true)}>Categoria (Click para agregar)</label>
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

              { (selectedProduct?.data?.product_type == 1 && commissionStatus) && (<div className="w-full md:w-1/3 px-3 mb-4">
                <label htmlFor="default_commission" className={style.inputLabel}>Comisión por Defecto %</label>
                <input type="number" step="any" id="default_commission" {...register("default_commission")} className={style.input} />
              </div>)}

              { (selectedProduct?.data?.product_type == 1 && prescriptionStatus) && (<div className="w-full md:w-1/3 px-3 mb-4">
              <label htmlFor="prescription" className={style.inputLabel} >Solicitar Receta </label>
              <input type="checkbox" placeholder="prescription" {...register("prescription", {})} />
              </div>)}

              <div className="w-full md:w-full px-3 mb-4">
              <label htmlFor="information" className={style.inputLabel} >Información </label>
              <textarea {...register("information", {})} rows={2} className={`${style.input} w-full`} />
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

        
          <div className="w-full p-4 border-l-2">
            <div>
            {selectedProduct?.data?.product_type != 1 && (
              <div className="w-full px-3 mb-2">
                
                <Alert
                  theme={selectedProduct?.data?.product_type === 2 ? PresetTheme.success : PresetTheme.info}
                  info="Información:"
                  text={`Este elemento se ha registrado como un ${selectedProduct?.data?.product_type === 2 ? "servicio": "producto relacionando"}`  }
                  isDismisible={false}
                />
              </div>
            )}
            { selectedProduct?.data ? <MultiPrice product={selectedProduct?.data} /> : <Loading /> }

            {(selectedProduct?.data?.product_type === 3) && (<div className="w-full px-4 py-2 bg-white">
              <Button onClick={()=>setIsShowLinkedModal(true)} text="VER PRODUCTOS ASIGNADOS" preset={Preset.primary}  isFull />
            </div>)}

          </div>

          <div className='flex justify-center text-2xl text-cyan-600'>
            <span className='mr-3 pb-2'>Imagenes Agregadas </span>
            <FaEdit className='cursor-pointer' onClick={()=>setIsShowImagesModal(true)} />
          </div>
          <ListImagesOfProducts productId={selectedProduct?.data?.id} state={isShowImagesModal} />

          <ProductLinkedModal isShow={isShowLinkedModal} product={selectedProduct?.data} onClose={()=>setIsShowLinkedModal(false)} />
          { isShowImagesModal && <ProductImageModal product={selectedProduct?.data} onClose={()=>setIsShowImagesModal(false)} />}

            <div className="mt-4">
              <Button text='Nueva busqueda' isFull type="submit" preset={Preset.cancel} onClick={()=>handleNewProduct()} />
            </div>
          </div>
        </div>
        </> :
          <div className="col-span-3 m-4">
            <ViewTitle text="EDITAR PRODUCTO"  />
            <SearchInput handleSearchTerm={handleSearchTerm} placeholder="Buscar Producto" />
            <div className="w-full bg-white rounded-lg shadow-lg lg:w-2/3 mt-4">
              <ul className="divide-y-2 divide-gray-400">
              { listItems }
              </ul>
            </div>
          </div>
            }
        <AddCategoriesModal isShow={showModalCategories} onClose={() => setShowModalCategories(false)} />
      <Toaster position="top-right" reverseOrder={false} />
      </div>
    );
  }