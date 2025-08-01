'use client'

import { useState, useEffect, useContext } from "react";
import { ViewTitle, Alert, Loading } from "@/components";
import { useForm } from "react-hook-form";
import { postData, getData } from "@/services/resources";
import { Button, Preset } from "@/components/button/button";
import toast, { Toaster } from 'react-hot-toast';
import { style } from "@/theme/styles";
import { PresetTheme } from "@/services/enums";
import { Category } from "@/services/products";
import Image from "next/image";
import { URL } from "@/constants";
import { AddImageModal } from "@/components/restaurant/product/add-image-modal";
import { AddCategoriesModal } from "@/components/restaurant/product/add-categories-modal";
import { AddOptionsModal } from "@/components/restaurant/product/add-options-modal";
import { ConfigContext } from "@/contexts/config-context";
import { getCountryProperty } from "@/utils/functions";

export default function Page() {
  const [message, setMessage] = useState<any>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [isShowImagesModal, setIsShowImagesModal] = useState(false);
  const [ selectedImage, setSelectedImage ] = useState("default.png")
  const [showModalCategories, setShowModalCategories] = useState(false);
  const [showModalOptions, setShowModalOptions] = useState(false);
  const [ categories, setCategories ] = useState<Category[]>([])
  const [ options, setOptions ] = useState([])
  const [ workStations, setWorkStations ] = useState([])
  const { register, handleSubmit, reset } = useForm();
  const { systemInformation } = useContext(ConfigContext);

    const loadCategories = async () => {
        try {
          const cat = await getData(`categories?sort=created_at&filterWhere[category_type]==2&filterWhere[is_restaurant]==1`);
          setCategories(cat.data);
        } catch (error) {
            console.error(error);
        }
    };

    const loadOptions = async () => {
        try {
          const opt = await getData(`restaurant/options`);
          setOptions(opt.data);
        } catch (error) {
            console.error(error);
        }
    };

    const loadWorkStations = async () => {
        try {
          const work = await getData(`restaurant/workstations?filterWhere[status]==1`);
          setWorkStations(work.data);
        } catch (error) {
            console.error(error);
        }
    };




    useEffect(() => {
          const loadData = async () => {
                setIsLoading(true);
                try {
                  await Promise.all([
                    loadCategories(),
                    loadOptions(),
                    loadWorkStations()
                  ]);
                } catch (error) {
                  console.error(error);
                } finally {
                  setIsLoading(false);
                }                 
          };
          loadData();
        // eslint-disable-next-line
    }, []);

  const onSubmit = async (data: any) => {

    data.minimum_stock = 1;
    data.product_type = 3;
    data.image = selectedImage;
    data.taxes = getCountryProperty(parseInt(systemInformation?.system?.country)).taxes;
    data.is_restaurant = 1;
    data.quantity = 1;

    if (data.work_station_id == "1" || !data.work_station_id) {
      data.work_station_id = null
    }
    if (!Array.isArray(data.options)) {
      data.options = data.options ? [data.options] : null;
    }

    try {
      setIsSending(true)
      const response = await postData(`restaurant/products`, "POST", data);
      if (response.type == "successful") {
        toast.success("Producto agregado correctamente");
        setMessage({});
        reset();
      } else {
        toast.error("Faltan algunos datos importantes!");
        setMessage(response);
      }
    } catch (error) {
      console.error(error);
      toast.error("Ha ocurrido un error!");
    } finally {
      setIsSending(false)
    }
  };

  const imageLoader = ({ src, width, quality }: any) => {
    return `${URL}/images/ico/${src}?w=${width}&q=${quality || 75}`
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-10 pb-10">
        <div className="col-span-7 border-r md:border-sky-600">
        <ViewTitle text="NUEVO PRODUCTO" />
        <div className="w-full p-4">
            { isLoading ? <Loading text="Transformando" /> :
              <form onSubmit={handleSubmit(onSubmit)} className="w-full">
  
              <div className="flex flex-wrap -mx-3 mb-6">

              <div className="w-full px-3 mb-2">
                <label htmlFor="description" className={style.inputLabel}>Nombre del producto</label>
                <input type="text" id="description" {...register("description")} className={style.input} />
              </div>

              <div className="w-full md:w-1/3 px-3 mb-4">
                <label htmlFor="unit_cost" className={style.inputLabel}>Precio de costo</label>
                <input type="number" id="unit_cost" {...register("unit_cost")} className={style.input} step="any" />
              </div>

              <div className="w-full md:w-1/3 px-3 mb-4">
                <label htmlFor="sale_price" className={style.inputLabel}>Precio de venta</label>
                <input type="number" id="sale_price" {...register("sale_price")} className={style.input} step="any" />
              </div>


              <div className="w-full md:w-1/3 px-3 mb-2">
                <label htmlFor="category_id" className={`${style.inputLabel} clickeable`} onClick={() => setShowModalCategories(true)}>Categoria (Click para agregar)</label>
                {categories && categories.length > 0 ? 
                <select defaultValue={categories[0] ? categories[0].id : []} id="category_id" {...register("category_id")} className={style.input} >
                  {categories?.map((value: any) => {
                    return ( <option key={value.id} value={value.id}> {value.name} </option> );
                  })}
                </select> :
                <div className={style.input}></div>
                }
              </div>

               {options?.length > 0 ?  
              <div className="w-full md:w-1/3 px-3 mb-4">
                <label htmlFor="options" className={`${style.inputLabel} clickeable`} onClick={() => setShowModalOptions(true)}>Modificadores (Click para agregar)</label>
                {options?.map((value: any) => {
                  return ( 
                    <div key={value.id} className="flex items-center gap-2 uppercase mt-2">
                      <input type="checkbox" {...register("options")} value={value.id} />
                      <label htmlFor="prescription" className={style.inputLabel} >{ value.name }</label>
                    </div>
                     );
                    })}
              </div> :
              <div className="w-full md:w-1/3 px-3 mb-4">
                <label htmlFor="sale_price" className={style.inputLabel}>Modificadores</label>
                <div className={`${style.input} h-10`} >Sin Modificadores</div>
              </div>}

              {workStations?.length > 0 ?
              <div className="w-full md:w-1/3 px-3 mb-4">
                <label htmlFor="work_station_id" className={style.inputLabel}>Espacio de trabajo</label>
                  <select id="work_station_id" defaultValue={1} {...register("work_station_id")} className={style.input} >
                    <option value={1}> Ninguno </option>
                  {workStations?.map((value: any) => {
                    return ( <option key={value.id} value={value.id}> {value.name} </option> );
                  })}
                </select>
              </div> :
              <div className="w-full md:w-1/3 px-3 mb-4">
                <label htmlFor="sale_price" className={style.inputLabel}>Espacio de trabajo</label>
                <div className={`${style.input} h-10`} >No existen espacios de trabajo</div>
              </div>}

              <div className="w-full md:w-1/3 px-3 mb-4">
                <label className={style.inputLabel}>Seleccionar Imagen</label>
                <div className="w-full clickeable" onClick={()=>setIsShowImagesModal(true)}>
                <Image loader={imageLoader} src={selectedImage} alt="Icono de imagen" width={96} height={96} className="drop-shadow-lg rounded-md" />
                </div>
              </div>


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
        <div className="col-span-3">
        {/* <ViewTitle text="ULTIMOS PRODUCTOS" /> */}

        </div>
        <AddCategoriesModal isShow={showModalCategories} onClose={() => setShowModalCategories(false)} reload={loadCategories} />
        <AddOptionsModal isShow={showModalOptions} onClose={() => setShowModalOptions(false)} reload={loadOptions} />
        <AddImageModal isShow={isShowImagesModal} onClose={()=> setIsShowImagesModal(false)} selectedImage={setSelectedImage} />
      <Toaster position="top-right" reverseOrder={false} />
    </div>
  )
}
