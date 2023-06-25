import { sumarTotales } from "@/utils/functions";

export interface SalesShowTotalProps {
 records?: any
 isSending?: boolean
}

export function SalesShowTotal(props: SalesShowTotalProps) {
  const { records, isSending } = props;
 

  if (!records) return <></>
  if (records.length == 0) return <></>

  const texStyle = isSending ? "flex justify-center text-7xl mb-4 text-gray-500" : "flex justify-center text-7xl mb-4"; 

  return (
  <div className='w-full my-4 shadow-neutral-600 border-cyan-600 border shadow-lg'>
        <div className="flex justify-center">TOTAL</div>
        <div className={texStyle}>$ { sumarTotales(records)}</div>
</div>);
}
