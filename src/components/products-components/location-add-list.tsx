"use client";
import { NothingHere } from "../nothing-here/nothing-here";
import { ViewTitle } from "../view-title/view-title";


export interface LocationAddListProps {
  option: number;
  name: string;
}

export function LocationAddList(props: LocationAddListProps) {
  const { option, name } = props;


if (option != 5) return null

  return (<>
        <ViewTitle text={name} />
        <div className="grid grid-cols-1 md:grid-cols-4 pb-10">
            <div className="col-span-3">
              <NothingHere text="Caracteristica de Ubicaciones esta deshabilitada" color="red" />
            </div>
        </div>
        </>);
}
