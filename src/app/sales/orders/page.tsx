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
import { ShowPercentSalesType } from "@/components/restaurant/sales/show-percent-sales-type";
import { ClientsTables } from "@/components/restaurant/sales/clients-tables";
import { Tables } from "@/components/restaurant/sales/tables";
import { SalesDivideAccountModal } from "@/components/sales-components/sales-divide-account";
import { Deliverys } from "@/components/restaurant/sales/deliverys";
import { DeliverysLateral } from "@/components/restaurant/sales/deliverys-lateral";
import { DeliveryCancelBtn } from "@/components/restaurant/sales/deliverys-cancel-btn";
import { DeliveryClientInfo } from "@/components/restaurant/sales/deliverys-client-info";
import { SalesButtonsInitial } from "@/components/sales-components/sales-buttons-initial";


export default function ViewSales() {
      const { config, cashDrawer, systemInformation } = useContext(ConfigContext);
      const [isLoading, setIsLoading] = useState(false);
      const [isSending, setIsSending] = useState(false);
      const [order, setOrder] = useState([] as any); // orden que se obtiene
      const [ payedInvoice, setPayedInvoice ] = useState([] as any); // orden pagada para mostrar el modal de pago
      const [paymentType, setPaymentType] = useState(1); // Efectivo, Tarjeta, Otros
      const [deliveryType, setDeliveryType] = useState(2); // 1: Aqui, 2: Llevar, 3: delivery
      const [selectType, setSelectType] = useState(1); // 1: venta Rapida, 2: Servicio a mesa, 3: delivery
      const [clientActive, setClientActive] = useState(1); // Cliente seleccionado de la cuenta (numero de cliente)
      const [typeOfPrice, setTypeOfPrice] = useState(1); // 1 tipo de precio, 1: normal, 2: Promocion
      const [selectedTable, setSelectedTable] = useState(""); // Mesa seleccionada
      const [configuration, setConfiguration] = useState([] as any); // configuraciones que vienen de config
      const [isDiscountType, setIsDiscountType] = useState(0);
      const [productSelected, setProductSelected] = useState([]) as any;
      const [typeOfClient, setTypeOfClient] = useState<ContactTypeToGet>(ContactTypeToGet.clients); // tipo de cliente a buscar en el endpoint
      const [clientNametoUpdate, setClientNametoUpdate] = useState<ContactNameOfOrder>(ContactNameOfOrder.client); // tipo de cliente a buscar en el endpoint
      const [deliverySelected, setDeliverySelected] = useState([]) as any; // cliente temporal para el delivery (a quien se le lleva el pedido)
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
      const modalDivideAccount = useIsOpen(false);
      
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

      useEffect(() => { 
        if (selectType == 2) {
          setDeliveryType(1)
        } else {
          setDeliveryType(2)
        }
      }, [selectType]);


      const selectLastOrder = async () => {
            setIsLoading(true);
            try {
              const response = await getData(`sales/order/select`);
              if (response?.data) {
                setOrder(response.data);   
                setSelectType(response?.data?.order_type) 
                setSelectedTable(response?.data?.attributes?.restaurant_table_id)
                setDeliveryType(response?.data?.delivery_type)
                setClientActive(JSON.parse(response?.data?.attributes.clients)[0] ?? 1);
                if (response?.data?.order_type == 3) {
                  setDeliverySelected(response?.data?.client)
                }
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
              && !modalSalesSpecial.isOpen
              && !modalDivideAccount.isOpen) {
              (async () => await selectLastOrder())()
            }
            // eslint-disable-next-line
          }, [modalInvoiceType.isOpen, 
            modalDiscount.isOpen, 
            modalContact.isOpen, 
            modalOthers.isOpen, 
            modalComment.isOpen, 
            modalSalesSpecial.isOpen,
            modalDivideAccount.isOpen]);
          
          const resetOrder = () =>{
            if (order?.attributes?.clients) {
              setClientActive(JSON.parse(order.attributes.clients)[0]);
            } else {
              setClientActive(1);
            }
            setOrder([]);
            setSelectedTable("");
            setDeliverySelected([])
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
        setIsLoading(true);
        try {
              const response = await postData(`sales/order/select/${order}`, "POST");
              if (response.data) {
                setOrder(response.data);
                setSelectType(response?.data?.order_type);
                setDeliveryType(response?.data?.delivery_type);
                setSelectedTable(response?.data?.attributes?.restaurant_table_id)
                setClientActive(JSON.parse(response?.data?.attributes?.clients)[0] ?? 1);
                if (response?.data?.order_type == 3) {
                  setDeliverySelected(response?.data?.client)
                }
              } else {
                toast.error(response.message);
                resetOrder();
              }
            } catch (error) {
              console.error(error);
              toast.error("Ha ocurrido un error desconocido!");
            } finally {
              setIsLoading(false);
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
              delivery_client: deliverySelected ? deliverySelected?.id : null, // id del cliente delivery
              order_type: selectType, // 1. rapida, 2. Mesas, 3. Delivery
              price_type: typeOfPrice, // tipo de precio del producto
              clients_quantity: 1, // Numero de clientes
              client_active: clientActive, // Cliente activo para asignar producto
              quantity,
              restaurant_table_id: selectedTable,
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
          
          const saveOrder = async () => {
            setIsLoading(true);
            try {
              const response = await postData(`sales/order/save/${order.id}`, "POST");
              toast.success(response.message);
              if (response.type !== "error") {
                resetOrder()
              }
            } catch (error) {
              console.error(error);
              toast.error("Ha ocurrido un error!");
            } finally {
              setIsLoading(false);
            }
          };

          const orderAddOtherClient = async () => {
            try {
              const response = await postData(`restaurant/sales/add-client/${order.id}`, "PUT");
              if (response.type !== "error") {
                toast.success("cliente Agregado");
                setOrder(response.data)
              }
            } catch (error) {
              console.error(error);
              toast.error("Ha ocurrido un error!");
            }
          };

          const handleClickOptionOrder = (option: OptionsClickOrder) => { // opciones de la orden
            switch (option) {
              case OptionsClickOrder.save: (() => saveOrder())();
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
                  case OptionsClickOrder.divideAccount: (() => { modalDivideAccount.setIsOpen(true); })();
                  break;
                  case OptionsClickOrder.addClientTable: (() => { orderAddOtherClient() })();
                  break;
                  case OptionsClickOrder.printPreAccount: (() => { setOrderPrinter(true) })();
                  break;
                  default: ()=>{};
                  break;
                }
              };
              
              
              const handleClickOptionProduct = (product: Product, option: OptionsClickSales, extra = null) => { // opciones del producto
                switch (option) {
                  case OptionsClickSales.delete: deleteProduct(product.cod)
                  break;
                  case OptionsClickSales.discount: (() => { setProductSelected(product); modalDiscount.setIsOpen(true); setIsDiscountType(1); })();
                break;
                case OptionsClickSales.quantity: (() => { setProductSelected(product); modalQuantity.setIsOpen(true); })();
                break;
                case OptionsClickSales.selectClient: (() => { changeClientAtProduct(product.id, extra); })();
                break;
                default: ()=>{};
                break;
              }
      
            };
            

            const payOrder = async (cash: number, client_number = null) => {
              let values = {
              order_id: order?.id,
              payment_type: paymentType, // efectivo, tarjeta, transferencia, cheque, credito
              cash: cash,
              invoice_type_id: order?.invoice_type_id,
              client_active: clientActive, // Cliente activo para asignar producto
              client_number: client_number
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
              if (client_number) {
                modalDivideAccount.setIsOpen(false)
              }
            } catch (error) {
              console.error(error);
              toast.error("Ha Ocurrido un Error!");
            } finally {
              setIsSending(false);
            }
          };
          

          const setOrderPrinter = async (withOrder = false) => {
            try {
              const response = await postData(`restaurant/sales/printer/${order.id}`, "PUT", { with_order: withOrder });
              if (response.data) {
                setOrder(response.data)
                if (withOrder) {
                  toast.success("Imprimiendo pre cuenta");
                }
              }
            } catch (error) {
              console.error(error);
              toast.error("Ha ocurrido un error!");
            } 
          };

          const changeClientAtProduct = async (product: any, client: any) => {
            try {
              const response = await postData(`restaurant/sales/product/change/${product}/${client}`, "PUT");
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
            <DeliveryClientInfo isShow={selectType == 3 && deliverySelected?.id} deliveryInfo={deliverySelected} onClick={()=>modalContact.setIsOpen(true)} order={order} />
            <ClientsTables isShow={selectType == 2 && selectedTable != ""} order={order} clientActive={clientActive} setClientActive={setClientActive} isLoading={isLoading}  />
            <IconsMenu isShow={selectType == 1 || (selectType == 2 && selectedTable != "") || order?.invoiceproducts || (selectType == 3 && deliverySelected?.id)} selectedIcon={sendProduct} config={configuration} isSending={isSending || isLoading} />
            <Tables isShow={selectType == 2 && selectedTable === ""} setSelectedTable={setSelectedTable} order={order} handleChangeOrder={handleChangeOrder} />
            <Deliverys isShow={selectType == 3 && !deliverySelected?.id} onClick={handleChangeOrder} />
            </div>
            <div className="col-span-4 border-l md:border-sky-600">
                  <ServiceTypeSelect setDeliverySelected={setDeliverySelected} setSelectType={setSelectType} selectType={selectType} order={order} onClickOrder={handleClickOptionOrder} setSelectedTable={setSelectedTable} configuration={configuration} isSending={isSending}/>
                  <ProductsTable isShow={(selectType != 3)  || (selectType == 3 && deliverySelected?.id)} order={order} onClickOrder={handleClickOptionOrder} onClickProduct={handleClickOptionProduct} />
                  <DeliverysLateral isShow={selectType == 3 && !deliverySelected?.id} onClick={setDeliverySelected} />

                  <div className="flex justify-center">
                        <RestaurantShowTotal isShow={order?.invoiceproducts?.length > 0} order={order} isSending={isSending}  />
                  </div>  
                  <SalesButtonsRestaurant isShow={order?.invoiceproducts?.length > 0} cashDrawer={cashDrawer} payOrder={payOrder} onClickOrder={handleClickOptionOrder} order={order} payType={paymentType} config={configuration} isSending={isSending} selectType={selectType}/>
                  <OptionsSelect onClickOrder={handleClickOptionOrder} payType={paymentType} order={order} setOrder={setOrder} />
                  <ShowPercentSalesType order={order} config={configuration} />
                  <DeliveryCancelBtn isShow={selectType == 3 && deliverySelected?.id && !order?.invoiceproducts} onClick={setDeliverySelected} />
                  <SalesButtonsInitial onClick={handleClickOptionOrder} isShow={!order?.invoiceproducts && selectType == 1} />
            </div>
            <SalesDivideAccountModal onClickProduct={handleClickOptionProduct} isShow={modalDivideAccount.isOpen} order={order} onClose={()=>modalDivideAccount.setIsOpen(false)} isLoading={isLoading} cashDrawer={cashDrawer} payOrder={payOrder} payType={paymentType} config={configuration} isSending={isSending} selectType={selectType} />
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
