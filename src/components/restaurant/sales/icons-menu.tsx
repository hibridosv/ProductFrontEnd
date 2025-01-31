"use client";
import { useEffect, useState } from "react";
import { getData } from "@/services/resources";
import Image from "next/image";
import { URL } from "@/constants";
import { NothingHere } from "@/components/nothing-here/nothing-here";
import { IconMenuCategoryModal } from "./icons-menu-category";
import { useIsOpen } from "@/hooks/useIsOpen";

export interface IconsMenuProps {
  isShow?: boolean;
  selectedIcon: (image: string)=> void
  config: string[];
  isSending: boolean;
}

export function IconsMenu(props: IconsMenuProps) {
  const { isShow, selectedIcon, config, isSending } = props;
  const [ images, setImages ] = useState([] as any)
  const [isLoading, setIsLoading] = useState(false);
  const [selectedcategory, setSelectedcategory] = useState("");
  const imageQuantity = 35;
  const modalCategory = useIsOpen(false);


  const loadImages = async () => {
    setIsLoading(true);
    try {
      const response = await getData(`restaurant/menu?sort=-order&filterWhere[status]==1&included=product.restaurant,category,`);
      setImages(response);
        } catch (error) {
          console.error(error);
        } finally {
          setIsLoading(false);
        }
      };
      
      useEffect(() => {
        if (isShow && !images.data) {
            (async () => { await loadImages() })();
        }
        // eslint-disable-next-line
      }, [isShow]);

      if (!isShow) return <></>

      const imageLoader = ({ src, width, quality }: any) => {
          return `${URL}/images/ico/${src}?w=${width}&q=${quality || 75}`
        }
        


        const result = images.data && images.data.find((item: any) => item.icon_type === 2 && item.alphabet === "PRI");
        const categoryId = result ? result.category_id : null;

        const listItems = images?.data && images.data.map((record: any) => {
            if (record.icon_type == 1 && record.product.category_id != categoryId || record.icon_type == 2 && record.category.id == categoryId) return
            return (
                <div key={record?.id} className="m-2 clickeable" title={record.icon_type == 1 ? record?.product?.description : record?.category?.name }>
                    <div onClick={record.icon_type == 1 ? (isSending ? ()=>{} : () => selectedIcon(record.product_id)) : ()=>{setSelectedcategory(record.category_id); modalCategory.setIsOpen(true)} }
                     className="rounded-md drop-shadow-lg">
                        <Image loader={imageLoader} src={record.icon_type == 1 ? record?.product?.restaurant?.image : record?.category?.img } alt="Icono de imagen" width={96} height={96} className="rounded-t-md" />
                        <p className={`w-full content-center text-center rounded-b-md overflow-hidden uppercase text-xs text-black font-medium p-1 h-9 ${record.icon_type == 1 ? 'bg-slate-300' : 'bg-cyan-200'}`} 
                           style={{ maxWidth: '96px',  wordBreak: 'keep-all', lineHeight: '1.2em' }}>
                            {record.icon_type == 1 ? record?.product?.description : record?.category?.name }
                        </p>
                    </div>
                </div>
            )
        });
        
        

        const listMocks = () => {
            const items = [];
            for (let index = 0; index < imageQuantity; index++) {
              items.push(
                <div key={index} className="w-24 h-24 m-2">
                  <div className="border border-blue-300 shadow rounded-md p-4 max-w-sm w-full mx-auto">
                    <div className="animate-pulse flex space-x-4">
                      <div className="rounded-full bg-slate-700 h-10 w-10"></div>
                      <div className="flex-1 space-y-6 py-1">
                        <div className="h-2 bg-slate-700 rounded"></div>
                        <div className="space-y-3">
                          <div className="h-2 bg-slate-700 rounded"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            }
            return <>{items}</>;
        };
          
      
      return (
        <div>
            <div className="flex flex-wrap justify-center">
            {isLoading ? listMocks() : listItems }
            {((!images?.data || images.data.length == 0) && !isLoading) && <div className="clickeable"><NothingHere text="No se encontraron imágenes" /></div> }
            </div>
            <IconMenuCategoryModal selectedIcon={selectedIcon} isShow={modalCategory.isOpen} onClose={()=>modalCategory.setIsOpen(false)} images={images.data} filter={selectedcategory} config={config}/>
        </div>
  );

}
