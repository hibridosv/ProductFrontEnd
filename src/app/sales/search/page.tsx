'use client'
import { useState, useEffect } from "react";
import { SearchInput } from "@/app/components/form/search";
import { useSearchTerm } from "@/hooks/useSearchTerm";
import { SalesButtons } from "@/app/components/sales-components/sales-buttons";
import { SalesShowTotal } from "@/app/components/sales-components/sales-show-total";
import { getData, postData } from "@/services/resources";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function ViewSales() {
  const { searchTerm, handleSearchTerm } = useSearchTerm()
  const [isLoading, setIsLoading] = useState(false);
  const [products, setProducts] = useState([]);
  const [productsOfInvoice, setProductsOfInvoice] = useState([]);
  const [isSending, setIsSending] = useState(false);
  const [order, setOrder] = useState(null);



  const loadData = async () => {
    setIsLoading(true);
    try {
      const response = await getData(`sales/get-products?sort=-created_at${searchTerm}`);
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


  const loadDataProductsOfInvoice = async () => {
    setIsLoading(true);
    try {
      const response = await getData(`sales/${order}`);
      setProductsOfInvoice(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    if (order) {
        (async () => { await loadDataProductsOfInvoice() })();
    }
  // eslint-disable-next-line
  }, [order]);



  const handleClickOnProduct = async (productId: string) =>{
    let values = {
      product_id: productId,
      order_id: order,
      employee_id: "997b7906-cd01-4502-8b24-b07ffcf4eb3b",
      request_type: 1,
      delivery_type: 1,
      order_type: 1,
      price_type: 1,
    }
    
    handleSearchTerm('')
    try {
      setIsSending(true)
      const response = await postData(`sales`, "POST", values);
      if (!response.message) {
        if (!order) setOrder(response.data.id)
        setProductsOfInvoice(response)
        setProducts([]);
        console.log(response)
      } else {
        toast.error(response.message, { autoClose: 2000 });
      }
    } catch (error) {
      console.error(error);
      toast.error("Ha Ocurrido un Error!", { autoClose: 2000 });
    } finally{
      setIsSending(false)
    }
  }

  const handleClickOption = (option: number) =>{
    console.log(option)
  }

  // console.log(productsOfInvoice)

  const listItems = products?.map((product: any):any => (
    <div key={product.id} onClick={()=>handleClickOnProduct(product.id)}>
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
       <div className="grid grid-cols-1 md:grid-cols-10 pb-10">
              <div className="col-span-6 border-r md:border-sky-600">
                <div className="m-2">
                  <SearchInput placeholder="Buscar Producto" handleSearchTerm={handleSearchTerm} />
                </div>
                <div className="w-full bg-white rounded-lg shadow-lg lg:w-2/3 mt-4">
                  <ul className="divide-y-2 divide-gray-400">
                  { listItems }
                  </ul>
                </div>
                <div>
                  Aqui debe  ir la tabla con los productos 
                  { JSON.stringify(productsOfInvoice) }
                </div>
            </div>
            <div className="col-span-4 flex justify-center static ">
              
              <SalesShowTotal />
              
              <div className="absolute bottom-2">
              <SalesButtons onClick={handleClickOption} />
              </div>
            </div>
      <ToastContainer />
      </div>
      );
}
