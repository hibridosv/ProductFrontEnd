'use client'
import { NothingHere } from "../nothing-here/nothing-here";
import Image from "next/image";

interface SelectGuestProps {
  records?:  any;
  isGuestSelected: (id: string[]) => void;
}

export function SelectGuest(props: SelectGuestProps) {
  const { records, isGuestSelected } = props;


  if (!records.data) return <NothingHere width="164" height="98" />;
  if (records.data.length == 0) return <NothingHere text="NO TIENES SUCURSALES ASIGNADAS" width="164" height="98" />;

  const listItems = records.data.map((record: any) => (
    <div key={record.id} className="md:mx-6 mx-2 shadow-2xl shadow-slate-900 rounded-t-full clickeable" onClick={()=>isGuestSelected(record)}>
      <Image
          src="/img/home.png"
          alt="Guest"  width={140} height={140} priority={false} />
        <div className="flex justify-center uppercase font-bold text-lg text-cyan-600">{ record?.to?.name }</div>
        <div className="flex justify-center text-sm text-blue-600 mb-2">{ record?.to?.description }</div>
    </div>
  ));


  return (
    <div  className="flex justify-center py-4 px-4">
        {listItems}
    </div>);
}
