import { OptionsClickOrder, PaymentType, PaymentTypeNames } from "@/services/enums";
import { postData } from "@/services/resources";
import { getPaymentTypeName } from "@/utils/functions";

export interface OptionsSelectProps {
  onClickOrder: (option: OptionsClickOrder)=>void
  payType: PaymentType;
  order?: any;
  setOrder: (order: any)=>void
}

export function deliveryTypeRestaurant(type: number) {
    switch (type) {
      case 1: return "Comer Aqui";
      case 2: return "Para Levar";
      case 3: return "Delivery";
    }
}

export function OptionsSelect(props: OptionsSelectProps) {
  const { onClickOrder, payType, order, setOrder } = props;

  if (!order?.invoiceproducts) return <></>
  if (order?.invoiceproducts.length == 0) return <></>

  const updateDeliveryType = async () => {
    let values = {
      order_id: order?.id,
      delivery_type: order?.delivery_type == 1 ? 2 : 1, 
    };
    try {
      const response = await postData(`restaurant/sales/update/delivery`, "PUT", values);
      if (response.data) {
        setOrder(response.data)
      }
    } catch (error) {
      console.error(error);
    }
  };

      return (
            <div>
              <div className="flex justify-around w-full h-7 shadow-md">
                <div className="w-full font-medium clickeable bg-gray-200 items-center text-center border-r-2" onClick={updateDeliveryType}>
                  { deliveryTypeRestaurant(order?.delivery_type) }
                </div>
                <div className="w-full font-medium clickeable bg-sky-200 items-center text-center" onClick={()=>onClickOrder(OptionsClickOrder.documentType)}>
                  { order?.invoice_assigned?.name }
                </div>
                <div className="w-full font-medium clickeable bg-gray-200 items-center text-center border-l-2" onClick={()=> onClickOrder(OptionsClickOrder.payType)}>
                  {getPaymentTypeName(payType)}
                </div>
            </div>
            </div>
  );

}
