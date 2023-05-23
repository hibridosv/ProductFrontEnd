import { Product } from "@/services/products";
import { Modal } from "flowbite-react";
import { Button, Preset } from "../Button/button"

export interface ProductViewModalProps {
  onClose: () => void;
  product?: Product;
}

export function ProductViewModal(props: ProductViewModalProps) {
  const { onClose, product } = props;

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
                $ {product?.prices && product.prices.length > 0 ? product.prices[0].qty : null}
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
                    {product?.expires}
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

          {/* listado de cosas  */}
        </div>
      </Modal.Body>
      <Modal.Footer className="flex justify-end gap-4">
        <Button onClick={onClose} preset={Preset.close} />
      </Modal.Footer>
    </Modal>
  );
}
