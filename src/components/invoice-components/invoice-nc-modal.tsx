"use client";
import { useContext, useEffect, useState } from "react";
import { Modal } from "flowbite-react";
import { Button, Preset } from "../button/button";
import { numberToMoney } from "@/utils/functions";
import { ConfigContext } from "@/contexts/config-context";
import { useForm, Controller } from "react-hook-form";
import toast, { Toaster } from "react-hot-toast";
import { postData } from "@/services/resources";
import { Alert } from "../alert/alert";
import { PresetTheme } from "@/services/enums";
import { Loading } from "../loading/loading";


export interface InvoiceNCModalProps {
  onClose: () => void;
  isShow: boolean;
  record: any;
}

export function InvoiceNCModal(props: InvoiceNCModalProps) {
  const { onClose, record, isShow = false } = props;
  const { systemInformation } = useContext(ConfigContext);
  const [isSending, setIsSending] = useState(false);
  const [formProducts, setFormProducts] = useState<any[]>([]);
  const { control, handleSubmit, watch, setValue } = useForm();

  useEffect(() => {
    if (record.products && isShow) {
      const initializedProducts = record.products.map((product: any) => ({
        ...product,
        quantity: product.quantity || 1,
        discount: product.discount || 0,
      }));
      setFormProducts(initializedProducts);

      initializedProducts.forEach((product: any) => {
        setValue(`product-${product.id}`, product.quantity);
      });
    }
  }, [record.products, setValue, isShow]);

  const handleNc = async(data: any) => {
    const formattedData = formProducts.map((product: any) => ({
      id: product.id,
      product_id: product.product_id,
      product_type: product.product_type,
      lot_id: product.lot_id,
      quantity: Number(data[`product-${product.id}`]),
    }));
    const hasZeroQuantity = formattedData.some((product: any) => product.quantity === 0);
    if (hasZeroQuantity) {
        toast.error("No se puede crear una nota de crédito con productos con cantidad 0");
        return;
    }
    let newData = {
        products: formattedData,
        invoice: record.id,
        total: grantTotal,
    }

        try {
            setIsSending(true)
            const response = await postData(`invoices/credit-note`, "POST", newData);
            if (response.type === "successful") {
                toast.success("Nota de crédito enviada correctamente");
                onClose();
            } else {
                toast.error(response.message);
            }
        } catch (error) {
            console.error(error);
            toast.error("Ha ocurrido un error!");
        } finally {
            setIsSending(false)
        }

  };

  const grantTotal = formProducts.reduce((acc, p) => {
                          const q = Number(watch(`product-${p.id}`)) || 0;
                          return acc + q * p.unit_price;
                        }, 0);
  return (
    <Modal
      size={isSending ? "sm" : "5xl"}
      show={isShow}
      position="center"
      onClose={onClose}
    >
      { !isSending && <Modal.Header>CREAR NOTA DE CREDITO</Modal.Header> }
      <Modal.Body>
        { isSending ? <Loading text="Creando nota de crédito" /> :
        <form onSubmit={handleSubmit(handleNc)}>
          <div className="mx-3">
            <Alert theme={PresetTheme.info} text="Para enviar una Nota de Crédito del documento total haga click en el boton de Agregar Nota de Crédito, para enviar una Nota de Crédito parcial cambie las cantidades de los productos en el formulario antes de enviar" isDismisible={false} className="mb-8" />
            <div className="w-full overflow-auto mt-4">
              <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                  <tr>
                    <th className="py-3 px-4 border">Cant</th>
                    <th className="py-3 px-4 border">Código</th>
                    <th className="py-3 px-4 border">Producto</th>
                    <th className="py-3 px-4 border">Precio</th>
                    <th className="py-3 px-4 border">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {formProducts.map((product: any) => {
                    const quantity = Number(watch(`product-${product.id}`)) || 0;
                    const total = quantity * product.unit_price;
                    return (
                      <tr key={product.id} className="border-b">
                        <td className="py-2 px-6">
                          <Controller
                            name={`product-${product.id}`}
                            control={control}
                            defaultValue={product.quantity}
                            render={({ field }) => (
                              <input
                                type="number"
                                {...field}
                                min={1}
                                max={product.quantity}
                                className="w-20 bg-transparent border border-white rounded text-center focus:outline-none focus:ring-1 focus:ring-blue-500"
                              />
                            )}
                          />
                        </td>
                        <td className="py-2 px-6 truncate">{product.cod}</td>
                        <td className="py-2 px-6 text-gray-900 whitespace-nowrap dark:text-white">
                          {product.product}
                        </td>
                        <td className="py-2 px-6">
                          {numberToMoney(product.unit_price, systemInformation)}
                        </td>
                        <td className="py-2 px-6">
                          {numberToMoney(total, systemInformation)}
                        </td>
                      </tr>
                    );
                  })}
                  <tr>
                    <td colSpan={4}></td>
                    <td className="py-3 px-4 border">
                      {numberToMoney(grantTotal, systemInformation)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="mt-6 flex justify-end">
              <Button type="submit" preset={Preset.save} text="Crear Nota de Crédito" disabled={isSending} />
            </div>
          </div>
        </form> }
        <Toaster position="top-right" reverseOrder={false} />
      </Modal.Body>
      {!isSending && <Modal.Footer className="flex justify-end gap-4">
        <Button onClick={onClose} preset={Preset.close} />
      </Modal.Footer>
    }
    </Modal>
  );
}
