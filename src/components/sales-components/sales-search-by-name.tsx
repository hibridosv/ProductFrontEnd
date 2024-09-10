'use client'
import { Product } from "@/services/products";
import { NameIcon, SearchIcon } from "@/theme/svg";
import { SearchInputProduct } from "../form/search-product";

export interface SalesSearchByNameProps {
    typeOfSearch?: boolean; // tipo de busqueda
    setTypeOfSearch: (type: boolean)=>void;
    onSubmit: (product : Product) => void;
    showButton?: boolean;
}

export function SalesSearchByName(props: SalesSearchByNameProps){
const {  setTypeOfSearch, typeOfSearch, onSubmit, showButton = true } = props;

const handleProductSelected = (product: Product) => {
  if (product) {
    onSubmit(product)
  }
}


return (
        <div className="m-2 flex justify-between">
            <div className="w-full bg-white rounded-lg shadow-lg">
            <SearchInputProduct recordSelected={handleProductSelected} placeholder="Buscar Producto" 
            url="products?sort=description&filterWhere[status]==1&filterWhere[is_restaurant]==0&selected=id,cod,description,product_type&perPage=50" />
            </div>
        {
          showButton && <div className="mx-2 grid content-center cursor-pointer" onClick={()=>setTypeOfSearch(!typeOfSearch)}>{  typeOfSearch ? NameIcon : SearchIcon  }</div>
        }
        </div>
    )

}