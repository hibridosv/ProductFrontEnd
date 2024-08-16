export interface ServiceTypeSelectProps {
  selectType: (image: string)=> void
}

export function ServiceTypeSelect(props: ServiceTypeSelectProps) {
  const { selectType } = props;

      return (
            <div>
              <div className="flex justify-around w-full h-7 shadow-md">
                <div className="w-full font-medium clickeable bg-amber-200 items-center text-center border-r-2">Delivery</div>
                <div className="w-full font-medium clickeable bg-lime-200 items-center text-center">Venta Rapida</div>
                <div className="w-full font-medium clickeable bg-cyan-200 items-center text-center border-l-2">Servicio Mesa</div>
            </div>
            </div>
  );

}
