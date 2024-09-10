'use client'

import { useState, useEffect } from "react";
import { Loading, ViewTitle} from "@/components";
import { getData } from "@/services/resources";
import { ProductView } from "@/components/restaurant/product/product-view";


export default function Page() {
  const [isLoading, setIsLoading] = useState(false);
  const [ products, setProducts ] = useState([])
  const [randomNumber, setRandomNumber] = useState(0);

  

    const loadData = async () => {
        setIsLoading(true);
        try {
          const cat = await getData(`restaurant/products?sort=created_at&included=restaurant.workstation,prices,category,assigments.option,menu_order&filterWhere[status]==1&filterWhere[is_restaurant]==1`);
          setProducts(cat.data);
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
            (async () => { await loadData() })();
        // eslint-disable-next-line
    }, [randomNumber]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-10 pb-10">
        <div className="col-span-7 border-r md:border-sky-600">
        <ViewTitle text="PRODUCTOS" />
          <ProductView products={products} random={setRandomNumber} isLoading={isLoading} />
        </div>
        <div className="col-span-3">
        <ViewTitle text="MODIFICADORES" />

        </div>
    </div>
  )
}
