'use client'
import { useState } from "react";
import { Product, Price } from "@/services/products";
import { Dropdown, Modal, Tooltip, Button as Boton } from "flowbite-react";
import { Button, Preset } from "../button/button"
import { numberToMoney } from "@/utils/functions";
import {  GrEdit, GrAction, GrAdd } from "react-icons/gr";
import { FaEdit } from "react-icons/fa";
import { AiFillInfoCircle } from "react-icons/ai";
import { ProductUpdateModal } from "./product-update-modal";
import { Alert } from "../alert/alert";
import { ProductPrecioMultipleModal } from "./product-price-multiple-modal";
import Link from "next/link";
import { ProductCompoundModal } from "./product-add-compound-modal";

export interface ProductViewModalProps {
  onClose: () => void;
  product?: Product;
  editable?: boolean;
}

export function ProductViewModal(props: ProductViewModalProps) {
  const { onClose, product, editable = false } = props;
  const [showModalEdit, setShowModalEdit] = useState(false)
  const [showModalPrices, setShowModalPrices] = useState(false)
  const [field, setField] = useState("")
  const [type, setType] = useState("")
  const [text, setText] = useState("")
  const [isShowCompoundModal, setIsShowCompoundModal] = useState(false);

  const getEdit = (fieldAsign: string, typeAsign: string, textAsign: string): void=>{
    setField(fieldAsign)
    setType(typeAsign)
    setText(textAsign)
    setShowModalEdit(true)
  }


  const listItems = product?.prices?.map((price: Price):any => (
    <div key={price.id} className="w-full flex justify-center border-2">
      <div className="m-2">{price.qty }</div>
      <div className="m-1">=</div>
      <div className="m-2">{ numberToMoney(price.price)}</div>
      <div className="m-1">{price.price_type == 1 && "N"} {price.price_type == 2 && "M"} {price.price_type == 3 && "P"}</div>
    </div>
  ));

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

              <Tooltip
                animation="duration-300"
                content={listItems}
              >
            <div className="px-4 pb-4 pt-2 mx-3 border-4 rounded-lg border-cyan-700  text-blue-700">
              Precio Unidad
              <div className="text-4xl flex justify-center">
                {product?.prices && product.prices.length > 0 ? numberToMoney(product.prices[0].price) : numberToMoney(0)}
              </div>
              </div>
              </Tooltip>

            
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
                {product?.product_type === 1 && (<div className="px-4 py-3 bg-white sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">
                    Categoria
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {product?.category?.name}
                  </dd>
                </div>) }
                {product?.product_type === 1 && (<div className="px-4 py-2 bg-gray-50 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">
                    Proveedor
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {product?.provider?.name}
                  </dd>
                </div>) }
                {(product?.product_type === 1 && product?.default_discount) && (<div className="px-4 py-2 bg-white sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Descuento establecido</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {product?.default_discount} %
                  </dd>
                </div>)}

                {(product?.product_type === 1 && product?.prescription == true) && 
                (
                <div className="px-4 py-2 bg-white sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Receta</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    <div className="text-base	text-red-600	">ESTE PRODUCTO REQUIERE RECETA</div>
                  </dd>
                </div>)}
                
                <div className="px-4 py-2 bg-white sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Expira</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {product?.expires ? <div className="text-base	text-red-600	">CON FECHA DE VENCIMIENTO</div> : <div className="text-base	text-blue-600	">SIN FECHA DE VENCIMIENTO</div>}
                  </dd>
                </div>

                {product?.information && (<div className="px-4 py-2 bg-gray-50 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">
                    Información
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {product?.information}
                  </dd>
                </div>)}
                <div className="flex flex-wrap">
                {(product?.product_type === 1 && product?.brand?.name) && (<div className="w-full md:w-1/2 px-4 py-2 bg-white sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Marca</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {product?.brand?.name}
                  </dd>
                </div>)}
                {(product?.product_type === 1 && product?.measure) && (<div className="w-full md:w-1/2 px-4 py-2 bg-white sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Medidas</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {product?.measure}
                  </dd>
                </div>)}
                </div>
              </dl>
            </div>
          </div>

          {product?.product_type != 1 && (
              <div className="mt-4">
                <Alert
                  type={product?.product_type === 2 ? "green" : "red"}
                  info="Información:"
                  text={`Este elemento se ha registrado como un ${product?.product_type === 2 ? "servicio": "producto compuesto"}`  }
                  isDismisible={false}
                />
              </div>
            )}

            {(product?.product_type === 3) && (<div className="w-full px-4 py-2 bg-white">
              <Button text="VER PRODUCTOS ASIGNADOS" preset={Preset.primary} onClick={()=>setIsShowCompoundModal(true)} isFull />
            </div>)}

          {/* Modales  */}
          { showModalEdit && <ProductUpdateModal product={product} field={field} type={type} text={text} onClose={()=> setShowModalEdit(false)} />}
          { showModalPrices && <ProductPrecioMultipleModal product={product} onClose={()=> setShowModalPrices(false)} />}
          { isShowCompoundModal && <ProductCompoundModal product={product} onClose={()=>setIsShowCompoundModal(false)} />}
          
        </div>
      </Modal.Body>
      <Modal.Footer className="flex justify-end gap-4">
        { editable && <Dropdown label={<FaEdit size="1.2em" />} inline={true} >
          <Dropdown.Item><Link href={`product/edit/${product?.id}`}>EDITAR PRODUCTO</Link></Dropdown.Item>
          <Dropdown.Item icon={GrEdit} onClick={()=>getEdit("description", "text", "Cambiar Nombre")}>Cambiar Nombre</Dropdown.Item>    
          { product?.product_type === 1 && <Dropdown.Item icon={GrAction} onClick={()=>getEdit("minimum_stock", "number", "Cambiar Minimo en Stock")}>Minimo de Stock</Dropdown.Item>}
          { product?.product_type === 3 && <Dropdown.Item icon={GrAction} onClick={()=>setIsShowCompoundModal(true)}>Productos Asignados</Dropdown.Item>}
          <Dropdown.Item icon={GrAdd} onClick={()=>setShowModalPrices(true)}>Agregar Precios</Dropdown.Item>
          <Dropdown.Item icon={AiFillInfoCircle} onClick={()=>getEdit("information", "text", "Agregar información adicional")}>Información </Dropdown.Item>
        </Dropdown>}
        <Button onClick={onClose} preset={Preset.close} />
      </Modal.Footer>
    </Modal>
  );
}
