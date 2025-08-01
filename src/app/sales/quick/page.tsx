"use client";
import { useState, useEffect, useContext } from "react";
import { SalesButtons } from "@/components/sales-components/sales-buttons";
import { SalesShowTotal } from "@/components/sales-components/sales-show-total";
import { getData, postData } from "@/services/resources";
import toast, { Toaster } from 'react-hot-toast';
import { OptionsClickSales, SalesQuickTable } from "@/components/sales-components/sales-quick-table";
import { SalesShowOrders } from "@/components/sales-components/sales-show-orders";
import { SalesPayModal } from "@/components/sales-components/sales-pay-modal";
import { SalesQuantityModal } from "@/components/sales-components/sales-quantity-modal";
import { Product } from "@/services/products";
import { SalesDiscountProductModal } from "@/components/sales-components/sales-discount-modal";
import { SalesContactSearchModal } from "@/components/sales-components/sales-contact-search";
import { ContactNameOfOrder, ContactTypeToGet, OptionsClickOrder } from "@/services/enums";
import { SalesSearchByName } from "@/components/sales-components/sales-search-by-name"
import { SalesSearchByCode } from "@/components/sales-components/sales-search-by-cod";
import { SalesOthers } from "@/components/sales-components/sales-others";
import { SalesSelectInvoiceTypeModal } from "@/components/sales-components/sales-select-invoice-type";
import { errorSound, extractActiveFeature, getConfigStatus, successSound } from "@/utils/functions";
import { ConfigContext } from "@/contexts/config-context";
import { SalesCommissionModal } from "@/components/sales-components/sales-commission-modal";
import { SalesProductViewModal } from "@/components/sales-components/sales-product-view-modal";
import { SalesCommentModal } from "@/components/sales-components/sales-comment";
import { SalesPriceModal } from "@/components/sales-components/sales-price-modal";
import { SalesEspecialProductsModal } from "@/components/sales-components/sales-special-products";
import { useIsOpen } from "@/hooks/useIsOpen";
import { SalesChangeProductModal } from "@/components/sales-components/sales-change-product-modal";
import { SalesButtonsInitial } from "@/components/sales-components/sales-buttons-initial";
import { SalesChangeLotModal } from "@/components/sales-components/sales-change-lot";

