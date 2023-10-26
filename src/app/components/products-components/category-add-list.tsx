"use client";
import { useState, useEffect } from "react";
import { getData, postData } from "@/services/resources";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Loading } from "../loading/loading";
import { ToggleSwitch } from "flowbite-react";
import { ViewTitle } from "../view-title/view-title";
import { Category } from "@/services/products";
import { Button, Preset } from "../button/button";


export interface CategoryAddListProps {
  option: number;
}

export function CategoryAddList(props: CategoryAddListProps) {
  const { option } = props;
  const [ categorys, setCategorys ] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(false);


  const loadCategories = async () => {
    setIsLoading(true);
    try {
      const response = await getData(`categoriesfull`);
      setCategorys(response.data);
    } catch (error) {
        console.error(error);
    } finally {
        setIsLoading(false);
    }
};

useEffect(() => {
    if (option === 1) {
        (async () => { await loadCategories() })();
    }
    // eslint-disable-next-line
}, [option]);


const PrincipalCategories = categorys.filter(item => item.category_type === "1");
const SecondaryCategories = categorys.filter(item => item.category_type === "2");


console.log("Categorias: ", categorys);



if (option != 1) return null
if(isLoading) return <Loading />

  return (
<div className="grid grid-cols-1 md:grid-cols-4 pb-10">
      <div className="col-span-2">
        <ViewTitle text="AGREGAR CATEGORIAS"  />
          <div className="w-full px-4">
            Categoria
            <form action="">

            </form>
          </div>
      </div>
      <div className="col-span-2">
        <ViewTitle text="CATEGORIAS EXISTENTES" />
        <div className="w-full p-4">
        {categorys.map((item: any) => (
            <div key={item.id}>
                <div className='grid grid-cols-12 border-y-2 bg-slate-100' >
                    <div className='col-span-10 m-1 ml-2 font-semibold'>{item.name.toUpperCase()}</div>
                    <div className='col-span-2 m-1'>
                        {
                        item?.subcategories.length || item?.principal == 1? 
                        <Button preset={Preset.smallCloseDisable} noText disabled  /> : 
                        <Button preset={Preset.smallClose} noText onClick={() => console.log("click", item.id)}  />
                        }
                    </div>
                </div>
                {
                item?.subcategories.map((sub: any) => (
                    <div className='grid grid-cols-12 border-y-2' key={sub.id}>
                        <div className='col-span-10 m-1 ml-4 font-semibold'>- {sub.name.toUpperCase()}</div>
                        <div className='col-span-2 m-1'>
                        {
                        sub?.principal == 1 ? 
                        <Button preset={Preset.smallCloseDisable} noText disabled  /> : 
                        <Button preset={Preset.smallClose} noText onClick={() => console.log("click", sub.id)}  />
                        }
                        </div>
                    </div>
                ))
                }
            </div>
            ))}
        </div>
      </div>
      <ToastContainer />

    </div>
  );
}
