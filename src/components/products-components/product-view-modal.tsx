'use client'
import React, { useState } from "react";
import { Product } from "@/services/products";
import { Dropdown, Modal, Tooltip, Button as Boton } from "flowbite-react";
import { Button, Preset } from "../button/button"
import {  GrEdit, GrAction, GrAdd } from "react-icons/gr";
import { FaEdit } from "react-icons/fa";
import { AiFillInfoCircle } from "react-icons/ai";
import { ProductUpdateModal } from "./product-update-modal";
import { ProductPrecioMultipleModal } from "./product-price-multiple-modal";
import { ProductImageModal } from "./product-image-modal";
import { ProductDetails } from "./product-details";

export interface ProductViewModalProps {
  onClose: () => void;
  product?: Product;
  editable?: boolean;
  isShow?: boolean;
}

export function ProductViewModal(props: ProductViewModalProps) {
  const { onClose, product, editable = false, isShow } = props;
  const [showModalEdit, setShowModalEdit] = useState(false)
  const [showModalPrices, setShowModalPrices] = useState(false)
  const [field, setField] = useState("")
  const [type, setType] = useState("")
  const [text, setText] = useState("")
  const [isShowImagesModal, setIsShowImagesModal] = useState(false);

  const getEdit = (fieldAsign: string, typeAsign: string, textAsign: string): void=>{
    setField(fieldAsign)
    setType(typeAsign)
    setText(textAsign)
    setShowModalEdit(true)
  }


  return (
    <Modal show={isShow} position="center" onClose={onClose}>
      <Modal.Header>Detalles del Producto</Modal.Header>
      <Modal.Body>
        
        <ProductDetails product={product} isShow={isShow} state={!isShowImagesModal} />

        <ProductUpdateModal product={product} field={field} type={type} text={text} onClose={()=> setShowModalEdit(false)} isShow={showModalEdit} />
        <ProductPrecioMultipleModal isShow={showModalPrices} product={product} onClose={()=> setShowModalPrices(false)} />
        <ProductImageModal isShow={isShowImagesModal} product={product} onClose={()=>setIsShowImagesModal(false)} />
        

      </Modal.Body>
      <Modal.Footer className="flex justify-end gap-4">
        { editable && <Dropdown label={<FaEdit size="1.2em" />} inline={true} dismissOnClick={true}>
          {/* <Dropdown.Item><Link href={`/product/edit/${product?.id}`}>EDITAR PRODUCTO</Link></Dropdown.Item> */}
          <Dropdown.Item icon={GrEdit} onClick={()=>getEdit("description", "text", "Cambiar Nombre")}>Cambiar Nombre</Dropdown.Item>    
          { product?.product_type === 1 && <Dropdown.Item icon={GrAction} onClick={()=>getEdit("minimum_stock", "number", "Cambiar Minimo en Stock")}>Minimo de Stock</Dropdown.Item>}
          <Dropdown.Item icon={GrAdd} onClick={()=>setShowModalPrices(true)}>Agregar Precios</Dropdown.Item>
          <Dropdown.Item icon={GrAdd} onClick={()=>setIsShowImagesModal(true)}>Agregar Imagenes</Dropdown.Item>
          <Dropdown.Item icon={AiFillInfoCircle} onClick={()=>getEdit("information", "text", "Agregar información adicional")}>Información </Dropdown.Item>
        </Dropdown>}
        <Button onClick={onClose} preset={Preset.close} />
      </Modal.Footer>
    </Modal>
  );
}
