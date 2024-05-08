'use client'
import { CharBarDay } from '@/components/dashboard-components/char-bar-day';
import { DashBoardIndex } from '@/components/dashboard-components/dashboard-index';
import { ConfigContext } from '@/contexts/config-context';
import { permissionExists } from '@/utils/functions';
import { useRouter } from 'next/navigation';
import { useContext, useEffect } from 'react';

export default function Home() {
  const router = useRouter();
  const { systemInformation } = useContext(ConfigContext);


  useEffect(() => {
      if (!permissionExists(systemInformation?.permission, 'dashboard')) {
        router.push("/sales/quick");
      }
    }, [router, systemInformation]);
  return (
            <div>
              <DashBoardIndex />
              <div className='border-t-2 border-teal-500 m-4'>
                  <CharBarDay />
              </div>
            </div>
    )
}


