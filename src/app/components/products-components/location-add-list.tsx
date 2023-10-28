"use client";
import { NothingHere } from "../nothing-here/nothing-here";


export interface LocationAddListProps {
  option: number;
}

export function LocationAddList(props: LocationAddListProps) {
  const { option } = props;


if (option != 5) return null

  return (
        <div className="grid grid-cols-1 md:grid-cols-4 pb-10">
            <div className="col-span-3">
              <NothingHere text="Caracteristica de Ubicaciones esta deshabilitada" color="red" />
            </div>
        </div>
  );
}
