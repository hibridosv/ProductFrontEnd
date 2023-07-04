"use client";
import { useEffect, useState } from "react";
import { Loading, ViewTitle } from "@/app/components";
import { getData, postData } from "@/services/resources";
import { numberToMoney } from "@/utils/functions";
import { useForm } from "react-hook-form";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Button, Preset } from "@/app/components/button/button";
import { style } from "@/theme";
import { ProductFailureTable } from "@/app/components/table/product-failure-table";

export default function InsertProduct({ params }: { params: { id: number } }) {
  const { id } = params;
  const [selectedProduct, setSelectedProdcut] = useState<any>({});
  const [failure, setFailure] = useState<any>({});
  const [isLoading, setIsLoading] = useState(false);
  const { register, handleSubmit, reset, watch, setValue } = useForm();
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    (async () => {
      setIsLoading(true);
      try {
        const product = await getData(`products/${id}`);
        const failures = await getData(`failure`);
        setSelectedProdcut(product.data);
        setFailure(failures);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    })();
    // eslint-disable-next-line
  }, []);

  const onSubmit = async (data: any) => {
    data.product_id = selectedProduct?.id
    try {
      setIsSending(true);
      const response = await postData(`failure`, "POST", data);
      if (!response.message) {
        setFailure(response);
        const product = await getData(`products/${id}`);
        setSelectedProdcut(product.data);
        toast.success("Producto agregado correctamente", { autoClose: 2000 });
        reset();
      } else {
        toast.error("Faltan algunos datos importantes!", { autoClose: 2000 });
      }
    } catch (error) {
      console.error(error);
      toast.error("Ha ocurrido un error!", { autoClose: 2000 });
    } finally {
      setIsSending(false);
    }
  };


  const deleteRecord = async (iden: string) => {
    try {
      const response = await postData(`failure/${iden}`, 'DELETE');
      if(response?.type === "error"){
        toast.error(response.message, { autoClose: 2000 });
      } else {
        toast.success("Registro Eliminado", { autoClose: 2000 });
        setFailure(response);
        const product = await getData(`products/${id}`);
        setSelectedProdcut(product.data);
      }
    } catch (error) {
      console.error(error);
      toast.error("Ha ocurrido un error!", { autoClose: 2000 });
    } 
    
  }

  if (isLoading) return (<Loading />)


  return (
    <div className="grid grid-cols-1 md:grid-cols-6 pb-10">
      <div className="col-span-2">
        <ViewTitle text="DESCONTAR AVERIAS" />
        {isLoading && <Loading />}
        <div className="w-full px-4">
            <form onSubmit={handleSubmit(onSubmit)} className="w-full">
              <div className="flex flex-wrap -mx-3 mb-6">

              <div className="w-full px-3 mb-2">
                    <label htmlFor="prescription" className={style.inputLabel}>
                      Cantidad{" "}
                    </label>
                    <input
                    type="number"
                    id="quantity"
                    {...register("quantity")}
                    className={style.input}
                    step="any"
                    min={0}
                    />
                  </div>
                  <div className="w-full md:w-full px-3 mb-4">
                  <label htmlFor="reason" className={style.inputLabel}>
                    Razón de averia{" "}
                  </label>
                  <textarea
                    {...register("reason", {})}
                    rows={2}
                    className={`${style.input} w-full`}
                  />
                </div>

                <div className='w-full'>
                <span className="float-right">
                  {isSending ? (
                    <Button disabled={true} preset={Preset.saving} />
                  ) : (
                    <Button type="submit" preset={Preset.save} />
                  )}
                </span>
              </div>

              </div>
            </form>
          </div>

      </div>
      <div  className="col-span-2">
        <ViewTitle text="ULTIMAS AVERIAS" />
        <ProductFailureTable records={failure?.data} onDelete={deleteRecord} />
      </div>

      <div className="col-span-2 px-3">
        <ViewTitle text="PRODUCTO" />

        <h3 className="text-2xl">{selectedProduct?.description}</h3>
<div className="border-t border-gray-200">

    <div className='flex justify-between px-4 py-2 bg-gray-50 border border-slate-200'>
      <div className="text-lg font-medium text-gray-500">Codigo</div>
      <div className="mt-1 text-lg text-gray-900 font-bold">{selectedProduct?.cod}</div>
    </div>
    <div className='flex justify-between px-4 py-2 bg-gray-50 border border-slate-200'>
      <div className="text-lg font-medium text-gray-500">Cantidad</div>
      <div className={`mt-1 text-lg font-bold ${selectedProduct?.quantity <= selectedProduct?.minimum_stock ? 'text-red-600' : 'text-gray-900'}`}>{selectedProduct?.quantity}</div>
    </div>
    <div className='flex justify-between px-4 py-2 bg-gray-50 border border-slate-200'>
      <div className="text-lg font-medium text-gray-500">Precio por Unidad</div>
      <div className="mt-1 text-lg text-gray-900 font-bold">
          {selectedProduct?.prices && selectedProduct.prices.length > 0
            ? numberToMoney(selectedProduct.prices[0].price)
            : numberToMoney(0)}</div>
    </div>
    <div className='flex justify-between px-4 py-2 bg-gray-50 border border-slate-200'>
      <div className="text-lg font-medium text-gray-500">Minimo Stock</div>
      <div className="mt-1 text-lg text-gray-900 font-bold">{selectedProduct?.minimum_stock}</div>
    </div>

</div>

      </div>
      <ToastContainer />
    </div>
  );
}
