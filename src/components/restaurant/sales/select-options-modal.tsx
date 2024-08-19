"use client";
import { Button, Preset } from "@/components/button/button";
import { Modal } from "flowbite-react";
import { getLastElement } from "@/utils/functions";
import Image from "next/image";
import { URL } from "@/constants";



export interface SelectOptionsModalProps {
  order?: any;
  isShow?: boolean;
  isSending?: boolean;
  selectOption: ({})=> void
}

export function SelectOptionsModal(props: SelectOptionsModalProps) {
  const {  order, isShow, isSending, selectOption } = props;

  const imageLoader = ({ src, width, quality }: any) => {
    return `${URL}/images/ico/${src}?w=${width}&q=${quality || 75}`
    }

    const lastElement = getLastElement(order?.invoiceproducts)
    const lastOption = getLastElement(lastElement?.options, 0)


  const listItems = lastElement && lastElement?.options.map((record: any) => {
    if (record?.iden == lastOption?.iden) {
        return (
            <div key={record?.id} className="m-2 clickeable">
                <div onClick={() => { selectOption({ order_id: order.id, id: record.id, iden: record.iden}) }}
                 className="rounded-md drop-shadow-lg">
                    <Image loader={imageLoader} src={record?.option?.image} alt="Icono" width={96} height={96} className="rounded-t-md" />
                    <p className={`w-full content-center text-center rounded-b-md overflow-hidden uppercase text-xs text-black font-medium p-1 h-9 bg-slate-300`} 
                       style={{ maxWidth: '96px',  wordBreak: 'keep-all', lineHeight: '1.2em' }}>
                        {record?.option?.name}
                    </p>
                </div>
            </div>
        )
    }

});

  return (
    <Modal show={isShow} position="center" size="md" >
      <Modal.Header className="uppercase">{ lastElement?.product }</Modal.Header>
      <Modal.Body>
                <div className="flex flex-wrap justify-center">
                    {listItems }
                </div>
      </Modal.Body>
      <Modal.Footer className="flex justify-end">
        <Button preset={Preset.close} isFull disabled={isSending} text="Saltar Opción" onClick={() => { selectOption({ order_id: order.id, id: lastOption.id, iden: lastOption.iden}) }} /> 
      </Modal.Footer>
    </Modal>
  );
}
