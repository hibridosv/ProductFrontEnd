import { OptionsClickOrder } from '@/services/enums';
import toast, { Toaster } from 'react-hot-toast';

export interface ServiceTypeSelectProps {
  setSelectType: (type: number)=> void
  selectType: number;
  order: any;
  configuration: any;
  onClickOrder: (option: OptionsClickOrder)=>void
  setSelectedTable: (table: string)=> void
  isSending?: boolean;

}

export function ServiceTypeSelect(props: ServiceTypeSelectProps) {
  const { setSelectType, selectType, order, configuration,  onClickOrder, setSelectedTable, isSending } = props;


  const countFeatures = () => {
    const features = [
      "restaurant-sales-delivery",
      "restaurant-sales-quick",
      "restaurant-sales-here"
    ];
    return features.filter(feature => configuration?.includes(feature)).length;
  }
  
  const featureCount = countFeatures();

  if (featureCount === 0) return <></>;

  const handleSelected = (option: number)=>{
    if (selectType == 1) {
      if(order?.invoiceproducts){
        toast.error("Debe facturar o eliminar la orden activa");
        return false;
      }
    }
    if (selectType == 2) {
      if(order?.invoiceproducts){
        onClickOrder(OptionsClickOrder.save)
      }
      setSelectedTable("");
    }
    if (selectType == 3) {
      if(order?.invoiceproducts){
        onClickOrder(OptionsClickOrder.save)
      }
      setSelectedTable("");
    }
    setSelectType(option)
  }

      return (
            <div>
              <div className="flex justify-around w-full h-7 shadow-md">
                { configuration?.includes("restaurant-sales-delivery") && 
                <div className={`w-full font-medium clickeable ${selectType == 3 ? 'bg-slate-200 text-black' : 'bg-slate-600 text-white'} items-center text-center`} 
                onClick={isSending ? ()=>{} : ()=>handleSelected(3)}>Delivery</div> 
                }
                { configuration?.includes("restaurant-sales-quick") && 
                <div className={`w-full font-medium clickeable ${selectType == 1 ? 'bg-slate-200 text-black' : 'bg-slate-600 text-white'} items-center text-center`} 
                onClick={isSending ? ()=>{} : ()=>handleSelected(1)}>Venta Rapida</div> 
                }
                { configuration?.includes("restaurant-sales-here") && 
                <div className={`w-full font-medium clickeable ${selectType == 2 ? 'bg-slate-200 text-black' : 'bg-slate-600 text-white'} items-center text-center`} 
                onClick={isSending ? ()=>{} : ()=>handleSelected(2)}>Servicio Mesa</div> 
                }
            </div>
          <Toaster position="top-right" reverseOrder={false} />
          </div>
  );

}
