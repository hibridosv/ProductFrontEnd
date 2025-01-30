'use client'

import { useState, useEffect } from "react";
import { DeleteModal, Loading, NothingHere, ViewTitle} from "@/components";
import { getData, postData } from "@/services/resources";
import { ProductView } from "@/components/restaurant/product/product-view";
import { AiOutlineLoading } from "react-icons/ai";
import { MdDelete } from "react-icons/md";
import { OptionsUpdateModal } from "@/components/restaurant/product/options-update-modal";
import { set } from "react-hook-form";
import { RiPulseFill } from "react-icons/ri";
import { BiPlusCircle } from "react-icons/bi";
import { AddOptionsModal } from "@/components/restaurant/product/add-options-modal";


export default function Page() {
  const [isLoading, setIsLoading] = useState(false);
  const [ products, setProducts ] = useState([])
  const [ options, setOptions ] = useState([])
  const [ optionSelected, setOptionSelected ] = useState([])
  const [randomNumber, setRandomNumber] = useState(0);
  const [isSending, setIsSending] = useState(false);
  const [isShowOptionModal, setIsShowOptionModal] = useState(false);
  const [showModalOptions, setShowModalOptions] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectOption, setSelectOption] = useState("");

  

    const loadProducts = async () => {
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


    const loadOptions = async () => {
      setIsLoading(true);
      try {
        const option = await getData(`restaurant/options?sort=created_at&included=variants`);
        setOptions(option.data);
      } catch (error) {
          console.error(error);
      } finally {
          setIsLoading(false);
      }
  };


    useEffect(() => {
          (async () => { await loadProducts() })();
        // eslint-disable-next-line
    }, [randomNumber]);

    useEffect(() => {
      if (!showModalOptions && !isShowOptionModal) {
          (async () => { await loadOptions() })();
      }
  // eslint-disable-next-line
}, [showModalOptions, isShowOptionModal]);

    
        const sendDataDelete = async(id: any) => {
            setIsSending(true)
            try {
                const response = await postData(`restaurant/options/${id}`, 'DELETE');
                if (response.type === 'successful') {
                  setOptions(options.filter((item: any) => item.id !== id))
                  setRandomNumber(Math.random());
                }
              } catch (error) {
                console.error(error);
              } finally {
                setIsSending(false)
                setSelectOption("");
                setShowDeleteModal(false);
              }
        };


    const listModifier = options?.map((option: any):any => (
      <div key={option.id} >
          <li className="flex justify-between p-3 hover:bg-blue-50 hover:red-blue-800">
              <span className="clickeable" onClick={()=>{setOptionSelected(option); setIsShowOptionModal(true)}}>{option?.name}</span>  
              { isSending ? <AiOutlineLoading size={24} className="animate-spin" /> : 
              <MdDelete size={24} color="red" className="clickeable" onClick={() => { setSelectOption(option.id); setShowDeleteModal(true); }} /> }
          </li>
      </div>
  ))



  return (
    <div className="grid grid-cols-1 md:grid-cols-10 pb-10">
        <div className="col-span-7 border-r md:border-sky-600">
        <ViewTitle text="PRODUCTOS" />
          <ProductView products={products} random={setRandomNumber} isLoading={isLoading} />
        </div>
        <div className="col-span-3">
          <div className="flex justify-between">
          <ViewTitle text="MODIFICADORES" />
          <BiPlusCircle size={32} className="col-span-11 m-4 text-2xl text-sky-900 clickeable" onClick={()=>setShowModalOptions(true)} />
          </div>
        { isLoading ? <Loading /> : <>
        <div className="mx-4">
          { options.length === 0 ? <NothingHere text="No hay modificadores" /> :
            <div>
              <li className="flex font-semibold text-cyan-800">Modificadores Agregados</li>
              { listModifier }
            </div>
          }
        </div>
        </>}
        <OptionsUpdateModal onClose={()=>setIsShowOptionModal(false)} option={optionSelected} isShow={isShowOptionModal} random={setRandomNumber} />
        <AddOptionsModal isShow={showModalOptions} onClose={() => setShowModalOptions(false)} />
                  <DeleteModal isShow={showDeleteModal}
                    text="¿Estas seguro de eliminar esta Opción?"
                    onDelete={()=>sendDataDelete(selectOption)} 
                    onClose={()=>setShowDeleteModal(false)} />
        </div>
    </div>
  )
}
