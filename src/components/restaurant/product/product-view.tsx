"use client";
import { useContext, useState } from "react";
import { Tooltip } from "flowbite-react";

import Image from "next/image";
import { URL } from "@/constants";
import { numberToMoney } from "@/utils/functions";
import { GiHamburgerMenu } from "react-icons/gi";
import { MdDelete, MdOutlinePriceCheck, MdOutlineProductionQuantityLimits } from "react-icons/md";
import { IoMdCloseCircleOutline, IoMdOptions } from "react-icons/io";
import { FaCheckCircle, FaImages, FaSolarPanel, FaStar } from "react-icons/fa";
import { BiCategory, BiRename } from "react-icons/bi";
import { useIsOpen } from "@/hooks/useIsOpen";
import { DeleteModal } from "@/components/modals/delete-modal";
import { Product } from "@/services/products";
import { postData } from "@/services/resources";
import toast, { Toaster } from 'react-hot-toast';
import { ProductUpdateModal } from "./product-update-modal";
import { ProductCategoryUpdateModal } from "./product-category-update-modal";
import { ProductModifierUpdateModal } from "./product-modifier-update-modal";
import { ProductPanelUpdateModal } from "./product-panel-update-modal";
import { AddImageModal } from "./add-image-modal";
import { Loading } from "@/components/loading/loading";
import { ConfigContext } from "@/contexts/config-context";
import { ProductLinkedModal } from "@/components/products-components/product-add-linked-modal";



export interface ProductViewProps {
  products?: any;
  isLoading: boolean;
  random: (value: number) => void;
}

