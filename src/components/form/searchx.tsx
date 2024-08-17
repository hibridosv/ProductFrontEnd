'use client'
import { useSearchTerm } from "@/hooks/useSearchTerm";
import { getData } from "@/services/resources";
import { numberToMoney } from "@/utils/functions";
import { useContext, useEffect, useRef, useState } from "react";
import { useDebouncedCallback } from 'use-debounce';
import { ConfigContext } from "@/contexts/config-context";


export interface SearchInputProps {
    placeholder?: string;
    recordSelected: (record: any) => void
}

export function SearchInput(props: SearchInputProps) {
  const { placeholder = "Buscar...", recordSelected } = props;
  const { searchTerm, handleSearchTerm } = useSearchTerm(["cod", "description"], 500);
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const inputSearch = useRef<any>();
  const { systemInformation } = useContext(ConfigContext);


  const debounced = useDebouncedCallback(
    (value) => { handleSearchTerm(value); }, 500,
    // The maximum time func is allowed to be delayed before it's invoked:
    { maxWait: 1000 }
  );

  const loadData = async () => {
    try {
      setIsLoading(true)
      const response = await getData(`products?sort=description&filterWhere[is_restaurant]==0${searchTerm}`);
      setProducts(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false)
    }
};

useEffect(() => {
    if (searchTerm && searchTerm.length > 3) {
        (async () => { await loadData() })();
    }
  // eslint-disable-next-line
}, [searchTerm]);
  

const handleNewProduct = () => {
  recordSelected({})
  setProducts([])
  handleSearchTerm("")
  if (inputSearch.current) {
    inputSearch.current.value = "";
    inputSearch.current.focus();
  }
}


const handleSelectedProduct = (product: any) => {
  recordSelected(product)
  setProducts([])
  handleSearchTerm("")
  if (inputSearch.current) {
    inputSearch.current.value = "";
    inputSearch.current.focus();
  }
}

// useEffect(() => {
//   inputSearch.current.focus();
// }, [searchTerm])

const listItems = products?.map((product: any):any => (
  <li key={product.id} onClick={()=>handleSelectedProduct(product.id)} className="flex justify-between p-3 hover:bg-blue-200 hover:text-blue-800 cursor-pointer">
  <div>
    {product.cod} | {product.description} 
    {product?.prices &&
    <span className="text-xs font-normal border border-slate-500 ml-3 shadow-md rounded-md px-1">{ numberToMoney(product?.prices[0]?.price ? product?.prices[0]?.price : 0, systemInformation) }</span>
    }
  </div>
      <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24"
          stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
      </svg>
  </li>
))



  return (
    <div>
        <label htmlFor="default-search" className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white" >
          Search
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <svg aria-hidden="true"  className={`w-5 h-5 text-gray-500 dark:text-gray-400 ${isLoading && ' animate-bounce'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" ></path>
            </svg>
          </div>
          <input
            type="text"
            id="search"
            className="block w-full p-4 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder={placeholder}
            autoComplete="off"
            required
            defaultValue={''}
            onChange={(e) => debounced(e.target.value)}
            ref={inputSearch}
          />
        </div>

        <div className="w-full bg-white rounded-lg shadow-lg mt-4">
              <ul className="w-full divide-y-2 divide-gray-400">
              { listItems }
              { listItems.length > 0 &&
                <li className="flex justify-between p-3 hover:bg-red-200 hover:text-red-800 cursor-pointer" onClick={handleNewProduct}>
                  CANCELAR
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24"
                        stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                </li>
              }
              </ul>
            </div>
    </div>
  );
}
