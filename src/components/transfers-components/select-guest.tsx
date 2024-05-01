'use client'
import { ListGroup } from "flowbite-react";
import { Loading } from "../loading/loading";
import { NothingHere } from "../nothing-here/nothing-here";
import Image from "next/image";
import { BiHomeAlt, BiHomeCircle } from "react-icons/bi";

interface SelectGuestProps {
  records?:  any;
  isLoading?:  boolean;
  isGuestSelected: (id: string[]) => void;
}

export function SelectGuest(props: SelectGuestProps) {
  const { records, isGuestSelected, isLoading } = props;


  if (isLoading) return <Loading />
  if (!records.data) return <NothingHere width="164" height="98" />;
  if (records.data.length == 0) return <NothingHere text="NO TIENES SUCURSALES ASIGNADAS" width="164" height="98" />;

  const listItems = records.data.map((record: any) => (
            <ListGroup.Item key={record.id} onClick={()=>isGuestSelected(record)}>
              <BiHomeCircle size={32} /><span className="ml-3 text-left font-semibold uppercase text-2xl">{ record?.to?.description }</span>
            </ListGroup.Item>
  ));


  return (
    <div  className="py-4 px-4 w-full p-2">
      <div className="m-3">Enviar a:</div>
      <ListGroup className="w-full">
        {listItems}
      </ListGroup>
    </div>);
}
