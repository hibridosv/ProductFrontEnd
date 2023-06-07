"use client"
import { NothingHere, ViewTitle } from "@/app/components";


export default function Config() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 pb-10">
           <div className="col-span-3">
             <ViewTitle text="OPCIONES Y CONFIGURACIONES" />
              <NothingHere />
         </div>
         <div>
         <ViewTitle text="BUSQUEDA" />
         </div>
   </div>
  )
}
