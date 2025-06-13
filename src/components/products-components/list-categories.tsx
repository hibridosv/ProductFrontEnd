"use client";
import { Category } from "@/services/products";
import { Button, Preset } from "../button/button";

export interface ListCategoriesProps {
  categories: Category[];
  onDelete: (iden: string)=>void;
}

export function ListCategories(props: ListCategoriesProps) {
  const { categories, onDelete } = props;

  return (
    <div className="w-full p-4">
      {categories.map((item: any) => (
        <div key={item.id}>
          <div className="grid grid-cols-12 border-y-2 bg-slate-100">
            <div className="col-span-10 m-1 ml-2 font-semibold"> {item.name.toUpperCase()} </div>
            <div className="col-span-2 m-1">
              {item?.subcategories.length || item?.principal == 1 ? (
                <Button preset={Preset.smallCloseDisable} noText disabled />
              ) : (
                <Button preset={Preset.smallClose} noText onClick={() => onDelete(item.id)}
                />
              )}
            </div>
          </div>
          {item?.subcategories.map((sub: any) =>{
            if (sub.is_restaurant == 1) return null; // Skip principal categories    
            return (
            <div className="grid grid-cols-12 border-y-2" key={sub.id}>
              <div className="col-span-10 m-1 ml-4 font-semibold"> - {sub.name.toUpperCase()} </div>
              <div className="col-span-2 m-1">
                {sub?.principal == 1 ? (
                  <Button preset={Preset.smallCloseDisable} noText disabled />
                ) : (
                  <Button preset={Preset.smallClose} noText onClick={() => onDelete(sub.id)}
                  />
                )}
              </div>
            </div>
          )
          } )}
        </div>
      ))}
    </div>
  );
}
