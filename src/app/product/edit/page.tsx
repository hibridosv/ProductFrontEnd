'use client'
import { useState, useEffect } from "react";
import { ViewTitle } from "@/app/components";
import { getData } from "../../../services/resources";
import { useSearchTerm } from "../../../hooks/useSearchTerm";
import Link from "next/link";
import { SearchInput } from "@/app/components/form/search";

export default function EditPage() {
    const { searchTerm, handleSearchTerm } = useSearchTerm()
    const [isLoading, setIsLoading] = useState(false);
    const [products, setProducts] = useState([]);


    const loadData = async () => {
        setIsLoading(true);
        try {
          const response = await getData(`products?sort=-created_at${searchTerm}`);
          setProducts(response.data);
        } catch (error) {
          console.error(error);
        } finally {
          setIsLoading(false);
        }
    };
      
  
    useEffect(() => {
        if (searchTerm) {
            (async () => { await loadData() })();
        }
      // eslint-disable-next-line
    }, [searchTerm]);

    const listItems = products?.map((product: any):any => (
      <Link key={product.id} href={`product/edit/${product.id}`}>
      <li className="flex justify-between p-3 hover:bg-blue-200 hover:text-blue-800">
      {product.cod} | {product.description}
          <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24"
              stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
      </li>
  </Link>
    ))

  return (
    <div className="m-4">
        <ViewTitle text="EDITAR PRODUCTO"  />
        <SearchInput handleSearchTerm={handleSearchTerm} placeholder="Buscar Producto" />
        <div className="w-full bg-white rounded-lg shadow-lg lg:w-2/3 mt-4">
          <ul className="divide-y-2 divide-gray-400">
          { listItems }
          </ul>
        </div>
    </div>
  );
}
