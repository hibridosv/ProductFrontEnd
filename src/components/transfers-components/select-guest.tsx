'use client'
import { useState } from "react";
import { getPaymentTypeName, numberToMoney } from "@/utils/functions";
import { NothingHere } from "../nothing-here/nothing-here";
import { Button, Preset } from "../button/button";
import { DeleteModal } from "../modals/delete-modal";
import { Bill } from "@/services/Bills";
import { data } from "autoprefixer";
import Image from "next/image";

interface SelectGuestProps {
  records?:  any;
  isGuestSelected: (id: string[]) => void;
}

export function SelectGuest(props: SelectGuestProps) {
  const { records, isGuestSelected } = props;


  if (!records.data) return <NothingHere width="164" height="98" />;
  if (records.data.length == 0) return <NothingHere text="No se encontraron datos" width="164" height="98" />;

  const listItems = records.data.map((record: any) => (
    <div key={record.id} className="md:mx-6 mx-2 shadow-2xl shadow-slate-900 rounded-t-full clickeable" onClick={()=>isGuestSelected(record)}>
      <Image
          src="/img/home.png"
          alt="Guest"  width={168} height={168} priority={false} />
        <div className="flex justify-center uppercase font-bold text-lg text-cyan-600">{ record?.from?.name }</div>
        <div className="flex justify-center text-sm text-blue-600 mb-2">{ record?.from?.description }</div>
    </div>
  ));


  return (
    <div  className="flex justify-center py-4 px-4">
        {listItems}
    </div>);
}
