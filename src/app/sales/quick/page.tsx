"use client";
import { useState, useEffect } from "react";
import { SalesButtons } from "@/app/components/sales-components/sales-buttons";
import { SalesShowTotal } from "@/app/components/sales-components/sales-show-total";
import { getData, postData } from "@/services/resources";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useForm } from "react-hook-form";
import { OptionsClickSales, SalesQuickTable } from "@/app/components/table/sales-quick-table";
import { SalesShowOrders } from "@/app/components/sales-components/sales-show-orders";
import { SalesPayModal } from "@/app/components/modals/sales-pay-modal";
import { SearchIcon } from "@/theme/svg";
import { SalesQuantityModal } from "@/app/components/modals/sales-quantity-modal";
import { Product } from "@/services/products";
import { SalesDiscountProductModal } from "@/app/components/modals/sales-discount-modal";

export default function ViewSales() {
  const [isLoading, setIsLoading] = useState(false);
  const [productsOfInvoice, setProductsOfInvoice] = useState([]) as any;
  const [isSending, setIsSending] = useState(false);
  const [order, setOrder] = useState(null);
  const [changeOrder, setChangeOrder] = useState(false);
  const [typeOfPay, setTypeOfPay] = useState(false);
  const [isPayModal, setIsPayModal] = useState(false);
  const [isQuantityModal, setIsQuantityModal] = useState(false);
  const [isDiscountProductModal, setIsDiscountProductModal] = useState(false);
  const [productSelected, setProductSelected] = useState([]) as any;


  const { register, handleSubmit, reset } = useForm();

  const loadDataProductsOfInvoice = async () => {
    setIsLoading(true);
    try {
      const response = await getData(`sales/${order}`);
      setProductsOfInvoice(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };


  const loadLastInvoice = async () => {
    setIsLoading(true);
    try {
      const response = await getData(`sales/order/select`);
      setProductsOfInvoice(response.data);
      setOrder(response.data.id);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };



  useEffect(() => {
    if (isQuantityModal === false && isDiscountProductModal === false) {      
      if (order) {
        (async () => {
          await loadDataProductsOfInvoice();
        })();
      } else {
        (async () => {
          await loadLastInvoice();
        })();
      }
  }
    // eslint-disable-next-line
  }, [changeOrder, isQuantityModal, isDiscountProductModal]);


  const deleteProduct = async (iden: number) => {
    setIsSending(true);
    try {
      const response = await postData(`sales/${iden}`, "DELETE");
      if (response.type === "successfull") {
        resetOrder()
      } else {
        setProductsOfInvoice(response?.data);
      }
      toast.success(response.message, { autoClose: 2000 });
    } catch (error) {
      console.error(error);
      toast.error("Ha ocurrido un error!");
    } finally {
      setIsSending(false);
    }
  };

  const deleteOrder = async () => {
    try {
      const response = await postData(`sales/order/${order}`, "DELETE");
      toast.success(response.message, { autoClose: 2000 });
      if (response.type !== "error") {
        resetOrder()
      }
    } catch (error) {
      console.error(error);
      toast.error("Ha ocurrido un error!");
    }
  };

  const saveOrder = async () => {
    try {
      const response = await postData(`sales/order/save/${order}`, "POST");
      toast.success(response.message, { autoClose: 2000 });
      if (response.type !== "error") {
        resetOrder()
      }
    } catch (error) {
      console.error(error);
      toast.error("Ha ocurrido un error!");
    }
  };

  const onSubmit = async (data: any) => {
    let values = {
      product_id: data.product_id,
      order_id: order,
      request_type: 2,
      delivery_type: 1,
      order_type: 1,
      price_type: 1,
      addOrSubtract: data.addOrSubtract ? data.addOrSubtract : 1, // 1 sumar 2 restar
    };
    try {
      setIsSending(true);
      const response = await postData(`sales`, "POST", values);
      if (response.type === "error") {
        toast.error(response.message, { autoClose: 2000 });
      } else {
        if (!order) setOrder(response.data.id);
        setProductsOfInvoice(response.data);
      }
      if (response.type === "successfull") {
        resetOrder()
      }
    } catch (error) {
      console.error(error);
      toast.error("Ha Ocurrido un Error!", { autoClose: 2000 });
    } finally {
      setIsSending(false);
      reset();
    }
  };

  const handleClickOptionOrder = (option: number) => { // opciones de la orden
    switch (option) {
      case 1: setIsPayModal(true);
        break;
      case 2: saveOrder();
        break;
      case 3: deleteOrder();
        break;
      default: console.log(option);
        break;
    }
  };


  const handleClickOptionProduct = (product: Product, option: OptionsClickSales) => { // opciones del producto
    console.log("Producto: ", product)
    switch (option) {
      case 1: deleteProduct(product.id)
        break;
      case 2: onSubmit({product_id : product.cod})
        break;
      case 3: onSubmit({product_id : product.cod, addOrSubtract : 2})
        break;
      case 4: selectPorductForQuantity(product);
        break;
      case 5: selectPorductForDiscount(product);
        break;
    }
  };

  const selectPorductForQuantity = (product: Product) => {
    setIsQuantityModal(true);
    setProductSelected(product);
  }

  const selectPorductForDiscount  = (product: Product) => {
    setIsDiscountProductModal(true);
    setProductSelected(product);
  }

 
  const resetOrder = () =>{
    setProductsOfInvoice([]);
    setOrder(null);
    setIsPayModal(false)
  }

  const handleChangeOrder = async (order: any) => {
    try {
      const response = await postData(`sales/order/select/${order}`, "POST");
      if (response.type !== "error") {
        setOrder(order);
        setChangeOrder(!changeOrder);
      } else {
        toast.error(response.message, { autoClose: 2000 });
      }
    } catch (error) {
      console.error(error);
      toast.error("Ha ocurrido un error!");
    }
  };


  return (
    <div className="grid grid-cols-1 md:grid-cols-10 pb-10">
      <div className="col-span-6 border-r md:border-sky-600">
        <div className="m-2">
          <form onSubmit={handleSubmit(onSubmit)} className="w-full">
            <div>

              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                 { SearchIcon }
                </div>
                <input
                  type="text"
                  id="product_id"
                  readOnly ={isLoading}
                  className="block w-full p-4 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder={isLoading ? "Cargando Datos" : "Ingrese el código del Producto"}
                  required
                  {...register("product_id")}
                />
              </div>
            </div>
          </form>
        </div>
        <div>
          <SalesQuickTable
            records={productsOfInvoice?.invoiceproducts}
            onClick={handleClickOptionProduct}
          />
        </div>
      </div>
      <div className="col-span-4 flex justify-center ">
        <div className="w-full mx-4">
          {order ? (
            <SalesShowTotal
              isSending={isSending}
              records={productsOfInvoice?.invoiceproducts}
            />
          ) : (
            <SalesShowOrders onClick={handleChangeOrder} />
          )}
        </div>
        <div className="absolute bottom-2">
          {order && <SalesButtons onClick={handleClickOptionOrder} />}
        </div>
      </div>
      <SalesPayModal isShow={isPayModal} invoice={productsOfInvoice} onFinish={resetOrder} onClose={()=>setIsPayModal(false)} />
      <SalesQuantityModal isShow={isQuantityModal} order={order} product={productSelected} onClose={()=>setIsQuantityModal(false)} />
      <SalesDiscountProductModal isShow={isDiscountProductModal} product={productSelected} onClose={()=>setIsDiscountProductModal(false)} />
      <ToastContainer />
    </div>
  );
}