export default function ViewSales() {
  const [isLoading, setIsLoading] = useState(false);
  const [productsOfInvoice, setProductsOfInvoice] = useState([]) as any;
  const [isSending, setIsSending] = useState(false);
  const [order, setOrder] = useState(null);
  const [changeOrder, setChangeOrder] = useState(false);
  const [isPayModal, setIsPayModal] = useState(false);
  const [isQuantityModal, setIsQuantityModal] = useState(false);
  const [isPriceModal, setIsPriceModal] = useState(false);
  const [isCommissionModal, setIsCommissionModal] = useState(false);
  const [isProductViewModal, setIsProductViewModal] = useState(false);
  const [isDiscountProductModal, setIsDiscountProductModal] = useState(false);
  const [isContactSearchModal, setIsContactSearchModal] = useState(false);
  const [isSalesOtherModal, setIsSalesOtherModal] = useState(false);
  const [isSalesCommentModal, setIsSalesCommentModal] = useState(false);
  const [isSalesChangeProductModal, setIsSalesChangeProductModal] = useState(false);
  const [isSalesChangeLotModal, setIsSalesChangeLotModal] = useState(false);
  const [typeOfClient, setTypeOfClient] = useState<ContactTypeToGet>(ContactTypeToGet.clients); // tipo de cliente a buscar en el endpoint
  const [clientNametoUpdate, setClientNametoUpdate] = useState<ContactNameOfOrder>(ContactNameOfOrder.client); // tipo de cliente a buscar en el endpoint
  const [isDiscountType, setIsDiscountType] = useState(0);
  const [rowToUpdate, setRowToUpdate] = useState<"comment" | "product">("comment"); // fila a actualizar del producto
  const [productSelected, setProductSelected] = useState([]) as any;
  const [typeOfPrice, setTypeOfPrice] = useState(1); // 1 normal
  const [isSalesSelectInvoiceType, setIsSalesSelectInvoiceType] = useState(false);
  const [typeOfSearch, setTypeOfSearch] = useState(false); // false: codigo, true: busqueda por nombre
  const { config, cashDrawer } = useContext(ConfigContext);
  const [configuration, setConfiguration] = useState([] as any); // configuraciones que vienen de config
  const modalSalesSpecial = useIsOpen(false);


  useEffect(() => {
    if (config?.configurations) {
      setConfiguration(extractActiveFeature(config.configurations))
      setTypeOfSearch(getConfigStatus("sales-by-name", config));
    }
    // eslint-disable-next-line
  }, [config]);


  const selectLastOrder = async () => {
    setIsLoading(true);
    try {
      const response = await getData(`order/select`);
      if (response?.data) {
        setProductsOfInvoice(response.data);
        setOrder(response.data.id);    
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };


  useEffect(() => {
     if (!isQuantityModal
      && !isContactSearchModal 
      && !isCommissionModal 
      && !isSalesCommentModal 
      && !isDiscountProductModal
      && !isSalesOtherModal
      && !isPriceModal
      && !isSalesChangeProductModal
      && !isSalesSelectInvoiceType
      && !modalSalesSpecial.isOpen
      && !isSalesChangeLotModal) {      
        (async () => await selectLastOrder())()
      }
    // eslint-disable-next-line
  }, [changeOrder, 
    isQuantityModal,
    isContactSearchModal,
    isCommissionModal, 
    isSalesCommentModal, 
    isDiscountProductModal, 
    isSalesOtherModal, 
    isPriceModal, 
    isSalesChangeProductModal, 
    isSalesSelectInvoiceType,
    modalSalesSpecial.isOpen,
    isSalesChangeLotModal]);


  const deleteProduct = async (iden: number) => {
    setIsSending(true);
    try {
      const response = await postData(`order/product/${iden}`, "DELETE");
      if (response.type === "successful") {
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
      const response = await postData(`order/${order}`, "DELETE");
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
      const response = await postData(`order/save/${order}`, "POST");
      toast.success(response.message);
      if (response.type !== "error") {
        resetOrder()
      }
    } catch (error) {
      console.error(error);
      toast.error("Ha ocurrido un error!");
    }
  };


  
  const saveAsQuote = async () => {
    if (!productsOfInvoice?.client) {
      toast.error("Debe seleccionar un cliente para usar esta función!");
      return
    }
    try {
      const response = await postData(`quotes/${order}`, "PUT");
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
      price_type: typeOfPrice, // tipo de precio del producto
      addOrSubtract: data.addOrSubtract ? data.addOrSubtract : 1, // 1 sumar 2 restar
      special: modalSalesSpecial.isOpen ? 1 : 0,
    };

    try {
      setIsSending(true);
      const response = await postData(`order`, "POST", values);
      if (response.type === "error") {
        toast.error(response.message);
        if(configuration?.includes("sales-sound")) errorSound()
      } else {
        if (order != response.data.id) setOrder(response.data.id);
        setProductsOfInvoice(response.data);
        if(configuration?.includes("sales-sound")) successSound()
      }
      if (response.type === "successful") {
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
      case OptionsClickOrder.pay: (() => { setIsPayModal(true) })();
        break;
      case OptionsClickOrder.save: saveOrder();
        break;
      case OptionsClickOrder.delete: deleteOrder();
        break;
      case OptionsClickOrder.discount: (() => { setIsDiscountProductModal(true); setIsDiscountType(2) })();
        break;
      case OptionsClickOrder.client: (() => { setIsContactSearchModal(true); setTypeOfClient(ContactTypeToGet.clients); setClientNametoUpdate(ContactNameOfOrder.client) })();
        break;
      case OptionsClickOrder.seller: (() => { setIsContactSearchModal(true); setTypeOfClient(ContactTypeToGet.employees); setClientNametoUpdate(ContactNameOfOrder.employee) })();
        break;
      case OptionsClickOrder.referred: (() => { setIsContactSearchModal(true); setTypeOfClient(ContactTypeToGet.referrals); setClientNametoUpdate(ContactNameOfOrder.referred) })();
        break;
      case OptionsClickOrder.delivery: (() => { setIsContactSearchModal(true); setTypeOfClient(ContactTypeToGet.employees); setClientNametoUpdate(ContactNameOfOrder.delivery) })();
        break;
      case OptionsClickOrder.otrasVentas: (() => { setIsSalesOtherModal(true); })();
        break;
      case OptionsClickOrder.documentType: (() => { setIsSalesSelectInvoiceType(true); })();
        break;
      case OptionsClickOrder.comment: (() => { setIsSalesCommentModal(true); })();
        break;
      case OptionsClickOrder.normalPrice: (() => { setTypeOfPrice(1); })();
        break;
      case OptionsClickOrder.wholesalerPrice : (() => { setTypeOfPrice(2); })();
        break;
      case OptionsClickOrder.promotionPrice: (() => { setTypeOfPrice(3); })();
        break;
      case OptionsClickOrder.quotes: saveAsQuote();
        break;
      case OptionsClickOrder.ventaSpecial: (() => { modalSalesSpecial.setIsOpen(true); })();
        break;
      default: ()=>{};
        break;
    }
  };


  const handleClickOptionProduct = (product: Product, option: OptionsClickSales) => { // opciones del producto
    switch (option) {
      case OptionsClickSales.delete: deleteProduct(product.id)
        break;
      case OptionsClickSales.plus: onSubmit({cod : product.cod})
        break;
      case OptionsClickSales.minus: onSubmit({cod : product.cod, addOrSubtract : 2})
        break;
      case OptionsClickSales.quantity: (() => { setProductSelected(product); setIsQuantityModal(true); })();
        break;
      case OptionsClickSales.discount: (() => { setProductSelected(product); setIsDiscountProductModal(true); setIsDiscountType(1); })();
        break;
      case OptionsClickSales.commisssion: (() => { setProductSelected(product); setIsCommissionModal(true); })();
        break;
      case OptionsClickSales.productView: (() => { setProductSelected(product); setIsProductViewModal(true); })();
        break;
      case OptionsClickSales.price: (() => { setProductSelected(product); setIsPriceModal(true); })();
        break;
      case OptionsClickSales.changeName: (() => { setRowToUpdate("product"); setProductSelected(product); setIsSalesChangeProductModal(true);  })();
        break;
      case OptionsClickSales.changeComment: (() => { setRowToUpdate("comment"); setProductSelected(product); setIsSalesChangeProductModal(true);  })();
        break;
      case OptionsClickSales.changeLot: (() => {  setProductSelected(product); setIsSalesChangeLotModal(true);  })();
        break;
    }
  };



  const closeModalDiscount  = () => {
    setIsDiscountProductModal(false);
    setProductSelected([]);
    setIsDiscountType(0)
  }

 
  const resetOrder = () =>{
    setProductsOfInvoice([]);
    setOrder(null);
    setIsPayModal(false)
    setChangeOrder(!changeOrder);
  }

  const handleChangeOrder = async (order: any) => {
    try {
      const response = await postData(`order/select/${order}`, "POST");
      if (response.type !== "error") {
        setProductsOfInvoice(response.data);
        setOrder(response.data.id);    
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
            <SalesSearchByName setTypeOfSearch={setTypeOfSearch} typeOfSearch={typeOfSearch} onSubmit={onSubmit}  /> 
            <SalesSearchByCode setTypeOfSearch={setTypeOfSearch} typeOfSearch={typeOfSearch} onFormSubmit={onSubmit} isLoading={isLoading} /> 
        <div className="relative z-0">
          <SalesQuickTable records={productsOfInvoice?.invoiceproducts} onClick={handleClickOptionProduct} config={configuration} />
          <SalesButtonsInitial onClick={handleClickOptionOrder} isShow={order ? false : true} config={configuration} />
        </div>
      </div>
      <div className="col-span-4 flex justify-center ">
        <div className="w-full mx-4">
          <SalesShowTotal isSending={isSending} records={productsOfInvoice} invoiceType={()=>setIsSalesSelectInvoiceType(true)} setPrice={handleClickOptionOrder} priceType={typeOfPrice} /> 
          <SalesShowOrders isShow={order ? false : true} order={order} onClick={handleChangeOrder} setPrice={handleClickOptionOrder} priceType={typeOfPrice} />
        </div>
        <div className="absolute bottom-2">
          <SalesButtons order={order} invoice={productsOfInvoice} onClick={handleClickOptionOrder} cashDrawer={cashDrawer} config={configuration} />
        </div>
      </div>
      <SalesQuantityModal isShow={isQuantityModal} order={order} product={productSelected} onClose={()=>setIsQuantityModal(false)} priceType={typeOfPrice} />
      <SalesPriceModal isShow={isPriceModal} order={order} product={productSelected} onClose={()=>setIsPriceModal(false)} />
      <SalesDiscountProductModal isShow={isDiscountProductModal} discountType={isDiscountType} order={productsOfInvoice} product={productSelected} onClose={()=>closeModalDiscount()} />
      <SalesContactSearchModal  isShow={isContactSearchModal} ContactTypeToGet={typeOfClient} order={productsOfInvoice} onClose={()=>setIsContactSearchModal(false)} clientToUpdate={clientNametoUpdate}  />
      <SalesOthers isShow={isSalesOtherModal} order={productsOfInvoice} onClose={()=>setIsSalesOtherModal(false)} />
      <SalesCommentModal isShow={isSalesCommentModal} order={productsOfInvoice} onClose={()=>setIsSalesCommentModal(false)} />
      <SalesChangeLotModal isShow={isSalesChangeLotModal} product={productSelected} onClose={()=>setIsSalesChangeLotModal(false)} />
      
      <SalesChangeProductModal isShow={isSalesChangeProductModal} order={order} product={productSelected} onClose={()=>setIsSalesChangeProductModal(false)} rowToUpdate={rowToUpdate} />
      
      <SalesSelectInvoiceTypeModal isShow={isSalesSelectInvoiceType} onClose={()=>setIsSalesSelectInvoiceType(false)} order={productsOfInvoice} />
      <SalesCommissionModal isShow={isCommissionModal} product={productSelected} onClose={()=>setIsCommissionModal(false)} />
      <SalesProductViewModal isShow={isProductViewModal} product={productSelected} onClose={()=>setIsProductViewModal(false)} />
      <SalesPayModal isShow={isPayModal} invoice={productsOfInvoice} onFinish={resetOrder} onClose={()=>setIsPayModal(false)} config={configuration} />
      <SalesEspecialProductsModal isShow={modalSalesSpecial.isOpen} onClose={()=>modalSalesSpecial.setIsOpen(false)} order={productsOfInvoice} handleClickOptionProduct={handleClickOptionProduct} searchType={typeOfSearch} onFormSubmit={onSubmit} onSubmit={onSubmit} isLoading={isLoading}/>
      <Toaster position="top-right" reverseOrder={false} />
    </div>
  );
}
