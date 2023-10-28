"use client";
import { NothingHere } from "../nothing-here/nothing-here";


export interface AttributeAddListProps {
  option: number;
}

export function AttributeAddList(props: AttributeAddListProps) {
  const { option } = props;


if (option != 4) return null

  return (
        <div className="grid grid-cols-1 md:grid-cols-4 pb-10">
            <div className="col-span-3">
              <NothingHere text="La caracteristica Opciones esta deshabilitada" color="red" />
            </div>
        </div>
  );
}
