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
    const { permission, system } = systemInformation || {};
    const tenantSystem = system?.tenant?.system;
  
    if (permission && !permissionExists(permission, 'dashboard')) {
      if (tenantSystem === 2 || tenantSystem === 4) {
        router.push("/sales");
      } else {
        router.push("/sales/quick");
      }
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


