'use client'

import { useState, useEffect } from "react";
import { RightSideProducts, ViewTitle} from "@/components";
import { getData } from "@/services/resources";
import { ProductView } from "@/components/restaurant/product/product-view";
import { ModifierList } from "@/components/restaurant/product/modifier-list";
import { CategoriesList } from "@/components/restaurant/product/categories-list";
import { usePagination } from "@/components/pagination";
import { useSearchTerm } from "@/hooks/useSearchTerm";
import { RightSideSearch } from "@/components/right-side/right-side-search";


export default function Page() {
  const [isLoading, setIsLoading] = useState(false);
  const [ products, setProducts ] = useState([]);
  const [searchTermNew, setSearchTermNew] = useState("");
  const {currentPage, handlePageNumber} = usePagination("&page=1");
  const { searchTerm, handleSearchTerm } = useSearchTerm(["cod", "description"], 500);

    const loadProducts = async () => {
        setIsLoading(true);
        try {
          const cat = await getData(`restaurant/products?sort=created_at&included=restaurant.workstation,prices,category,assigments.option,menu_order&filterWhere[status]==1&filterWhere[is_restaurant]==1${currentPage}${searchTerm}`);
          setProducts(cat.data);
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
              (async () => { 
        if (searchTerm != searchTermNew) {
          handlePageNumber("&page=1");
          setSearchTermNew(searchTerm);
          await loadProducts();
         } else {
          await loadProducts();
         }
        })(); 
        // eslint-disable-next-line
    }, [currentPage, searchTerm]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-10 pb-10">
        <div className="col-span-7 border-r md:border-sky-600">
        <ViewTitle text="PRODUCTOS" />
          <ProductView products={products} reload={loadProducts} isLoading={isLoading} />
        </div>
        <div className="col-span-3">
          <RightSideSearch handleSearchTerm={handleSearchTerm} />
         <ModifierList reload={loadProducts} /> 
         <CategoriesList reload={loadProducts} />
        </div>
    </div>
  )
}
