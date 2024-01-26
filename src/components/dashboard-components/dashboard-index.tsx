
'use client'
import { CharBarWeek } from "./char-bar-week";
import { PrincipalInfo } from "./principal-info";
import { ViewTitle } from "../view-title/view-title";




export function DashBoardIndex(){
    return(
      <div className="grid grid-cols-1 md:grid-cols-10 pb-10">
      <div className="col-span-6 border-r md:border-sky-600">
        <ViewTitle text='PANEL PRINCIPAL' />
        <PrincipalInfo  />
      </div>
      <div className="col-span-4">
        <div className='m-4 border-2 flex justify-center font-light text-sm '>VENTAS DE LA SEMANA</div>
        <div className='w-full px-4'>
          <CharBarWeek />
        </div>

      </div>
    </div>
    );
}
