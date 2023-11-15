'use client'
import { ViewTitle } from "@/components";
import { Button, Preset } from "@/components/button/button";

export default function CreditPayablePage() {


  
  return (
    <div className="grid grid-cols-1 md:grid-cols-10 pb-10">
        <div className="col-span-7 border-r md:border-sky-600">
            <div className="flex justify-between">
              <ViewTitle text="CUENTAS POR COBRAR" />
              <span className=" m-4 text-2xl "><Button preset={Preset.add} text="Agregar" /></span>
              {/* <IoMdAddCircle size={32} className="col-span-11 m-4 text-2xl text-sky-900 clickeable" onClick={()=>console.log("nueva")} /> */}
            </div>


        </div>
        <div className="col-span-3">
            <ViewTitle text="RESUMEN" />

        </div>
    </div>
      );
}
