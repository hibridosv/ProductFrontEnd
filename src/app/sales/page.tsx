'use client'
import { ConfigContext } from '@/contexts/config-context';
import { useRouter } from 'next/navigation';
import { useContext, useEffect } from 'react';

export default function Home() {
  const router = useRouter();
  const { systemInformation } = useContext(ConfigContext);


  useEffect(() => {
    const { system } = systemInformation || {};
    const tenantSystem = system?.tenant?.system;
      if (tenantSystem === 2 || tenantSystem === 4) {
        router.push("/sales/orders");
      } else {
        router.push("/sales/quick");
      }

  }, [router, systemInformation]);
  
  return (<div></div>)
}