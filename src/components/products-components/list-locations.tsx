"use client";
import { Button, Preset } from "../button/button";

export interface ListLocationsProps {
  locations: any;
  onDelete: (iden: string)=>void;
}

export function ListLocations(props: ListLocationsProps) {
  const { locations, onDelete } = props;

  return (
    <div className="w-full p-4">
      {locations.map((item: any) => (
        <div key={item.id}>
          <div className="grid grid-cols-12 border-y-2 bg-slate-100">
            <div className="col-span-10"> 
                <div className="m-1 ml-2 font-semibold">
                    {item.name.toUpperCase()}
                </div>
                <div className="ml-2 font-thin">
                    {item?.description}
                </div>
            </div>
            <div className="flex justify-items-center col-span-2 m-1">
              {item?.status == 1 ? (
                <Button preset={Preset.smallCloseDisable} noText disabled />
              ) : (
                <Button preset={Preset.smallClose} noText onClick={() => onDelete(item.id)}
                />
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
