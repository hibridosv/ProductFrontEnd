'use client'
import { useEffect, useState } from "react";
import { SearchInput } from "../form/search";
import { getData } from "@/services/resources";
import { useSearchTerm } from "@/hooks/useSearchTerm";
import { Product } from "@/services/products";
import { NameIcon, SearchIcon } from "@/theme/svg";
import { getRandomInt } from "@/utils/functions";

export interface SalesSearchByNameProps {
    typeOfSearch?: boolean; // tipo de busqueda
    setTypeOfSearch: (type: boolean)=>void;
    onSubmit: (product : Product) => void;
    showButton?: boolean;
}

export function SalesSearchByName(props: SalesSearchByNameProps){
const {  setTypeOfSearch, typeOfSearch, onSubmit, showButton = true } = props;
const [products, setProducts] = useState([]) as any;
const [randNumber, setrandNumber] = useState(0) as any;

const { searchTerm, handleSearchTerm } = useSearchTerm(["cod", "description"], 500);


const loadDataProducts = async () => {
    try {
      const response = await getData(`search/products?sort=-created_at&perPage=7${searchTerm}`);
      setProducts(response.data);
    } catch (error) {
      console.error(error);
    }
};

useEffect(() => {
  if (searchTerm && typeOfSearch) {
    (async () => { await loadDataProducts();})();   
  }
  if (searchTerm == "") {
    setProducts([]);
  }
  // eslint-disable-next-line
}, [searchTerm]);


const handleProductSelected = (product: Product) => {
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
        <li className="flex justify-between p-3 hover:bg-blue-200 hover:text-blue-800 cursor-pointer" key={product.id} onClick={()=>handleProductSelected(product)}>
              {product.cod} | {product.description}
            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24"
                stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
        </li>
))


return (
        <div className="m-2 flex justify-between">
            <div className="w-full bg-white rounded-lg shadow-lg">
            <SearchInput handleSearchTerm={handleSearchTerm} placeholder="Ingrese el nombre del producto" randNumber={randNumber} />
              { products.length > 0 &&
                <ul className="md:w-7/12 w-10/12 divide-y-2 mt-2 rounded-md divide-gray-400 absolute z-50 bg-white border border-cyan-700">
                { listItems }
                { products && products.length > 0 && 
                    <li className="flex justify-between p-3 hover:bg-red-200 hover:text-red-800 cursor-pointer" onClick={cancelClick}>
                        CANCELAR
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24"
                            stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                    </li> }
                </ul>
              }
            </div>
        {
          showButton && <div className="mx-2 grid content-center cursor-pointer" onClick={()=>setTypeOfSearch(!typeOfSearch)}>{  typeOfSearch ? NameIcon : SearchIcon  }</div>
        }
        </div>
    )

}