import { numberToMoney } from "@/utils/functions";

export interface CashShowTotalProps {
 records?: any;
 isSending?: boolean;
}

export function CashShowTotal(props: CashShowTotalProps) {
  const { records, isSending } = props;



  if (!records?.data) return <></>
  if (records?.data.length == 0) return <></>

  const texStyle = isSending ? "flex justify-center text-3xl mb-4 text-gray-500 animate-pulse" : "flex justify-center text-3xl mb-4"; 
  const listItems = records.data.map((record: any) => (
    <div key={record.id} className="w-full my-4 shadow-neutral-600 shadow-lg rounded-md">
      <div className="flex justify-center pt-2 font-bold">{record?.bank}</div>
      <div className={`${texStyle} pb-4 font-bold`}>{numberToMoney(record?.balance)}</div>
    </div>
  ));



  return (<div className="mx-4">
    {listItems}
   </div>);
}
