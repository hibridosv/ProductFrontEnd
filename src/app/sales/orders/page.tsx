'use client'

import { useContext, useEffect, useState } from "react";

import { ServiceTypeSelect } from "@/components/restaurant/sales/service-type-select";
import { RestaurantShowTotal } from "@/components/restaurant/sales/show-total";
import toast, { Toaster } from 'react-hot-toast';
import { ConfigContext } from "@/contexts/config-context";
import { errorSound, extractActiveFeature, hasOptionsActive, successSound } from "@/utils/functions";
import { getData, postData } from "@/services/resources";
import { ContactNameOfOrder, ContactTypeToGet, OptionsClickOrder } from "@/services/enums";
import { OptionsClickSales } from "@/components/sales-components/sales-quick-table";
import { Product } from "@/services/products";
import { SalesButtonsRestaurant } from "@/components/restaurant/sales/sales-buttons-restaurant";
import { useIsOpen } from "@/hooks/useIsOpen";
import { PayFinishModal } from "@/components/restaurant/sales/pay-finish-modal";
import { SelectPayTypeModal } from "@/components/restaurant/sales/select-pay-type-modal";
import { OptionsSelect } from "@/components/restaurant/sales/options-select";
import { SalesSelectInvoiceTypeModal } from "@/components/sales-components/sales-select-invoice-type";
import { SalesDiscountProductModal } from "@/components/sales-components/sales-discount-modal";
import { SalesContactSearchModal } from "@/components/sales-components/sales-contact-search";
import { SalesOthers } from "@/components/sales-components/sales-others";
import { SalesCommentModal } from "@/components/sales-components/sales-comment";
import { SalesSetQuantityModal } from "@/components/restaurant/sales/sales-set-quantity-modal";
import { SelectOptionsModal } from "@/components/restaurant/sales/select-options-modal";
import { IconsMenu } from "@/components/restaurant/sales/icons-menu";
import { ProductsTable } from "@/components/restaurant/sales/products-table";
import { SalesContactSearchGtModal } from "@/components/restaurant/sales/sales-contact-search-gt";
import { SalesEspecialModal } from "@/components/restaurant/sales/sales-special";


