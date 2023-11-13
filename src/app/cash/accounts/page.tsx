'use client'
import { ViewTitle } from "@/components";


export default function AccountsPage() {

  return (
    <div className="grid grid-cols-1 md:grid-cols-10 pb-10">
        <div className="col-span-4 border-r md:border-sky-600">
            <ViewTitle text="INGRESAR REMESA" />

        </div>
        <div className="col-span-6">
            <ViewTitle text="LISTADO DE REMESAS" />

        </div>
    </div>
      );
}
