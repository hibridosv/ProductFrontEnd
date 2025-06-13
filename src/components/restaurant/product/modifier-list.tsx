"use client";
import { useEffect, useState } from "react";
import { getData, postData } from "@/services/resources";
import { MdDelete } from "react-icons/md";
import { Loading } from "@/components/loading/loading";
import { AiOutlineLoading } from "react-icons/ai";

import { ViewTitle } from "@/components/view-title/view-title";
import { BiPlusCircle } from "react-icons/bi";
import { NothingHere } from "@/components/nothing-here/nothing-here";
import { AddOptionsModal } from "./add-options-modal";
import { OptionsUpdateModal } from "./options-update-modal";
import { DeleteModal } from "@/components/modals/delete-modal";


export interface ModifierListProps {
  reload: () => void;
}

export function ModifierList(props: ModifierListProps) {
  const { reload } = props;
  const [showModalOptions, setShowModalOptions] = useState(false);
  const [ optionSelected, setOptionSelected ] = useState([])
  const [isShowOptionModal, setIsShowOptionModal] = useState(false);
  const [selectOption, setSelectOption] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [ options, setOptions ] = useState([])
  const [isSending, setIsSending] = useState(false);


      const sendDataDelete = async(id: any) => {
          setIsSending(true)
          try {
              const response = await postData(`restaurant/options/${id}`, 'DELETE');
              if (response.type === 'successful') {
                setOptions(options.filter((item: any) => item.id !== id));
                reload();
              }
            } catch (error) {
              console.error(error);
            } finally {
              setIsSending(false)
              setSelectOption("");
              setShowDeleteModal(false);
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
        if (!isShowOptionModal) {
            (async () => { await loadOptions() })();
        }
    // eslint-disable-next-line
    }, [isShowOptionModal]);


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
    <div>
        <div className="flex justify-between">
          <ViewTitle text="MODIFICADORES" />
          <BiPlusCircle size={32} className="col-span-11 m-4 text-2xl text-sky-900 clickeable" onClick={()=>setShowModalOptions(true)} />
          </div>
        { isLoading ? <Loading /> : <>
        <div className="mx-4">
          { options.length === 0 ? <NothingHere text="No hay modificadores" width="165" height="99" /> :
            <div>
              <li className="flex font-semibold text-cyan-800">Modificadores Agregados</li>
              { listModifier }
            </div>
          }
        </div>
        </>}

        <AddOptionsModal isShow={showModalOptions} onClose={() => setShowModalOptions(false)} reload={loadOptions} />
                <OptionsUpdateModal onClose={()=>setIsShowOptionModal(false)} option={optionSelected} isShow={isShowOptionModal} random={loadOptions} />
                  <DeleteModal isShow={showDeleteModal}
                    text="¿Estas seguro de eliminar esta Opción?"
                    onDelete={()=>sendDataDelete(selectOption)} 
                    onClose={()=>setShowDeleteModal(false)} />
    </div>
  );
}
