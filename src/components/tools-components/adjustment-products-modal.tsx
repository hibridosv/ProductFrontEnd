"use client";
import { Modal } from "flowbite-react";
import { Button, Preset } from "../button/button";
import { useEffect, useState } from "react";
import {  loadData } from "@/utils/functions";
import { Pagination, usePagination } from "../pagination";
import { AdjustmentProductsTable } from "./adjustment-products-table";


export interface AdjustmentProductsModalProps {
    onClose: () => void;
    isShow: boolean;
    record?: any;
}

export function AdjustmentProductsModal(props: AdjustmentProductsModalProps) {
    const { onClose, isShow, record } = props;
    const [products, setProducts] = useState([] as any);
    const {currentPage, handlePageNumber} = usePagination("&page=1");
    const [isSending, setIsSending] = useState(false);
  
    useEffect(() => {
        if (isShow) {
            (async () => {
                setIsSending(true)
                    setProducts(await loadData(`adjustment/${record}?perPage=25${currentPage}`))
                setIsSending(false)
            })();
        }
        // eslint-disable-next-line
      }, [isShow, currentPage]);

  return (
    <Modal size={`${isSending ? "md" : "4xl"}`} show={isShow} position="center" onClose={onClose}>
      <Modal.Header>PRODUCTOS CAMBIADOS</Modal.Header>
      <Modal.Body>

        <AdjustmentProductsTable records={products} isLoading={isSending} />
        <Pagination records={products} handlePageNumber={handlePageNumber } />

      </Modal.Body>
      <Modal.Footer className="flex justify-end gap-4">
        <Button onClick={onClose} preset={Preset.close} />
      </Modal.Footer>
    </Modal>
  );
}
