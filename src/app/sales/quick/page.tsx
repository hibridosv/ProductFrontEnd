'use client'
import { useState, useEffect } from "react";
import { SalesButtons } from "@/app/components/sales-components/sales-buttons";
import { SalesShowTotal } from "@/app/components/sales-components/sales-show-total";
import { getData, postData } from "@/services/resources";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useForm } from "react-hook-form";
import { SalesQuickTable } from "@/app/components/table/sales-quick-table";
import { SalesShowOrders } from "@/app/components/sales-components/sales-show-orders";

export default function ViewSales() {
  const [isLoading, setIsLoading] = useState(false);
  const [productsOfInvoice, setProductsOfInvoice] = useState([]) as any;
  const [isSending, setIsSending] = useState(false);
  const [order, setOrder] = useState(null);
  const [changeOrder, setChangeOrder] = useState(false);

  const { register, handleSubmit, reset, watch } = useForm();



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
  
  useEffect(() => {
    if (order) {
        (async () => { await loadDataProductsOfInvoice() })();
    }
  // eslint-disable-next-line
  }, [changeOrder]);


  const deleteProduct = async (iden: number) => {
    try {
      const response = await postData(`sales/${iden}`, 'DELETE');
      if (response.type === 'successfull'){
        setOrder(null)
        setProductsOfInvoice([])
      } else {
        setProductsOfInvoice(response?.data)
      }
      toast.success(response.message, { autoClose: 2000 });
    } catch (error) {
      console.error(error);
      toast.error("Ha ocurrido un error!");
    } 
  }

  const deleteOrder = async () => {
    try {
      const response = await postData(`sales/order/${order}`, 'DELETE');
      toast.success(response.message, { autoClose: 2000 });
      if (response.type !== 'error') {
        setProductsOfInvoice([])
        setOrder(null)    
      }
    } catch (error) {
      console.error(error);
      toast.error("Ha ocurrido un error!");
    } 
  }

  const saveOrder = async () => {
    try {
      const response = await postData(`sales/order/${order}`, 'POST');
      toast.success(response.message, { autoClose: 2000 });
      if (response.type !== 'error') {
        setProductsOfInvoice([])
        setOrder(null)
      }
    } catch (error) {
      console.error(error);
      toast.error("Ha ocurrido un error!");
    } 
  }

  const onSubmit = async (data: any) => {
    let values = {
      product_id: data.product_id,
      order_id: order,
      request_type: 2,
      delivery_type: 1,
      order_type: 1,
      price_type: 1,
    }
    console.log(values)
    try {
      setIsSending(true)
      const response = await postData(`sales`, "POST", values);
      if (!response.message) {
        if (!order) setOrder(response.data.id)
        setProductsOfInvoice(response.data)
      } else {
        toast.error(response.message, { autoClose: 2000 });
      }
    } catch (error) {
      console.error(error);
      toast.error("Ha Ocurrido un Error!", { autoClose: 2000 });
    } finally{
      setIsSending(false)
      reset();
    }
  }

  const handleClickOption = (option: number) =>{
    switch (option) {
      case 1:
        console.log(option)
      break;
      case 2:
        saveOrder()
      break;
      case 3:
        deleteOrder()
      break;
      default:
        break;
    }
  }

  const handleChangeOrder = (order: any): void =>{
    setOrder(order)
    setChangeOrder(!changeOrder)
  }


  return (
       <div className="grid grid-cols-1 md:grid-cols-10 pb-10">
              <div className="col-span-6 border-r md:border-sky-600">
                <div className="m-2">
                  
                  
      <form onSubmit={handleSubmit(onSubmit)} className="w-full">
      <div>
        <label
          htmlFor="default-search"
          className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white"
        >
          Search
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <svg
              aria-hidden="true"
              className="w-5 h-5 text-gray-500 dark:text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              ></path>
            </svg>
          </div>
          <input
            type="text"
            id="product_id"
            className="block w-full p-4 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="Buscar Porducto"
            required
            {...register("product_id")}
          />
        </div>
    </div>
    </form>



                </div>
                <div>
                  <SalesQuickTable records={productsOfInvoice?.invoiceproducts} onDelete={deleteProduct} />
                </div>
            </div>
            <div className="col-span-4 flex justify-center ">
              
              <div className="w-full">
              { order ? <SalesShowTotal records={productsOfInvoice?.invoiceproducts} /> : <SalesShowOrders onClick={handleChangeOrder} /> }
              </div>              
              <div className="absolute bottom-2">
              { order && <SalesButtons onClick={handleClickOption} />}
              </div>
            </div>
      <ToastContainer />
      </div>
      );
}
