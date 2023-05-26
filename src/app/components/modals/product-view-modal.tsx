'use client'
import { useState } from "react";
import { Product } from "@/services/products";
import { Dropdown, Modal } from "flowbite-react";
import { Button, Preset } from "../button/button"
import { numberToMoney } from "@/utils/functions";
import {  GrEdit, GrAction, GrAdd } from "react-icons/gr";
import { FaEdit } from "react-icons/fa";
import { ProductUpdateModal } from "./product-chage-name-modal";

export interface ProductViewModalProps {
  onClose: () => void;
  product?: Product;
  editable?: boolean;
}

export function ProductViewModal(props: ProductViewModalProps) {
  const { onClose, product, editable = false } = props;
  const [showModalEdit, setShowModalEdit] = useState(false)
  const [field, setField] = useState("")
  const [type, setType] = useState("")
  const [text, setText] = useState("")

  const getEdit = (fieldAsign: string, typeAsign: string, textAsign: string): void=>{
    setField(fieldAsign)
    setType(typeAsign)
    setText(textAsign)
    setShowModalEdit(true)
  }

  return (
    <Modal show={true} position="center" onClose={onClose}>
      <Modal.Header>Detalles del Producto</Modal.Header>
      <Modal.Body>
        <div className="mx-4">
          <h3 className="text-2xl">{product?.description}</h3>

          <div className="flex justify-center my-4">
            <div className="px-4 pb-4 pt-2 mx-3 border-4 rounded-lg border-cyan-700">
              Cantidad
              <div className="text-4xl flex justify-center">
                {product?.quantity}
              </div>
            </div>
            <div className="px-4 pb-4 pt-2 mx-3 border-4 rounded-lg border-cyan-700  text-blue-700">
              Precio Unidad
              <div className="text-4xl flex justify-center">
                {product?.prices && product.prices.length > 0 ? numberToMoney(product.prices[0].price) : numberToMoney(0)}
              </div>
            </div>
            <div className="px-4 pb-4 pt-2 mx-3 border-4 rounded-lg border-cyan-700">
              Min Stock
              <div className="text-4xl flex justify-center">
                {product?.minimum_stock}
              </div>
            </div>
          </div>
          {/* listado de cosas  */}

          <div className="max-w-2xl overflow-hidden bg-white shadow sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6">
              <h3 className="text-lg font-medium leading-6 text-gray-900">
                Detalles e información del producto
              </h3>
            </div>
            <div className="border-t border-gray-200">
              <dl>
                <div className="px-4 py-3 bg-gray-50 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Codigo</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {product?.cod}
                  </dd>
                </div>
                <div className="px-4 py-3 bg-white sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">
                    Categoria
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {product?.category?.name}
                  </dd>
                </div>
                <div className="px-4 py-3 bg-gray-50 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">
                    Proveedor
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {product?.provider?.name}
                  </dd>
                </div>
                <div className="px-4 py-3 bg-white sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Marca</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {product?.brand?.name}
                  </dd>
                </div>
                <div className="px-4 py-3 bg-white sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Expira</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {product?.expires ? <div className="text-base	text-red-600	">Con fecha de vencimiento</div> : <div className="text-base	text-blue-600	">Sin fecha de vencimiento</div>}
                  </dd>
                </div>
                <div className="px-4 py-3 bg-gray-50 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">
                    Información
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {product?.information}
                  </dd>
                </div>
              </dl>
            </div>
          </div>

          {/* Modales  */}
          { showModalEdit && <ProductUpdateModal product={product} field={field} type={type} text={text} onClose={()=> setShowModalEdit(false)} />}
          
        </div>
      </Modal.Body>
      <Modal.Footer className="flex justify-end gap-4">
        { editable && <Dropdown label={<FaEdit size="1.2em" />} inline={true} >
          <Dropdown.Item>EDITAR PRODUCTO</Dropdown.Item>
          <Dropdown.Item icon={GrEdit} onClick={()=>getEdit("description", "text", "Cambiar Nombre")}>Cambiar Nombre</Dropdown.Item>
          <Dropdown.Item icon={GrAction} onClick={()=>getEdit("minimum_stock", "number", "Cambiar Minimo en Stock")}>Minimo de Stock</Dropdown.Item>
          <Dropdown.Item icon={GrAdd} onClick={()=>getEdit("information", "text", "Agregar información adicional")}>Información </Dropdown.Item>
          {/* <Dropdown.Item icon={GrClose} ><span className="text-red-700">Eliminar</span></Dropdown.Item> */}
        </Dropdown>}
        <Button onClick={onClose} preset={Preset.close} />
      </Modal.Footer>
    </Modal>
  );
}
