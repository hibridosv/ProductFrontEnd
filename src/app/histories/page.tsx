'use client'

import { ViewTitle } from "@/components"
import { Button, Preset } from "@/components/button/button"
import { DateRange, DateRangeValues } from "@/components/form/date-range"

export default function Page() {


    const handleFormSubmit = async (values: DateRangeValues) => {
        console.log(values)
      };


  return (
    <div className="grid grid-cols-1 md:grid-cols-10 pb-10">
        <div className="col-span-7 border-r md:border-sky-600">
            <div className="flex justify-between">
            <span className=" m-4 text-2xl "><Button preset={Preset.add} text="AGREGAR" onClick={()=>console.log(true)} /></span>
            </div>


        </div>
        <div className="col-span-3">
        <ViewTitle text="DETALLES" />

        <DateRange onSubmit={handleFormSubmit} />
        </div>
    </div>
  )
}
