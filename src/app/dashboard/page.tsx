'use client'
import { CharBarDay } from '@/components/dashboard-components/char-bar-day';
import { DashBoardIndex } from '@/components/dashboard-components/dashboard-index';

export default function Home() {


  return (
            <div>
              <DashBoardIndex />
              <div className='border-t-2 border-teal-500 m-4'>
                  <CharBarDay />
              </div>
            </div>
    )
}


