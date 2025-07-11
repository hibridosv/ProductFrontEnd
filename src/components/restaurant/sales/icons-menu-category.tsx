"use client";
import {  Modal } from "flowbite-react";
import { Button, Preset } from "@/components/button/button";
import Image from "next/image";
import { URL } from "@/constants";
import { getModalSize } from "@/utils/functions";
import { useEffect } from "react";

export interface IconMenuCategoryModalProps {
  onClose: () => void;
  isShow?: boolean;
  selectedIcon: (image: string)=> void
  images?: any
  filter?: string
  config: string[];
}

export function IconMenuCategoryModal(props: IconMenuCategoryModalProps) {
  const { onClose, isShow, selectedIcon, images, filter, config } = props;
  
  useEffect(() => {
    if (isShow) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isShow]);

        if (!images || !isShow) return <></>

        const imageLoader = ({ src, width, quality }: any) => {
            return `${URL}/images/ico/${src}?w=${width}&q=${quality || 75}`
            }
        
            const imagesFiltered = images && images.filter((item: any) => item.icon_type === 1 && item.category_id === filter);
            const listItems = imagesFiltered && imagesFiltered.map((record: any) => {
                if (record.icon_type == 2) return
                return (
                    <div key={record?.id} className="m-2 clickeable">
                        <div onClick={() => { 
                            selectedIcon(record.product_id); 
                            if (config?.includes("restaurant-sales-modal-dismis-category")) {
                                onClose();
                            }
                        }}
                         className="rounded-md drop-shadow-lg">
                            <Image loader={imageLoader} src={record?.product?.restaurant?.image} alt="Icono de imagen" width={96} height={96} className="rounded-t-md" />
                            <p className={`w-full content-center text-center rounded-b-md overflow-hidden uppercase text-xs text-black font-medium p-1 h-9 bg-slate-300`} 
                               style={{ maxWidth: '96px',  wordBreak: 'keep-all', lineHeight: '1.2em' }}>
                                {record?.product?.description}
                            </p>
                        </div>
                    </div>
                )
            });
            

      return (
          <Modal size={getModalSize(imagesFiltered)} show={isShow} position="center" onClose={onClose}>
            <Modal.Header>SELECCIONAR PRODUCTO</Modal.Header>
                <Modal.Body>
                    <div className="flex flex-wrap justify-center">
                        {listItems }
                    </div>
                </Modal.Body>
                <Modal.Footer className="flex justify-end gap-4">
                    <Button onClick={onClose} preset={Preset.close} />
                </Modal.Footer>
        </Modal>
        );

}
