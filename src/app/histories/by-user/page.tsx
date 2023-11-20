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
        <ViewTitle text="HISTORIAL DE VENTAS" />



        </div>
        <div className="col-span-3">
        <ViewTitle text="SELECCIONAR FECHA" />

        <DateRange onSubmit={handleFormSubmit} />
        </div>
    </div>
  )
}
