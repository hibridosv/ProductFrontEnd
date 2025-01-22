'use client'
import { Modal } from "flowbite-react";
import { Button, Preset } from "../button/button";
import { ClientsTables } from "../restaurant/sales/clients-tables";
import { filterInvoiceProductsByClientNumber } from "@/utils/functions";
import { ProductsClientTable } from "../restaurant/sales/products-client-table";
import { useEffect, useState } from "react";
import { ProductsTable } from "../restaurant/sales/products-table";
import { RestaurantShowTotal } from "../restaurant/sales/show-total";
import { OptionsSelect } from "../restaurant/sales/options-select";
import {  PaymentType } from "@/services/enums";
import { SalesButtonsRestaurantMin } from "../restaurant/sales/sales-buttons-restaurant-min";
import { NothingHere } from "../nothing-here/nothing-here";
import { Product } from "@/services/products";
import { OptionsClickSales } from "./sales-quick-table";

export interface SalesDivideAccountProps {
    onClose: () => void;
    isShow?: boolean;
    order: any; // arreglo de la orden
    isLoading?: boolean;

    onClickProduct: (product: Product, option: OptionsClickSales, extra: any)=>void
    payOrder: (cash: number) => void
    payType: PaymentType;
    config: string[];
    isSending:boolean;
    cashDrawer?: boolean;
    selectType: number;
}

export function SalesDivideAccountModal(props: SalesDivideAccountProps){
const { 
  onClose, isShow, order, isLoading, payOrder, payType, 
  config, isSending, cashDrawer, selectType, onClickProduct } = props;

const [orderData, setOrderData] = useState<any>(order);
const [clientActive, setClientActive] = useState(0); // Cliente seleccionado de la cuenta (en este modal) 

useEffect(() => {
    if (order && isShow) {
      setOrderData(filterInvoiceProductsByClientNumber(order, clientActive));
    }
}, [order, clientActive, isShow]);


useEffect(() => {
  if (isShow) {
      setClientActive(JSON.parse(order?.attributes.clients)[0]);
  }
}, [isShow, order?.attributes]);

return (
<Modal show={isShow} position="center" onClose={onClose} size="5xl">
  <Modal.Header>Dividir Cuenta</Modal.Header>
  <Modal.Body>
    <div className="mx-4">
            <ClientsTables isShow={isShow} order={order} clientActive={clientActive} setClientActive={setClientActive} isLoading={isLoading}  />
      <div className="flex justify-between mt-2">
        <div>
          {
            clientActive > 0 ?
            <ProductsClientTable order={order} clientActive={clientActive} onClickProduct={onClickProduct} />
            :
            <NothingHere text="Seleccione un cliente" />
          }
        </div>
        { orderData?.invoiceproducts?.length > 0 ?
        <div>
            <ProductsTable order={orderData} onClickOrder={()=>{}} onClickProduct={()=>{}} blocked />
            <div className="flex justify-center">
                  <RestaurantShowTotal order={orderData} isSending={isLoading}  />
            </div>  
              <SalesButtonsRestaurantMin cashDrawer={cashDrawer} payOrder={payOrder} order={order} payType={payType} config={config} isSending={isSending} selectType={selectType} clientActive={clientActive} />
              <OptionsSelect onClickOrder={()=>{}} payType={payType} order={order} setOrder={()=>{}} />
        </div> :
        <div>
          <NothingHere text="Sin productos que cobrar" />
        </div>
      }
      </div>
    </div>
  </Modal.Body>
  <Modal.Footer className="flex justify-end">
    <Button onClick={onClose} preset={Preset.close}  /> 
  </Modal.Footer>
</Modal>)
}