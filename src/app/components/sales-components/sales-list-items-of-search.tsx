'use client'
import { useEffect, useState } from "react";
import { SearchInput } from "../form/search";
import { getData } from "@/services/resources";
import { useSearchTerm } from "@/hooks/useSearchTerm";
import { Product } from "@/services/products";
import { NameIcon, SearchIcon } from "@/theme/svg";
import { getRandomInt } from "@/utils/functions";

export interface SalesListItemsOfSearchProps {
    typeOfSearch?: boolean; // tipo de busqueda
    setTypeOfSearch: (type: boolean)=>void;
    onSubmit: (product : Product) => void;
}

export function SalesListItemsOfSearch(props: SalesListItemsOfSearchProps){
const {  setTypeOfSearch, typeOfSearch, onSubmit } = props;
const [products, setProducts] = useState([]) as any;
const [randNumber, setrandNumber] = useState(0) as any;

const { searchTerm, handleSearchTerm } = useSearchTerm()


const loadDataProducts = async () => {
    try {
      const response = await getData(`search/products?sort=-created_at&perPage=7${searchTerm}`);
      setProducts(response.data);
    } catch (error) {
      console.error(error);
    }
};

useEffect(() => {
  if (searchTerm && !typeOfSearch) {
    (async () => { await loadDataProducts();})();   
  }
  if (searchTerm == "") {
    setProducts([]);
  }
  // eslint-disable-next-line
}, [searchTerm]);


const handleContactSelected = (product: Product) => {
  if (product) {
    onSubmit(product)
    setProducts([]);
    setrandNumber(getRandomInt(100));
  }
}

const cancelClick = () => {
    setProducts([]);
    handleSearchTerm("")
    setrandNumber(getRandomInt(100));
}


const listItems = products?.map((product: any):any => (
    <div key={product.id} onClick={()=>handleContactSelected(product)}>
        <li className="flex justify-between p-3 hover:bg-blue-200 hover:text-blue-800 cursor-pointer">
              {product.cod} | {product.description}
            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24"
                stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
        </li>
    </div>
))


return (
        <div className="m-2 flex justify-between">
        
            <div className="w-full bg-white rounded-lg shadow-lg z-0">
            <SearchInput handleSearchTerm={handleSearchTerm} placeholder="Ingrese el nombre del producto" randNumber={randNumber} />
                <ul className="divide-y-2 divide-gray-400">
                { listItems }
                { products && products.length > 0 && <div onClick={()=>cancelClick()}>
                    <li className="flex justify-between p-3 hover:bg-red-200 hover:text-red-800 cursor-pointer">
                        CANCELAR
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24"
                            stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                    </li>
                </div> }
                </ul>
            </div>

        <div className="mx-2 grid content-center cursor-pointer" onClick={()=>setTypeOfSearch(!typeOfSearch)}>{  typeOfSearch ? NameIcon : SearchIcon  }</div>
        </div>
    )

}