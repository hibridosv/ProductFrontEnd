'use client'

import { useEffect, useState } from "react";
import { ViewTitle } from "@/components"
import toast, { Toaster } from 'react-hot-toast';

export default function Page() {


  return (
    <div className="grid grid-cols-1 md:grid-cols-10 pb-10">
        <div className="col-span-7 border-r md:border-sky-600">
        <ViewTitle text="LISTADO DE PRODUCTOS" />


        </div>
        <div className="col-span-3">
        <ViewTitle text="OPCIONES" />

        </div>
      <Toaster position="top-right" reverseOrder={false} />
    </div>
  )
}
