"use client";
import { useEffect, useState } from "react";
import { Tooltip } from "flowbite-react";
import { Button, Preset } from "../button/button";
import { getData } from "@/services/resources";
import { Alert } from "../alert/alert";
import { numberToMoney } from "@/utils/functions";
import { PresetTheme } from "@/services/enums";
import { ListImagesOfProducts } from "../products-components/list-images";
import { ProductLinkedModal } from "../products-components/product-add-linked-modal";
import { Price } from "@/services/products";


export interface ProductDetailsProps {
  product: any;
  isShow?: boolean;
  state?: boolean;
}

export function ProductDetails(props: ProductDetailsProps) {
  const { product, isShow, state = false } = props;
  const [productQuantity, setProductQuantity] = useState(null);
  const [isShowLinkedModal, setIsShowLinkedModal] = useState(false);
  const [isNotShowImages, setIsNotShowImages] = useState(true);
  const [isLoading, setIsLoading] = useState(false);


useEffect(() => {
  if (isShow) {
    const loadData = async () =>{
        try {
            setIsLoading(true)
            setProductQuantity(await getData(`sales/product/quantity/${product.id}`))
        } catch (error) {
            console.error(error)
        } finally {
            setIsLoading(false)
        }
      }
      if (product && isShow && product?.product_type === 1) {
        (async () => {
          await loadData()
        })();
      }
    }    
    }, [product, isShow]);

const listPrices = product?.prices?.map((price: Price):any => (
  <div key={price.id} className="w-full flex justify-center border-2">
    <div className="border border-teal-300">
        <span className="mx-2">{price.qty }</span>
        <span className="mx-2">=</span>
        <span className="mx-2">{ numberToMoney(price.price)}</span>
        <span className="mx-2">{price.price_type == 1 && "N"} {price.price_type == 2 && "M"} {price.price_type == 3 && "P"}</span>
    </div>
  </div>
));

  return (
    <div className="mx-4">
    <div className="flex justify-center my-4">
      <div className="pb-4 pt-2 sm:mx-3 mx-1 rounded-lg border-cyan-700 px-2 border-2">
        Cantidad
        <div className="sm:text-4xl flex justify-center text-2xl">
          {product?.quantity}
        </div>
      </div>

        <Tooltip
          animation="duration-300"
          content={listPrices}
        >
      <div className="pb-4 pt-2 sm:mx-3 mx-1 rounded-lg border-cyan-700  text-blue-700 px-2 border-2">
        Precio Unidad
        <div className="sm:text-4xl flex justify-center text-2xl">
          {product?.prices && product.prices.length > 0 ? numberToMoney(product.prices[0].price) : numberToMoney(0)}
        </div>
        </div>
        </Tooltip>

      
      <div className="pb-4 pt-2 sm:mx-3 mx-1 rounded-lg border-cyan-700 px-2 border-2">
        Min Stock
        <div className="sm:text-4xl flex justify-center text-2xl">
          {product?.minimum_stock}
        </div>
      </div>
    </div>
    {/* listado de cosas  */}

    <div className="max-w-2xl overflow-hidden bg-white shadow sm:rounded-lg">
      <div className="px-4 py-2 sm:px-6">
        <h3 className="text-2xl font-bold leading-6 text-gray-900">
            {product?.description}
        </h3>
      </div>
      <div className="border-t border-gray-200">
        <dl>
        <div className="px-4 py-2 bg-white sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-500">Cantidad Disponible</dt>
            <dd className={`font-bold mt-1 text-sm sm:mt-0 sm:col-span-2 ${productQuantity && productQuantity > 0 ? 'text-red-500' : 'text-gray-900'}`}>
              {isLoading ? "Calculando..." : productQuantity ? product?.quantity - productQuantity : product?.quantity}
            </dd>
          </div>

          <div className="px-4 py-2 bg-gray-50 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-500">Codigo</dt>
            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
              {product?.cod}
            </dd>
          </div>
          {product?.product_type === 1 && (<div className="px-4 py-2 bg-white sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
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
          {(product?.product_type === 1 && product?.default_discount > 0) && (<div className="px-4 py-2 bg-white sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-500">Descuento establecido</dt>
            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
              {product?.default_discount} %
            </dd>
          </div>)}

          {(product?.product_type === 1 && product?.default_commission > 0) && (<div className="px-4 py-2 bg-white sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-500">Comisión establecida</dt>
            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
              {product?.default_commission} %
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
          
          {product?.expires ?
          <div className="px-4 py-2 bg-white sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-500">Expira</dt>
            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
              <div className="text-base	text-red-600	">CON FECHA DE VENCIMIENTO</div>
            </dd>
          </div> : <></> }

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
        { isNotShowImages &&
        <div className="w-full px-4 py-2 flex justify-center clickeable" onClick={()=>setIsNotShowImages(false)}>Cargar Imagenes</div>
        }
        <ListImagesOfProducts productId={product?.id} state={isNotShowImages} visible={state}/>
      </div>
    </div>

    {product?.product_type != 1 && (
        <div className="mt-4">
          <Alert
            theme={product?.product_type === 2 ? PresetTheme.success : PresetTheme.info}
            info="Información:"
            text={`Este elemento se ha registrado como un ${product?.product_type === 2 ? "servicio": "producto relacionando"}`  }
            isDismisible={false}
          />
        </div>
      )}

      {(product?.product_type === 3) && (<div className="w-full px-4 py-2 bg-white">
        <Button text="VER PRODUCTOS ASIGNADOS" preset={Preset.primary} onClick={()=>setIsShowLinkedModal(true)} isFull />
      </div>)}
    <ProductLinkedModal isShow={isShowLinkedModal} product={product} onClose={()=>setIsShowLinkedModal(false)} />
   
  </div>
  );

}
