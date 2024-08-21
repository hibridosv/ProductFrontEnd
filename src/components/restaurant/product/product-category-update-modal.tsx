"use client";
import { useEffect, useState } from "react";
import { Modal } from "flowbite-react";
import { Button, Preset } from "@/components/button/button";
import { getData } from "@/services/resources";
import { Category } from "@/services/products";
import { ArrowIcon} from "@/theme/svg"
import { Loading } from "@/components/loading/loading";


export interface ProductCategoryUpdateModalProps {
  onClose: () => void;
  onSubmit: (data: any) => void
  dataInit: any;
  isShow: boolean;
}

export function ProductCategoryUpdateModal(props: ProductCategoryUpdateModalProps) {
  const { onClose, dataInit, isShow, onSubmit } = props;
  const [isLoading, setIsLoading] = useState(false);
  const [ categories, setCategories ] = useState<Category[]>([])



  const loadData = async () => {
        setIsLoading(true);
        try {
        const cat = await getData(`categories?sort=created_at&filterWhere[category_type]==2&filterWhere[is_restaurant]==1`);
        setCategories(cat.data);
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };


    useEffect(() => {
      if (isShow) {
        (async () => { await loadData() })();
      }
        // eslint-disable-next-line
    }, [isShow]);

    const sendData = (data: any) => {
        onSubmit({ field: dataInit.field, data })
        onClose()
      };

      if (!dataInit.text && !dataInit.field && !dataInit.type && !isShow) {
        return <div></div>
      }
      const style = "flex justify-between p-3 hover:bg-blue-200 hover:text-blue-800 cursor-pointer"
      const styleSelect = "flex justify-between p-3 hover:bg-blue-200 hover:text-blue-800 cursor-pointer bg-cyan-200"
      
      const listItems = categories?.map((category: any):any => (
        <div key={category.id} onClick={()=>sendData(category.id)}>
            <li className={ category.id == dataInit.selected ? styleSelect : style}>
                  {category.name}  { ArrowIcon }
            </li>
        </div>
    ))

  return (
    <Modal size="lg" show={isShow} position="center" onClose={onClose}>
      <Modal.Header>{dataInit.text}</Modal.Header>
      <Modal.Body>
        <div className="mx-4">
            { isLoading ? <Loading /> : listItems }
        </div>
      </Modal.Body>
      <Modal.Footer className="flex justify-end gap-4">
        <Button onClick={onClose} preset={Preset.close} />
      </Modal.Footer>
    </Modal>
  );
}