export function ProductView(props: ProductViewProps) {
  const { products, random, isLoading } = props;
  const modalUpdate = useIsOpen(false);
  const modalModif = useIsOpen(false);
  const modalCategory = useIsOpen(false);
  const modalPanel = useIsOpen(false);
  const modalDelete = useIsOpen(false);
  const modalImg = useIsOpen(false);
  const modalProd = useIsOpen(false);
  const [selectProduct, setSelectProduct] = useState<Product>({} as Product);
  const [dataUpdate, setDataUpdate] = useState({});
  const { systemInformation } = useContext(ConfigContext);

  if (!products) return <></>;


  const imageLoader = ({ src, width, quality }: any) => {
    return `${URL}/images/ico/${src}?w=${width}&q=${quality || 75}`
  }

  const isDeleteProduct = (product:Product) => {
    setSelectProduct(product);
    modalDelete.setIsOpen(true);
  }

  const handleDeleteProduct = () => {
    modalDelete.setIsOpen(false);
    deleteProduct(selectProduct.id);
    setSelectProduct({} as Product);
  }

  const deleteProduct = async (iden: number) => {
    try {
      const response = await postData(`restaurant/products/${iden}`, 'DELETE');
      if (response.type == "successful") {
          toast.success(response.message);
          random && random(Math.random());
      } else {
        toast.error(response.message)
      }
    } catch (error) {
      console.error(error);
      toast.error("Ha ocurrido un error!");
    } 
  }

  const updateStatus = async (iden: number, status: number) => {
    try {
      const response = await postData(`restaurant/products/status/${iden}`, 'PUT', { status: status == 0 ? 1 : 0 });
      if (response.type == "successful") {
        toast.success(response.message);
        random && random(Math.random());
    } else {
      toast.error(response.message)
    }
    } catch (error) {
      console.error(error);
      toast.error("Ha ocurrido un error!");
    } 
  }


  const handleUpdate =  (product:Product, data: any) => {
    setSelectProduct(product);
    setDataUpdate(data)

    switch (data.field) {
        case "category_id":
            modalCategory.setIsOpen(true);
            break;
            case "work_station_id":
            modalPanel.setIsOpen(true);
            break;
            case "assigments":
            modalModif.setIsOpen(true);
            break;  
        default:
            modalUpdate.setIsOpen(true);
            break;
    }
  }


  const updateProduct = async (data: any) => {
    try {
        const response = await postData(`restaurant/products/${selectProduct.id}`, 'PUT', data);
        if (response.type == "successful") {
          toast.success(response.message);
          random && random(Math.random());
      } else {
        toast.error(response.message)
      }
      } catch (error) {
        console.error(error);
        toast.error("Ha ocurrido un error!");
      } 
  }

  const handleChangeImage = async (image: string)=>{
        await updateProduct({ field: "image", data: image })
    }
  

    const updateSpecial = async (order: any, data: any) => {
      console.log(order)
      try {
          const response = await postData(`restaurant/products/${order.id}`, 'PUT', data);
          if (response.type == "successful") {
            toast.success(response.message);
            random && random(Math.random());
        } else {
          toast.error(response.message)
        }
        } catch (error) {
          console.error(error);
          toast.error("Ha ocurrido un error!");
        } 
    }

  const listItems = products.map((record: any) => (
    <tr key={record.id} className={`border-b ${isLoading && selectProduct == record && 'animate-pulse'}`}>
      <td className="py-2 px-6"><Image loader={imageLoader} src={record?.restaurant?.image} alt="Icono de imagen" width={70} height={70} className="drop-shadow-lg rounded-md" /></td>
      <th className="py-2 px-6 text-gray-900 whitespace-nowrap dark:text-white uppercase" scope="row">
       <div className="flex"> 
          <span>{ record?.description }</span> 
          <span className="mt-1 ml-2">{record.menu_order?.special === 1 && <FaStar size={8} color="#009eff" /> }</span>
        </div>
        { record.menu_order?.status === 0 && <div className="uppercase text-red-700">Inhabilitado</div> }
        </th>
      <td className="py-2 px-6">
        { record?.category?.name}
      </td>
      <td className="py-2 px-6">
        { record?.assigments.map((assigment: any)=> <li key={assigment.id}>{assigment.option?.name}</li>) }
      </td>
      <td className="py-2 px-6">{record?.restaurant?.workstation?.name}</td>
      <td className="py-2 px-6">{record?.prices ? numberToMoney(record?.prices[0]?.price, systemInformation) : numberToMoney(0, systemInformation)}</td>
      <td className="py-2 px-6">
        <Tooltip animation="duration-300" content={
                <div className="w-8/10">
                    <div onClick={()=>{ handleUpdate(record, { field : "sale_price", type : "number", text : "Cambiar Precio" }); }} className='flex justify-items-start w-full font-semibold text-slate-700 py-2 px-4 hover:bg-slate-100 clickeable'>
                        <span className="mt-1"><MdOutlinePriceCheck /></span> 
                        <span className="ml-2">Cambiar Precio</span> 
                    </div>
                    <div onClick={()=>{ handleUpdate(record, { field : "description", type : "text", text : "Cambiar Nombre" }); }} className='flex justify-items-start w-full font-semibold text-slate-700 py-2 px-4 hover:bg-slate-100 clickeable'>
                        <span className="mt-1"><BiRename /></span> 
                        <span className="ml-2">Cambiar Nombre</span> 
                    </div>
                    <div onClick={()=>{ handleUpdate(record, { field : "assigments", "assigments": record.assigments, text : "Cambiar Modificadores", "product": record.id }); }} className='flex justify-items-start w-full font-semibold text-slate-700 py-2 px-4 hover:bg-slate-100 clickeable'>
                        <span className="mt-1"><IoMdOptions /></span> 
                        <span className="ml-2">Cambiar Modificadores</span> 
                    </div>
                    <div onClick={()=>{ handleUpdate(record, { field : "category_id", "selected": record.category_id, text : "Cambiar Categoría" }); }} className='flex justify-items-start w-full font-semibold text-slate-700 py-2 px-4 hover:bg-slate-100 clickeable'>
                        <span className="mt-1"><BiCategory /></span> 
                        <span className="ml-2">Cambiar Categorias</span> 
                    </div>
                    <div onClick={()=>{ handleUpdate(record, { field : "work_station_id", "selected": record.work_station_id, text : "Cambiar Panel" }); }} className='flex justify-items-start w-full font-semibold text-slate-700 py-2 px-4 hover:bg-slate-100 clickeable'>
                        <span className="mt-1"><FaSolarPanel /></span> 
                        <span className="ml-2">Cambiar Panel</span> 
                    </div>
                    <div onClick={()=> {modalImg.setIsOpen(true); setSelectProduct(record) }} className='flex justify-items-start w-full font-semibold text-slate-700 py-2 px-4 hover:bg-slate-100 clickeable'>
                        <span className="mt-1"><FaImages /></span> 
                        <span className="ml-2">Cambiar Imagen</span> 
                    </div>
                    <div onClick={()=> {modalProd.setIsOpen(true); setSelectProduct(record) }} className='flex justify-items-start w-full font-semibold text-slate-700 py-2 px-4 hover:bg-slate-100 clickeable'>
                        <span className="mt-1"><MdOutlineProductionQuantityLimits /></span> 
                        <span className="ml-2">Productos a descontar </span> 
                    </div>
                    <div onClick={()=>{ updateSpecial(record, { field: "special", data: record.menu_order?.special == 0 ? 1 : 0 }) }} className={`flex justify-items-start w-full font-semibold clickeable ${record.menu_order?.special === 0 ? 'text-slate-700 py-2 px-4 hover:bg-slate-100' : 'text-red-700 py-2 px-4 hover:bg-red-100'}`}>
                        <span className="mt-1">{record.menu_order?.special == 0 ? <FaCheckCircle color="green" /> : <IoMdCloseCircleOutline /> }</span> 
                        <span className="ml-2">{record.menu_order?.special == 0 ? 'Mostrar Producto' : 'Ocultar Producto'}</span> 
                    </div>
                    <div onClick={()=>updateStatus(record.id, record.menu_order?.status)} className={`flex justify-items-start w-full font-semibold clickeable ${record.menu_order?.status === 0 ? 'text-slate-700 py-2 px-4 hover:bg-slate-100' : 'text-red-700 py-2 px-4 hover:bg-red-100'}`}>
                        <span className="mt-1">{record.menu_order?.status === 0 ? <FaCheckCircle color="green" /> : <IoMdCloseCircleOutline /> }</span> 
                        <span className="ml-2">{record.menu_order?.status === 0 ? 'Habilitar Producto' : 'Inhabilitar Producto'}</span> 
                    </div>
                    <div onClick={()=>isDeleteProduct(record)} className='flex justify-items-start w-full font-semibold text-red-700 py-2 px-4 hover:bg-red-100 clickeable'>
                        <span className="mt-1"><MdDelete /></span> 
                        <span className="ml-2">Eliminar Producto</span> 
                    </div>
                </div>
              } style="light" >
           <GiHamburgerMenu size={24} color="black" />
        </Tooltip>
        
      </td>
    </tr>
  ));

  return (
    <div className="w-full overflow-auto">
      { isLoading && !selectProduct ? <Loading /> :
      <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            <th scope="col" className="py-3 px-4 border">Imagen</th>
            <th scope="col" className="py-3 px-4 border">Nombre</th>
            <th scope="col" className="py-3 px-4 border">Categoria</th>
            <th scope="col" className="py-3 px-4 border">Modificadores</th>
            <th scope="col" className="py-3 px-4 border">Panel</th>
            <th scope="col" className="py-3 px-4 border">Precio</th>
            <th scope="col" className="py-3 px-4 border">OP</th>
          </tr>
        </thead>
        <tbody>{ listItems }</tbody>
      </table> 
      }

    <DeleteModal isShow={modalDelete.isOpen}
        text="¿Está seguro de eliminar este producto?"
        onDelete={handleDeleteProduct}  
        onClose={()=>modalDelete.setIsOpen(false)} />
      <Toaster position="top-right" reverseOrder={false} />
      <ProductUpdateModal isShow={modalUpdate.isOpen} onClose={()=>modalUpdate.setIsOpen(false)} dataInit={dataUpdate} onSubmit={updateProduct} />
      <ProductCategoryUpdateModal isShow={modalCategory.isOpen} onClose={()=>modalCategory.setIsOpen(false)} dataInit={dataUpdate} onSubmit={updateProduct} />
      <ProductPanelUpdateModal isShow={modalPanel.isOpen} onClose={()=>modalPanel.setIsOpen(false)} dataInit={dataUpdate} onSubmit={updateProduct} />
      <ProductModifierUpdateModal isShow={modalModif.isOpen} onClose={()=>modalModif.setIsOpen(false)} dataInit={dataUpdate} random={random} />
      <AddImageModal isShow={modalImg.isOpen} onClose={()=> modalImg.setIsOpen(false)} selectedImage={handleChangeImage} />
      <ProductLinkedModal isShow={modalProd.isOpen} product={selectProduct} onClose={()=>modalProd.setIsOpen(false)} />

 </div>
  );

}
