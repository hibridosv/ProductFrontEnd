"use client";
import { useState, useEffect } from "react";
import { OptionsClickOrder, SalesButtons } from "@/app/components/sales-components/sales-buttons";
import { SalesShowTotal } from "@/app/components/sales-components/sales-show-total";
import { getData, postData } from "@/services/resources";
import toast, { Toaster } from 'react-hot-toast';
import { OptionsClickSales, SalesQuickTable } from "@/app/components/table/sales-quick-table";
import { SalesShowOrders } from "@/app/components/sales-components/sales-show-orders";
import { SalesPayModal } from "@/app/components/modals/sales-pay-modal";
import { SalesQuantityModal } from "@/app/components/modals/sales-quantity-modal";
import { Product } from "@/services/products";
import { SalesDiscountProductModal } from "@/app/components/modals/sales-discount-modal";
import { SalesContactSearchModal } from "@/app/components/sales-components/sales-contact-search";
import { ContactNameOfOrder, ContactTypeToGet } from "@/services/enums";
import { SalesSearchByName } from "@/app/components/sales-components/sales-search-by-name"
import { SalesSearchByCode } from "@/app/components/sales-components/sales-search-by-cod";
import { SalesOthers } from "@/app/components/sales-components/sales-others";

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
  const [isContactSearchModal, setIsContactSearchModal] = useState(false);
  const [isSalesOtherModal, setIsSalesOtherModal] = useState(false);
  const [typeOfClient, setTypeOfClient] = useState<ContactTypeToGet>(ContactTypeToGet.clients); // tipo de cliente a buscar en el endpoint
  const [clientNametoUpdate, setClientNametoUpdate] = useState<ContactNameOfOrder>(ContactNameOfOrder.client); // tipo de cliente a buscar en el endpoint
  const [isDiscountType, setIsDiscountType] = useState(0);
  const [productSelected, setProductSelected] = useState([]) as any;
  const [typeOfSearch, setTypeOfSearch] = useState(true); // true: codigo, false: busqueda tipo de busqueda


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
     if (!isQuantityModal
      && !isDiscountProductModal
      && !isContactSearchModal
      && !isSalesOtherModal) {      
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
  }, [changeOrder, isQuantityModal, isDiscountProductModal, isContactSearchModal, isSalesOtherModal]);


  const deleteProduct = async (iden: number) => {
    setIsSending(true);
    try {
      const response = await postData(`sales/${iden}`, "DELETE");
      if (response.type === "successfull") {
        resetOrder()
      } else {
        setProductsOfInvoice(response?.data);
      }
      toast.success("Producto Eliminado");
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
      toast.success(response.message);
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
      toast.success(response.message);
      if (response.type !== "error") {
        resetOrder()
      }
    } catch (error) {
      console.error(error);
      toast.error("Ha ocurrido un error!");
    }
  };

  const onSubmit = async (data: any) => {
    
    if (!data.cod){
      toast.error("Error en el codigo!");
      return
    }
    let values = {
      product_id: data.cod,
      order_id: order,
      request_type: 2, // 1: id, 2: cod
      delivery_type: 1, // delivery, recoger en tienda, ecommerce
      order_type: 1, // venta, consignacion, ecommerce
      price_type: 1, // tipo de precio del producto
      addOrSubtract: data.addOrSubtract ? data.addOrSubtract : 1, // 1 sumar 2 restar
    };

    try {
      setIsSending(true);
      const response = await postData(`sales`, "POST", values);
      if (response.type === "error") {
        toast.error(response.message);
      } else {
        if (!order) setOrder(response.data.id);
        setProductsOfInvoice(response.data);
      }
      if (response.type === "successfull") {
        resetOrder()
      }
    } catch (error) {
      console.error(error);
      toast.error("Ha Ocurrido un Error!");
    } finally {
      setIsSending(false);
    }
  };

  const handleClickOptionOrder = (option: OptionsClickOrder) => { // opciones de la orden
    switch (option) {
      case 1: setIsPayModal(true);
        break;
      case 2: saveOrder();
        break;
      case 3: deleteOrder();
        break;
      case 11: (() => { setIsDiscountProductModal(true); setIsDiscountType(2) })();
        break;
      case 12: (() => { setIsContactSearchModal(true); setTypeOfClient(ContactTypeToGet.clients); setClientNametoUpdate(ContactNameOfOrder.client) })();
        break;
      case 13: (() => { setIsContactSearchModal(true); setTypeOfClient(ContactTypeToGet.employees); setClientNametoUpdate(ContactNameOfOrder.employee) })();
        break;
      case 14: (() => { setIsContactSearchModal(true); setTypeOfClient(ContactTypeToGet.referrals); setClientNametoUpdate(ContactNameOfOrder.referred) })();
        break;
      case 15: (() => { setIsContactSearchModal(true); setTypeOfClient(ContactTypeToGet.employees); setClientNametoUpdate(ContactNameOfOrder.delivery) })();
        break;
      case 16: (() => { setIsSalesOtherModal(true); })();
        break;
      default: console.log(option);
        break;
    }
  };


  const handleClickOptionProduct = (product: Product, option: OptionsClickSales) => { // opciones del producto
    switch (option) {
      case 1: deleteProduct(product.id)
        break;
      case 2: onSubmit({cod : product.cod})
        break;
      case 3: onSubmit({cod : product.cod, addOrSubtract : 2})
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
    setIsDiscountType(1)
  }


  const closeModalDiscount  = () => {
    setIsDiscountProductModal(false);
    setProductSelected([]);
    setIsDiscountType(0)
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
        toast.error(response.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("Ha ocurrido un error!");
    }
  };


  return (
    <div className="grid grid-cols-1 md:grid-cols-10 pb-10">
      <div className="col-span-6 border-r md:border-sky-600">
          { typeOfSearch ? 
            <SalesSearchByCode setTypeOfSearch={setTypeOfSearch} typeOfSearch={typeOfSearch} onFormSubmit={onSubmit} isLoading={isLoading} /> : 
            <SalesSearchByName setTypeOfSearch={setTypeOfSearch} typeOfSearch={typeOfSearch} onSubmit={onSubmit}  /> 
          }
        <div className="relative z-0">
          <SalesQuickTable records={productsOfInvoice?.invoiceproducts} onClick={handleClickOptionProduct} />
        </div>
      </div>
      <div className="col-span-4 flex justify-center ">
        <div className="w-full mx-4">
          {order ? 
            <SalesShowTotal isSending={isSending} records={productsOfInvoice} showClient={true} /> :
            <SalesShowOrders onClick={handleChangeOrder} />
          }
        </div>
        <div className="absolute bottom-2">
          {order && <SalesButtons onClick={handleClickOptionOrder} />}
        </div>
      </div>
      <SalesPayModal isShow={isPayModal} invoice={productsOfInvoice} onFinish={resetOrder} onClose={()=>setIsPayModal(false)} />
      <SalesQuantityModal isShow={isQuantityModal} order={order} product={productSelected} onClose={()=>setIsQuantityModal(false)} />
      <SalesDiscountProductModal isShow={isDiscountProductModal} discountType={isDiscountType} order={productsOfInvoice} product={productSelected} onClose={()=>closeModalDiscount()} />
      <SalesContactSearchModal  isShow={isContactSearchModal} ContactTypeToGet={typeOfClient} order={productsOfInvoice} onClose={()=>setIsContactSearchModal(false)} clientToUpdate={clientNametoUpdate}  />
      <SalesOthers isShow={isSalesOtherModal} order={productsOfInvoice} onClose={()=>setIsSalesOtherModal(false)} />
      <Toaster position="top-right" reverseOrder={false} />
    </div>
  );
}
