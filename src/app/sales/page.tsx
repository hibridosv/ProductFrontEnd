'use client'
import { ConfigContext } from '@/contexts/config-context';
import { useRouter } from 'next/navigation';
import { useContext, useMemo } from 'react';

export default function Home() {
  const router = useRouter();
  const { systemInformation } = useContext(ConfigContext);

  const tenantSystem = useMemo(() => systemInformation?.system?.tenant?.system, [systemInformation]);

  if (tenantSystem === 2 || tenantSystem === 4) {
    router.push("/sales/orders");
  } else {
    router.push("/sales/quick");
  }

  return <div></div>;
}