export default function ViewSales() {
      const [isLoading, setIsLoading] = useState(false);
      const [isSending, setIsSending] = useState(false);
      const [order, setOrder] = useState([] as any); // orden que se obtiene
      const [ payedInvoice, setPayedInvoice ] = useState([] as any); // orden pagada para mostrar el modal de pago
      const [paymentType, setPaymentType] = useState(1); // Efectivo, Tarjeta, Otros
      const [deliveryType, setDeliveryType] = useState(2); // 1: Aqui, 2: Llevar, 3: delivery
      const [clientActive, setClientActive] = useState(1); // Cliente seleccionado de la cuenta
      const [typeOfPrice, setTypeOfPrice] = useState(1); // 1 tipo de precio, 1: normal, 2: Promocion
      const { config, cashDrawer, systemInformation } = useContext(ConfigContext);
      const [configuration, setConfiguration] = useState([] as any); // configuraciones que vienen de config
      const [isDiscountType, setIsDiscountType] = useState(0);
      const [productSelected, setProductSelected] = useState([]) as any;
      const [typeOfClient, setTypeOfClient] = useState<ContactTypeToGet>(ContactTypeToGet.clients); // tipo de cliente a buscar en el endpoint
      const [clientNametoUpdate, setClientNametoUpdate] = useState<ContactNameOfOrder>(ContactNameOfOrder.client); // tipo de cliente a buscar en el endpoint
      const modalPayed = useIsOpen(false);
      const modalPaymentsType = useIsOpen(false);
      const modalInvoiceType = useIsOpen(false);
      const modalDiscount = useIsOpen(false);
      const modalContact = useIsOpen(false);
      const modalOthers = useIsOpen(false);
      const modalComment = useIsOpen(false);
      const modalQuantity = useIsOpen(false);
      const modalContactGt = useIsOpen(false);
      const modalSalesSpecial = useIsOpen(false);

      useEffect(() => {
            if (config?.configurations) {
                  setConfiguration(extractActiveFeature(config.configurations));
            }
      // eslint-disable-next-line
      }, [config]);

      useEffect(() => {
        if(configuration?.includes("sales-quick-here")) setDeliveryType(1)
      // eslint-disable-next-line
      }, [configuration]);


      const selectLastOrder = async () => {
            setIsLoading(true);
            try {
              const response = await getData(`sales/order/select`);
              if (response?.data) {
                setOrder(response.data);    
                if(configuration?.includes("sales-sound")) successSound()
              }
            } catch (error) {
              console.error(error);
            } finally {
              setIsLoading(false);
            }
          };
        
          
          useEffect(() => {
            if (!modalInvoiceType.isOpen 
              && !modalDiscount.isOpen 
              && !modalContact.isOpen 
              && !modalOthers.isOpen 
              && !modalComment.isOpen 
              && !modalSalesSpecial.isOpen) {
              (async () => await selectLastOrder())()
            }
            // eslint-disable-next-line
          }, [modalInvoiceType.isOpen, 
            modalDiscount.isOpen, 
            modalContact.isOpen, 
            modalOthers.isOpen, 
            modalComment.isOpen, 
            modalSalesSpecial.isOpen]);
          
          const resetOrder = () =>{
            setOrder([]);
          }
          const onFinish = () => {
            setPayedInvoice([]);
            modalPayed.setIsOpen(false)
          }
          
      const closeModalDiscount  = () => {
        modalDiscount.setIsOpen(false);
        setProductSelected([]);
        setIsDiscountType(0)
      }
      
      const handleChangeOrder = async (order: any) => {
        try {
              const response = await postData(`sales/order/select/${order}`, "POST");
              if (response.type !== "error") {
                setOrder(response.data);
              } else {
                toast.error(response.message);
              }
            } catch (error) {
              console.error(error);
              toast.error("Ha ocurrido un error!");
            }
          };
          
          const sendProduct = async (producId: any, quantity = 1) => {
            if (!producId){
              toast.error("Error en el codigo!");
              return
            }
            let values = {
              product_id: producId,
              request_type: 1, // 1: id, 2: cod
              delivery_type: deliveryType, // 1: Aqui, 2: Llevar, 3: delivery
              order_type: 1, // venta, consignacion, ecommerce
              price_type: typeOfPrice, // tipo de precio del producto
              clients_quantity: 1, // Numero de clientes
              client_active: clientActive, // Cliente activo para asignar producto
              quantity,
              special: modalSalesSpecial.isOpen ? 1 : 0,
            };
            
            try {
              setIsSending(true);
              const response = await postData(`restaurant/sales`, "POST", values);
              if (response.type === "error") {
                toast.error(response.message);
                    if(configuration?.includes("sales-sound")) errorSound()
                } else {
                  setOrder(response.data)
                  if(configuration?.includes("sales-sound")) successSound()
                  }
              } catch (error) {
                console.error(error);
                toast.error("Ha Ocurrido un Error!");
              } finally {
                setIsSending(false);
              }
                
          }
              
          const deleteOrder = async () => {
              try {
                const response = await postData(`sales/order/${order.id}`, "DELETE");
                toast.success(response.message);
                if (response.type == "successful") {
                  resetOrder()
                }
              } catch (error) {
                console.error(error);
                toast.error("Ha ocurrido un error!");
              }
            };
          
          const deleteProduct = async (iden: string) => {
            setIsSending(true);
            try {
              const response = await postData(`restaurant/sales/product/${iden}/${order.id}`, "DELETE");
              if (response.data) {
                setOrder(response.data)
                toast.success("Producto Eliminado");
                if(configuration?.includes("sales-sound")) successSound()
                } else {
              if (response.type === "error") {
                toast.error(response.message);
              } else {
                resetOrder()
              }
            }
          } catch (error) {
            console.error(error);
            toast.error("Ha ocurrido un error!");
          } finally {
              setIsSending(false);
            }
          };
          
          const handleClickOptionOrder = (option: OptionsClickOrder) => { // opciones de la orden
            switch (option) {
              case OptionsClickOrder.save: (() => { })();
                  break;
                  case OptionsClickOrder.delete: (() => { deleteOrder() })();
                  break;
                  case OptionsClickOrder.payType: (() => { modalPaymentsType.setIsOpen(true) })();
                  break;
                  case OptionsClickOrder.documentType: (() => { modalInvoiceType.setIsOpen(true); })();
                  break;
                  case OptionsClickOrder.setPrinter: (() => { setOrderPrinter(); })();
                  break;
                  case OptionsClickOrder.discount: (() => { modalDiscount.setIsOpen(true); setIsDiscountType(2) })();
                  break;     
                  case OptionsClickOrder.client: (() => { modalContact.setIsOpen(true); setTypeOfClient(ContactTypeToGet.clients); setClientNametoUpdate(ContactNameOfOrder.client) })();
                  break;
                  case OptionsClickOrder.seller: (() => { modalContact.setIsOpen(true); setTypeOfClient(ContactTypeToGet.employees); setClientNametoUpdate(ContactNameOfOrder.employee) })();
                  break; 
                  case OptionsClickOrder.referred: (() => { modalContact.setIsOpen(true); setTypeOfClient(ContactTypeToGet.referrals); setClientNametoUpdate(ContactNameOfOrder.referred) })();
                  break;
                  case OptionsClickOrder.delivery: (() => { modalContact.setIsOpen(true); setTypeOfClient(ContactTypeToGet.employees); setClientNametoUpdate(ContactNameOfOrder.delivery) })();
                  break;
                  case OptionsClickOrder.otrasVentas: (() => { modalOthers.setIsOpen(true); })();
                  break;
                  case OptionsClickOrder.comment: (() => { modalComment.setIsOpen(true); })();
                  break;
                  case OptionsClickOrder.sendNit: (() => { modalContactGt.setIsOpen(true); })();
                  break;
                  case OptionsClickOrder.ventaSpecial: (() => { modalSalesSpecial.setIsOpen(true); })();
                  break;
                  default: ()=>{};
                  break;
                }
              };
              
              
              const handleClickOptionProduct = (product: Product, option: OptionsClickSales) => { // opciones del producto
                switch (option) {
                  case OptionsClickSales.delete: deleteProduct(product.cod)
                  break;
                  case OptionsClickSales.discount: (() => { setProductSelected(product); modalDiscount.setIsOpen(true); setIsDiscountType(1); })();
                break;
                case OptionsClickSales.quantity: (() => { setProductSelected(product); modalQuantity.setIsOpen(true); })();
                break;
                default: ()=>{};
                break;
              }
      
            };
            

            const payOrder = async (cash: number) => {
              let values = {
              order_id: order?.id,
              payment_type: paymentType, // efectivo, tarjeta, transferencia, cheque, credito
              cash: cash,
              invoice_type_id: order?.invoice_type_id,
              client_active: clientActive // Cliente activo para asignar producto
            };
            try {
              setIsSending(true);
              setPayedInvoice(order);
              modalPayed.setIsOpen(true)
              const response = await postData(`restaurant/sales`, "PUT", values);
              if (response.type === 'successful') {
                setPayedInvoice(response.data);
                resetOrder()
              } else {
                toast.error(response.message);
              }
            } catch (error) {
              console.error(error);
              toast.error("Ha Ocurrido un Error!");
            } finally {
              setIsSending(false);
            }
          };
          

          const setOrderPrinter = async () => {
            try {
              const response = await postData(`restaurant/sales/printer/${order.id}`, "PUT");
              if (response.data) {
                setOrder(response.data)
              }
            } catch (error) {
              console.error(error);
              toast.error("Ha ocurrido un error!");
            } 
          };


          const updateProductOption = async (data: any) => {
            try {
                const response = await postData(`restaurant/sales/option`, 'PUT', data);
                if (response.data) {
                  setOrder(response.data)
                  if(configuration?.includes("sales-sound")) successSound()
                }
              } catch (error) {
                console.error(error);
                toast.error("Ha ocurrido un error!");
              } 
          }
       

          return (
            <div className="grid grid-cols-1 md:grid-cols-10 pb-10">
            <div className="col-span-6 border-r md:border-sky-600">
                  <IconsMenu isShow={true} selectedIcon={sendProduct} config={configuration} isSending={isSending} />
            </div>
            <div className="col-span-4 border-l md:border-sky-600">
                  <ServiceTypeSelect selectType={()=>{}} />
                  <ProductsTable order={order} onClickOrder={handleClickOptionOrder} onClickProduct={handleClickOptionProduct} />


                  <div className="flex justify-center">
                        <RestaurantShowTotal order={order} isSending={isSending}  />
                  </div>  
                  <SalesButtonsRestaurant cashDrawer={cashDrawer} payOrder={payOrder} onClickOrder={handleClickOptionOrder} order={order} payType={paymentType} config={configuration} isSending={isSending} />
                  <OptionsSelect onClickOrder={handleClickOptionOrder} payType={paymentType} order={order} setOrder={setOrder} />
            </div>
            <SalesSelectInvoiceTypeModal isShow={modalInvoiceType.isOpen} onClose={()=>modalInvoiceType.setIsOpen(false)} order={order} />
            <SalesDiscountProductModal isShow={modalDiscount.isOpen} discountType={isDiscountType} order={order} product={productSelected} onClose={()=>closeModalDiscount()} byCode />
            <SelectPayTypeModal isShow={modalPaymentsType.isOpen} onClose={()=>modalPaymentsType.setIsOpen(false)} payments={systemInformation?.payMethods} setPayment={setPaymentType} />
            <SalesContactSearchModal handleChangeOrder={handleChangeOrder}  isShow={modalContact.isOpen} ContactTypeToGet={typeOfClient} order={order} onClose={()=>modalContact.setIsOpen(false)} clientToUpdate={clientNametoUpdate}  />
            <SalesOthers isShow={modalOthers.isOpen} order={order} onClose={()=>modalOthers.setIsOpen(false)} />
            <SalesCommentModal isShow={modalComment.isOpen} order={order} onClose={()=>modalComment.setIsOpen(false)} />
            <SalesSetQuantityModal isShow={modalQuantity.isOpen} onClose={()=>modalQuantity.setIsOpen(false)} product={productSelected} sendProduct={sendProduct} />
            <SelectOptionsModal selectOption={updateProductOption} isShow={hasOptionsActive(order)}  order={order} isSending={isSending} />
            <PayFinishModal isShow={modalPayed.isOpen} onClose={onFinish} invoice={payedInvoice} isSending={isSending} />
            <SalesContactSearchGtModal isShow={modalContactGt.isOpen} onClose={()=>modalContactGt.setIsOpen(false)} setOrder={setOrder} order={order} onOpenContact={()=>modalContact.setIsOpen(true)} />
            <SalesEspecialModal isShow={modalSalesSpecial.isOpen} onClose={()=>modalSalesSpecial.setIsOpen(false)} setOrder={setOrder} order={order} 
            config={configuration} handleClickOptionProduct={handleClickOptionProduct} sendProduct={sendProduct} />
          <Toaster position="top-right" reverseOrder={false} />
            
      </div>
      );
}
