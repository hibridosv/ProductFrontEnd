"use client";
import { Brand } from "@/services/products";
import { Button, Preset } from "../button/button";

export interface ListBrandsProps {
  brands: Brand[];
  onDelete: (iden: string)=>void;
}

export function ListBrands(props: ListBrandsProps) {
  const { brands, onDelete } = props;

  return (
    <div className="w-full p-4">
      {brands.map((item: any) => (
        <div key={item.id}>
          <div className="grid grid-cols-12 border-y-2 bg-slate-100">
            <div className="col-span-10 m-1 ml-2 font-semibold"> {item.name.toUpperCase()} </div>
            <div className="col-span-2 m-1">
                <Button preset={Preset.smallClose} noText onClick={() => onDelete(item.id)}/>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
