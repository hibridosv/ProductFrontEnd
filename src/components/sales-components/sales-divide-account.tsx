'use client'
import { Modal } from "flowbite-react";
import { Button, Preset } from "../button/button";
import { ClientsTables } from "../restaurant/sales/clients-tables";
import { filterInvoiceProductsByClientNumber } from "@/utils/functions";
import { ProductsClientTable } from "../restaurant/sales/products-client-table";
import { useEffect, useState } from "react";
import { ProductsTable } from "../restaurant/sales/products-table";
import { RestaurantShowTotal } from "../restaurant/sales/show-total";
import { SalesButtonsRestaurant } from "../restaurant/sales/sales-buttons-restaurant";
import { OptionsSelect } from "../restaurant/sales/options-select";
import { OptionsClickOrder, PaymentType } from "@/services/enums";
import { SalesButtonsRestaurantMin } from "../restaurant/sales/sales-buttons-restaurant-min";

export interface SalesDivideAccountProps {
    onClose: () => void;
    isShow?: boolean;
    order: any; // arreglo de la orden
    isLoading?: boolean;


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
  config, isSending, cashDrawer, selectType } = props;

const [orderData, setOrderData] = useState<any>(order);
const [clientActive, setClientActive] = useState(1); // Cliente seleccionado de la cuenta

useEffect(() => {
    if (order && isShow) {
      setOrderData(filterInvoiceProductsByClientNumber(order, clientActive));
    }
}, [order, clientActive, isShow]);
console.log("orderData : ", orderData); 
console.log("order : ", order); 

return (
<Modal show={isShow} position="center" onClose={onClose} size="5xl">
  <Modal.Header>Dividir Cuenta</Modal.Header>
  <Modal.Body>
    <div className="mx-4">
            <ClientsTables isShow={isShow} order={order} clientActive={clientActive} setClientActive={setClientActive} isLoading={isLoading}  />
      <div className="flex justify-between mt-2">
        <div>
            <ProductsClientTable order={order} clientActive={clientActive} onClickProduct={()=>{}} />
        </div>
        <div>
            <ProductsTable order={orderData} onClickOrder={()=>{}} onClickProduct={()=>{}} blocked />
            <div className="flex justify-center">
                  <RestaurantShowTotal order={orderData} isSending={isLoading}  />
            </div>  
              <SalesButtonsRestaurantMin cashDrawer={cashDrawer} payOrder={payOrder} order={order} payType={payType} config={config} isSending={isSending} selectType={selectType} clientActive={clientActive} />
              <OptionsSelect onClickOrder={()=>{}} payType={payType} order={order} setOrder={()=>{}} />
        </div>
      </div>
    </div>
  </Modal.Body>
  <Modal.Footer className="flex justify-end">
    <Button onClick={onClose} preset={Preset.close}  /> 
  </Modal.Footer>
</Modal>)
}