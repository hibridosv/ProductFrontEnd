"use client";
import { useContext, useEffect, useState, useRef } from "react";
import { Modal, ToggleSwitch } from "flowbite-react";
import { Button, Preset } from "../button/button";
import { getCountryProperty, numberToMoney } from "@/utils/functions";
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
  const [isProductReturn, setIsProductReturn] = useState(true);
  const [formProducts, setFormProducts] = useState<any[]>([]);
  const [totalState, setTotalState] = useState(0);
  const { control, handleSubmit, setValue, getValues } = useForm({
    shouldUnregister: false,
  });
  const taxesPercent = 1 + (getCountryProperty(parseInt(systemInformation?.system?.country)).taxes / 100);
  const productsRef = useRef<any[]>([]);

  useEffect(() => {
    if (record.products && isShow) {
      const initializedProducts = record.products.map((product: any) => ({
        ...product,
        quantity: product.quantity || 1,
        discount: product.discount || 0,
      }));
      setFormProducts(initializedProducts);
      productsRef.current = initializedProducts;

      initializedProducts.forEach((product: any) => {
        setValue(`product-${product.id}`, product.quantity);
        setValue(`name-${product.id}`, product.product);
        setValue(`price-${product.id}`, product.unit_price);
      });
      
      setTotalState(calculateTotal(initializedProducts));
    }
    // eslint-disable-next-line
  }, [record.products, setValue, isShow]);

  const calculateTotal = (products = formProducts) => {
    let total = 0;
    products.forEach((p) => {
      const quantity = Number(getValues(`product-${p.id}`)) || 0;
      const price = Number(getValues(`price-${p.id}`)) || 0;
      total += quantity * price;
    });
    return total;
  };

  // Update the total after blur (focus lost) rather than on every change
  const updateTotalAfterBlur = () => {
    setTimeout(() => {
      setTotalState(calculateTotal());
    }, 0);
  };

  const handleNc = async () => {
    // Calculate the final total before submission
    const currentTotal = calculateTotal();
    setTotalState(currentTotal);
    const totalIsDiferent = currentTotal !== record.total;
    
    const formattedData = formProducts
      .map((product: any) => {
        const quantity = Number(getValues(`product-${product.id}`)) || 0;
        const unit_price = Number(getValues(`price-${product.id}`)) || 0;
        const name = getValues(`name-${product.id}`);
        if (quantity === 0) return null;
        const total = quantity * unit_price;
        const subtotal = total / taxesPercent;
        const taxes = total - subtotal;
        return {
          id: product.id,
          product_id: product.product_id,
          product_type: product.product_type,
          lot_id: product.lot_id,
          product_name: name,
          product_price: unit_price,
          product_subtotal: subtotal,
          product_taxes: taxes,
          product_total: total,
          is_product_return: isProductReturn,
          quantity,
        };
      })
      .filter((item) => item !== null);

    if (formattedData.length === 0) {
      toast.error("Debe tener al menos un producto con cantidad mayor a 0");
      return;
    }

    const newData = {
      products: formattedData,
      invoice: record.id,
      subtotal: currentTotal / taxesPercent,
      taxes: currentTotal - (currentTotal / taxesPercent),
      total: currentTotal,
      credit_note_type: totalIsDiferent ? 2 : 1, // 1 for full credit note, 2 for partial
    };

    try {
      setIsSending(true);
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
      setIsSending(false);
    }
  };

  // Calculate product total for display in table
  const getProductTotal = (productId: any) => {
    const quantity = Number(getValues(`product-${productId}`)) || 0;
    const price = Number(getValues(`price-${productId}`)) || 0;
    return quantity * price;
  };
  console.log("record", record);
  console.log("records?.invoice_assigned", record?.invoice_assigned);

  return (
    <Modal size={isSending ? "sm" : "5xl"} show={isShow} position="center" onClose={onClose}>
      {!isSending && <Modal.Header>CREAR NOTA DE CREDITO</Modal.Header>}
      <Modal.Body>
        {isSending ? (
          <Loading text="Creando nota de crédito" />
        ) : (
          <form onSubmit={handleSubmit(handleNc)}>
            <div className="mx-3">
              <Alert
                theme={PresetTheme.info}
                text="Para enviar una Nota de Crédito del documento total haga click en el botón de Agregar Nota de Crédito. Para enviar una Nota de Crédito parcial cambie las cantidades de los productos en el formulario antes de enviar."
                isDismisible={false}
                className="mb-8"
              />
              <div className="w-full overflow-auto mt-4">
                <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                  <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                    <tr>
                      <th className="py-3 px-4 border">Cant</th>
                      <th className="py-3 px-4 border">Código</th>
                      <th className="py-3 px-4 border w-full">Producto</th>
                      <th className="py-3 px-4 border">Precio</th>
                      <th className="py-3 px-4 border">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {formProducts.map((product: any) => (
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
                                min={0}
                                // max={product.quantity}
                                className="w-20 bg-transparent border border-white rounded text-center focus:outline-none focus:ring-1 focus:ring-blue-500"
                                onBlur={(e) => {
                                  field.onBlur();
                                  updateTotalAfterBlur();
                                }}
                              />
                            )}
                          />
                        </td>
                        <td className="py-2 px-6 truncate">{product.cod}</td>
                        <td className="py-2 px-6">
                          <Controller
                            name={`name-${product.id}`}
                            control={control}
                            defaultValue={product.product}
                            render={({ field }) => (
                              <textarea
                                rows={1}
                                maxLength={250}
                                {...field}
                                className="w-full bg-transparent border border-white rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500"
                              />
                            )}
                          />
                        </td>
                        <td className="py-2 px-6">
                          <Controller
                            name={`price-${product.id}`}
                            control={control}
                            defaultValue={product.unit_price}
                            render={({ field }) => (
                              <input
                                type="number"
                                {...field}
                                className="w-24 bg-transparent border border-white rounded px-2 py-1 text-right focus:outline-none focus:ring-1 focus:ring-blue-500"
                                onBlur={(e) => {
                                  field.onBlur();
                                  updateTotalAfterBlur();
                                }}
                              />
                            )}
                          />
                        </td>
                        <td className="py-2 px-6">
                          {numberToMoney(
                            getProductTotal(product.id),
                            systemInformation
                          )}
                        </td>
                      </tr>
                    ))}
                    <tr>
                      <td colSpan={4} className="text-right font-bold py-3 px-4 border">TOTAL:</td>
                      <td className="py-3 px-4 border font-bold">
                        {numberToMoney(totalState, systemInformation)}
                      </td>
                    </tr>
                    <tr>
                      <td colSpan={4} className="text-right font-bold py-3 px-4 border">RETORNAR PRODUCTOS AL INVENTARIO:</td>
                      <td className="py-3 px-4 border font-bold">
                        <ToggleSwitch
                            disabled={false}
                            checked={isProductReturn}
                            label={isProductReturn ? "Activo" : "Inactivo"}
                            onChange={() => setIsProductReturn(!isProductReturn)}
                          />
                      </td>
                    </tr>  
                  </tbody>
                </table>
              </div>
              { record?.invoice_assigned?.type == 2 && record?.client?.register == null ? (
                <Alert
                theme={PresetTheme.danger}
                text="Para crear una Nota de Crédito, el cliente de la factura debe estar asignado y ser contribuyente."
                isDismisible={false}
                className="my-8"
              />
              ) : (
                <div className="mt-6 flex justify-end">
                  <Button
                    type="submit"
                    preset={Preset.save}
                    text="Crear Nota de Crédito"
                    disabled={isSending}
                  />
              </div>
              )}
            </div>
          </form>
        )}
        <Toaster position="top-right" reverseOrder={false} />
      </Modal.Body>
      {!isSending && (
        <Modal.Footer className="flex justify-end gap-4">
          <Button onClick={onClose} preset={Preset.close} />
        </Modal.Footer>
      )}
    </Modal>
  );
}