import { OptionsClickOrder } from '@/services/enums';
import toast, { Toaster } from 'react-hot-toast';

export interface ServiceTypeSelectProps {
  setSelectType: (type: number)=> void
  selectType: number;
  order: any;
  onClickOrder: (option: OptionsClickOrder)=>void
  setSelectedTable: (table: string)=> void
}

export function ServiceTypeSelect(props: ServiceTypeSelectProps) {
  const { setSelectType, selectType, order, onClickOrder, setSelectedTable } = props;

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
    }
    setSelectType(option)
  }
      return (
            <div>
              <div className="flex justify-around w-full h-7 shadow-md">
                <div className={`w-full font-medium clickeable ${selectType == 3 ? 'bg-slate-200 text-black' : 'bg-slate-600 text-white'} items-center text-center border-r-2`} onClick={()=>handleSelected(3)}>Delivery</div>
                <div className={`w-full font-medium clickeable ${selectType == 1 ? 'bg-slate-200 text-black' : 'bg-slate-600 text-white'} items-center text-center`} onClick={()=>handleSelected(1)}>Venta Rapida</div>
                <div className={`w-full font-medium clickeable ${selectType == 2 ? 'bg-slate-200 text-black' : 'bg-slate-600 text-white'} items-center text-center border-l-2`} onClick={()=>handleSelected(2)}>Servicio Mesa</div>
            </div>
          <Toaster position="top-right" reverseOrder={false} />
          </div>
  );

}
