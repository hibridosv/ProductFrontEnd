'use client'
import { useState, useEffect } from "react";
import { getData, postData } from "../../services/resources";
import { ProductsTable, RightSideProducts, Loading, Pagination, ViewTitle } from "../components";
import { usePagination } from "../components/pagination";
import { useSearchTerm } from "../../hooks/useSearchTerm";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function ViewProducts() {
  const [isLoading, setIsLoading] = useState(false);
  const [productos, setProductos] = useState([]);
  const [ statics, setStatics ] = useState([])
  const {currentPage, handlePageNumber} = usePagination("&page=1");
  const { searchTerm, handleSearchTerm } = useSearchTerm()
  const menu = [
    {"name": "AGREGAR PRODUCTO", "link": "/product/add"}, 
    {"name": "IMPRIMIR", "link": "/"}
  ];

  const loadData = async () => {
      setIsLoading(true);
      try {
        const response = await getData(`products?sort=-created_at&perPage=10${currentPage}${searchTerm}`);
        setProductos(response);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
  };
    

  useEffect(() => {
    (async () => {
      await loadData();
    })();
    // eslint-disable-next-line
  }, [currentPage, searchTerm]);


  useEffect(() => {
    (async () => {
      try {
        const data = await getData("special/products");
        setStatics(data);
      } catch (error) {
        console.error(error);
      }
    })();
  }, [productos]);


  const deleteProduct = async (iden: number) => {
    const id = toast.loading("Eliminando...")
    try {
      const response = await postData(`products/${iden}`, 'DELETE');
      toast.update(id, { render: response.message, type: "success", isLoading: false, autoClose: 2000 });
      // toast.info(response.message);
      await loadData();
    } catch (error) {
      console.error(error);
      toast.update(id, { render: "Ha ocurrido un error!", type: "error", isLoading: false, autoClose: 2000 });
    } 
  }

  return (
       <div className="grid grid-cols-1 md:grid-cols-4 pb-10">
              <div className="col-span-3">
                <ViewTitle text="PRODUCTOS" links={menu} />

              { isLoading ? <Loading /> : <>
                <ProductsTable 
                products={productos}
                onDelete={deleteProduct} 
                 />
                <Pagination 
                products={productos}
                handlePageNumber={handlePageNumber } 
                />
                </>
              }
            </div>
            <div>
                <RightSideProducts 
                products={productos}
                handleSearchTerm={handleSearchTerm}
                statics={statics}
                 />
            </div>
            <ToastContainer />
      </div>
      );
}
