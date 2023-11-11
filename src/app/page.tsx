'use client'
import { API_URL } from '@/constants/index'
import { ViewTitle } from '../components'
import { PrincipalInfo } from '../components/dashboard/principal-info';
import { CharBarWeek } from '../components/dashboard/char-bar-week';
import { useState } from 'react';
import { AiOutlineCheck } from "react-icons/ai"
// import { CharPiePayment } from './components/dashboard/char-pie-payment';



export default function Home() {
  const [urlStorage, setUrlStorage] = useState(API_URL);


  return (
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
        {/* <div className='m-4 border-2 flex justify-center font-light text-sm '>TIPO DE PAGO</div>
        <div className='md:w-5/10 px-32 '>
          <CharPiePayment />
        </div> */}

        <div className='m-4 border-2 flex justify-center font-light text-sm'>Servidor Local: http://connect.test/ {urlStorage == "http://connect.test/api/" && <AiOutlineCheck  color='green' size="20" className='ml-3' />}</div>
        <div className='m-4 border-2 flex justify-center font-light text-sm'>Servidor Remoto: https://products.latam-pos.com/ {urlStorage == "https://products.latam-pos.com/api/" && <AiOutlineCheck color='green' size="20" className='ml-3' />}</div>
        {/* { urlStorage } */}
      </div>
    </div>
  
  
    )
}
