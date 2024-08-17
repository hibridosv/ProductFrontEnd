'use client'
import { numberToMoney } from "@/utils/functions";
import { ConfigContext } from "@/contexts/config-context";
import { useContext } from "react";

export interface CashShowTotalProps {
 records?: any;
}

export function CashShowTotal(props: CashShowTotalProps) {
  const { records } = props;
  const { systemInformation } = useContext(ConfigContext);



  if (!records?.data) return <></>
  if (records?.data.length == 0) return <></>


  const listItems = records.data.map((record: any) => (
    <div key={record.id} className="w-full my-4 shadow-neutral-600 shadow-lg rounded-md">
      <div className="flex justify-center pt-2 font-bold">{record?.bank}</div>
      <div className="flex justify-center text-3xl mb-4 pb-4 font-bold">{numberToMoney(record?.balance, systemInformation)}</div>
    </div>
  ));



  return (<div className="mx-4">
    {listItems}
   </div>);
}
